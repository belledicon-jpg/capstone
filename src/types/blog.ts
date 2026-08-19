export type UserRole = "author" | "moderator" | "admin";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export interface ContentBlock {
  id: string;
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "quote" | "code" | "image" | "bullet_list" | "callout";
  text?: string;
  url?: string;
  caption?: string;
  language?: string;
  items?: string[];
}

export interface Post {
  id: string;
  author_id: string;
  author?: Profile;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  cover_image?: string;
  category: string;
  tags: string[];
  read_time_minutes: number;
  status: PostStatus;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  likes_count?: number;
}

export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  parent_id: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface CommentModeration {
  id: string;
  comment_id: string;
  moderator_id: string;
  moderator?: Profile;
  action: "approve" | "reject" | "spam";
  reason?: string;
  created_at: string;
  comment_preview?: string;
}

export interface PostRevision {
  id: string;
  post_id: string;
  editor_id: string;
  editor?: Profile;
  title: string;
  content: ContentBlock[];
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
  };
}