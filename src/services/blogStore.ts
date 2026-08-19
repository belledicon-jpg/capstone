import { Post, Comment, PostRevision, CommentModerationRecord, Profile } from "@/types/blog";
import { INITIAL_POSTS, INITIAL_COMMENTS, MOCK_PROFILES } from "@/data/mockData";
import { authService } from "./eproviderAuth";
import { EPROVIDER_CONFIG, REST_URL } from "@/config/eprovider";

const POSTS_STORAGE_KEY = "eprovider_blog_posts_v1";
const COMMENTS_STORAGE_KEY = "eprovider_blog_comments_v1";
const REVISIONS_STORAGE_KEY = "eprovider_blog_revisions_v1";

class BlogStore {
  private posts: Post[] = [];
  private comments: Comment[] = [];
  private revisions: PostRevision[] = [];
  private moderationLogs: CommentModerationRecord[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
      const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
      const storedRevisions = localStorage.getItem(REVISIONS_STORAGE_KEY);

      this.posts = storedPosts ? JSON.parse(storedPosts) : INITIAL_POSTS;
      this.comments = storedComments ? JSON.parse(storedComments) : INITIAL_COMMENTS;
      this.revisions = storedRevisions ? JSON.parse(storedRevisions) : [];
    } catch {
      this.posts = INITIAL_POSTS;
      this.comments = INITIAL_COMMENTS;
      this.revisions = [];
    }
  }

  private persist() {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(this.posts));
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(this.comments));
      localStorage.setItem(REVISIONS_STORAGE_KEY, JSON.stringify(this.revisions));
    } catch (e) {
      console.warn("Storage quota or error:", e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // --- POSTS OPERATIONS ---

  public getPosts(includeDrafts = false): Post[] {
    const user = authService.getUser();
    if (!user) {
      return this.posts.filter((p) => p.status === "published");
    }

    if (user.role === "admin" || user.role === "moderator" || includeDrafts) {
      return [...this.posts];
    }

    // Authors see published + their own drafts
    return this.posts.filter(
      (p) => p.status === "published" || p.author_id === user.id
    );
  }

  public getPublishedPosts(): Post[] {
    return this.posts
      .filter((p) => p.status === "published")
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }

  public getPostBySlug(slug: string): Post | undefined {
    return this.posts.find((p) => p.slug === slug);
  }

  public getPostById(id: string): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  public saveDraft(postData: Partial<Post> & { title: string; content: any }): Post {
    const user = authService.getUser();
    const authorId = user ? user.id : "usr-admin-01";
    const authorProfile = user || MOCK_PROFILES["usr-admin-01"];

    const slug =
      postData.slug ||
      postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      "untitled-" + Date.now();

    const existingIndex = postData.id ? this.posts.findIndex((p) => p.id === postData.id) : -1;

    let savedPost: Post;

    if (existingIndex >= 0) {
      const existing = this.posts[existingIndex];
      // Save revision before modifying
      this.saveRevision(existing.id, existing.title, existing.content);

      savedPost = {
        ...existing,
        ...postData,
        slug,
        updated_at: new Date().toISOString(),
      };
      this.posts[existingIndex] = savedPost;
    } else {
      savedPost = {
        id: "post-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        author_id: authorId,
        author: authorProfile,
        title: postData.title,
        slug,
        excerpt: postData.excerpt || "",
        content: postData.content || [],
        cover_image: postData.cover_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80",
        category: postData.category || "Technology",
        tags: postData.tags || ["General"],
        status: postData.status || "draft",
        claps_count: 0,
        read_time_minutes: Math.max(1, Math.ceil(JSON.stringify(postData.content).length / 800)),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.posts.unshift(savedPost);
    }

    this.persist();
    return savedPost;
  }

  public publishPost(id: string): Post | undefined {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const post = this.posts[index];
    this.saveRevision(post.id, post.title, post.content);

    const updated: Post = {
      ...post,
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.posts[index] = updated;
    this.persist();
    return updated;
  }

  public schedulePost(id: string, scheduledDate: string): Post | undefined {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const post = this.posts[index];
    const updated: Post = {
      ...post,
      status: "scheduled",
      scheduled_at: scheduledDate,
      updated_at: new Date().toISOString(),
    };

    this.posts[index] = updated;
    this.persist();
    return updated;
  }

  public deletePost(id: string): boolean {
    const initialLen = this.posts.length;
    this.posts = this.posts.filter((p) => p.id !== id);
    if (this.posts.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public clapPost(id: string): number {
    const post = this.posts.find((p) => p.id === id);
    if (post) {
      post.claps_count = (post.claps_count || 0) + 1;
      this.persist();
      return post.claps_count;
    }
    return 0;
  }

  // --- REVISIONS ---

  public saveRevision(postId: string, title: string, content: any[]) {
    const user = authService.getUser();
    const revision: PostRevision = {
      id: "rev-" + Date.now(),
      post_id: postId,
      editor_id: user ? user.id : "usr-admin-01",
      editor_name: user ? user.display_name : "System",
      title,
      content,
      created_at: new Date().toISOString(),
    };
    this.revisions.unshift(revision);
  }

  public getRevisions(postId: string): PostRevision[] {
    return this.revisions.filter((r) => r.post_id === postId);
  }

  // --- COMMENTS & MODERATION ---

  public getComments(postId?: string): Comment[] {
    if (!postId) return this.comments;
    return this.comments.filter((c) => c.post_id === postId);
  }

  public getPublicComments(postId: string): Comment[] {
    const user = authService.getUser();
    return this.comments
      .filter((c) => c.post_id === postId)
      .filter((c) => {
        if (c.status === "approved") return true;
        if (user && (c.author_id === user.id || user.role === "admin" || user.role === "moderator")) {
          return true;
        }
        return false;
      });
  }

  public addComment(postId: string, content: string, parentId: string | null = null): Comment {
    const user = authService.getUser() || MOCK_PROFILES["usr-reader-04"];
    
    // Auto-approve if moderator/admin, otherwise pending review
    const isPrivileged = user.role === "admin" || user.role === "moderator";
    const initialStatus = isPrivileged ? "approved" : "pending";

    const newComment: Comment = {
      id: "c-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      post_id: postId,
      author_id: user.id,
      author: user,
      parent_id: parentId,
      content,
      status: initialStatus,
      created_at: new Date().toISOString(),
      replies: [],
    };

    if (parentId) {
      // Find parent to attach reply
      const attachToParent = (list: Comment[]): boolean => {
        for (const item of list) {
          if (item.id === parentId) {
            item.replies = item.replies || [];
            item.replies.push(newComment);
            return true;
          }
          if (item.replies && attachToParent(item.replies)) return true;
        }
        return false;
      };

      if (!attachToParent(this.comments)) {
        this.comments.push(newComment);
      }
    } else {
      this.comments.push(newComment);
    }

    this.persist();
    return newComment;
  }

  public moderateComment(commentId: string, action: "approve" | "reject" | "spam", reason: string = ""): boolean {
    const user = authService.getUser() || MOCK_PROFILES["usr-mod-02"];
    const targetStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "spam";

    let modified = false;

    const findAndUpdate = (list: Comment[]): boolean => {
      for (const item of list) {
        if (item.id === commentId) {
          item.status = targetStatus;
          modified = true;
          return true;
        }
        if (item.replies && findAndUpdate(item.replies)) return true;
      }
      return false;
    };

    findAndUpdate(this.comments);

    if (modified) {
      this.moderationLogs.unshift({
        id: "mod-log-" + Date.now(),
        comment_id: commentId,
        moderator_id: user.id,
        moderator_name: user.display_name,
        action,
        reason,
        created_at: new Date().toISOString(),
      });
      this.persist();
    }

    return modified;
  }

  public getModerationQueue(): Comment[] {
    const flat: Comment[] = [];
    const collectAll = (list: Comment[]) => {
      for (const c of list) {
        flat.push(c);
        if (c.replies) collectAll(c.replies);
      }
    };
    collectAll(this.comments);
    return flat.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Trigger Cron Job to publish any due scheduled posts
  public processScheduledPosts(): number {
    const now = new Date().getTime();
    let publishedCount = 0;

    this.posts.forEach((post) => {
      if (post.status === "scheduled" && post.scheduled_at) {
        if (new Date(post.scheduled_at).getTime() <= now) {
          post.status = "published";
          post.published_at = new Date().toISOString();
          publishedCount++;
        }
      }
    });

    if (publishedCount > 0) {
      this.persist();
    }
    return publishedCount;
  }

  // Reset to initial seed demo
  public resetToDefaults() {
    this.posts = INITIAL_POSTS;
    this.comments = INITIAL_COMMENTS;
    this.revisions = [];
    this.persist();
  }
}

export const blogStore = new BlogStore();