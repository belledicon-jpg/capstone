-- ==========================================================
-- Eprovider Blog Database Schema with RLS & request_user_id()
-- Tenant Schema: tenant_5e712edcdf1d4783a1b626c8dacf0eec
-- ==========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT request_user_id(),
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('author', 'moderator', 'admin')),
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT TO authenticated WITH CHECK (id = request_user_id());

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE TO authenticated USING (id = request_user_id() OR EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role = 'admin'
    ));

-- 2. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    cover_image TEXT,
    category TEXT DEFAULT 'Engineering',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    read_time_minutes INTEGER DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO authenticated;
GRANT SELECT ON posts TO anon;

CREATE POLICY "posts_select" ON posts
    FOR SELECT USING (
        status = 'published'
        OR (request_user_id() IS NOT NULL AND author_id = request_user_id())
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "posts_insert" ON posts
    FOR INSERT TO authenticated WITH CHECK (author_id = request_user_id());

CREATE POLICY "posts_update" ON posts
    FOR UPDATE TO authenticated USING (
        author_id = request_user_id()
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "posts_delete" ON posts
    FOR DELETE TO authenticated USING (
        author_id = request_user_id()
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role = 'admin'
        )
    );

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO authenticated;
GRANT SELECT ON comments TO anon;

CREATE POLICY "comments_select" ON comments
    FOR SELECT USING (
        status = 'approved'
        OR (request_user_id() IS NOT NULL AND author_id = request_user_id())
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "comments_insert" ON comments
    FOR INSERT TO authenticated WITH CHECK (author_id = request_user_id());

CREATE POLICY "comments_update" ON comments
    FOR UPDATE TO authenticated USING (
        author_id = request_user_id()
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "comments_delete" ON comments
    FOR DELETE TO authenticated USING (
        author_id = request_user_id()
        OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

-- 4. Comment Moderation Audit Table
CREATE TABLE IF NOT EXISTS comment_moderation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    moderator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'spam')),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comment_moderation ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON comment_moderation TO authenticated;

CREATE POLICY "moderation_select" ON comment_moderation
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "moderation_insert" ON comment_moderation
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

-- 5. Post Revisions Table
CREATE TABLE IF NOT EXISTS post_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    editor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE post_revisions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON post_revisions TO authenticated;

CREATE POLICY "revisions_select" ON post_revisions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM posts WHERE posts.id = post_revisions.post_id AND posts.author_id = request_user_id()
        ) OR EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = request_user_id() AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "revisions_insert" ON post_revisions
    FOR INSERT TO authenticated WITH CHECK (
        editor_id = request_user_id()
    );