export type UserRole = "author" | "moderator" | "admin";

export interface Profile {
  id: string;
  email?: string;
  display_name: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export interface PostContentBlock {
  id: string;
  type: "paragraph" | "heading1" | "heading2" | "heading3" | "quote" | "code" | "image" | "list";
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
  content: PostContentBlock[];
  cover_image?: string;
  category: string;
  tags: string[];
  status: PostStatus;
  published_at?: string;
  scheduled_at?: string;
  claps_count: number;
  read_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  parent_id?: string | null;
  content: string;
  status: CommentStatus;
  replies?: Comment[];
  created_at: string;
  updated_at?: string;
}

export interface CommentModerationRecord {
  id: string;
  comment_id: string;
  moderator_id: string;
  moderator_name?: string;
  action: "approve" | "reject" | "spam";
  reason?: string;
  created_at: string;
}

export interface PostRevision {
  id: string;
  post_id: string;
  editor_id: string;
  editor_name?: string;
  title: string;
  content: PostContentBlock[];
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
  profile: Profile;
}