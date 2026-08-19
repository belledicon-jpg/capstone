import { useState } from "react";
import { Comment } from "@/types/blog";
import { blogStore } from "@/services/blogStore";
import { authService } from "@/services/eproviderAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CornerDownRight, ShieldAlert, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

interface Props {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const CommentSection = ({ postId, comments, onCommentAdded }: Props) => {
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentUser = authService.getUser();

  const handlePostComment = (parentId: string | null = null) => {
    const text = parentId ? replyText : commentText;
    if (!text.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const added = blogStore.addComment(postId, text.trim(), parentId);
      if (added.status === "pending") {
        toast.info("Your comment has been submitted and is pending moderator approval.");
      } else {
        toast.success("Comment posted!");
      }

      if (parentId) {
        setReplyToId(null);
        setReplyText("");
      } else {
        setCommentText("");
      }

      onCommentAdded();
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const author = comment.author;
    const isPending = comment.status === "pending";
    const dateFormatted = new Date(comment.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <div
        key={comment.id}
        className={`p-4 rounded-2xl transition-all ${
          isReply ? "ml-6 sm:ml-10 mt-3 bg-secondary/30 border-l-2 border-amber-500/60" : "bg-card border border-border/70"
        } ${isPending ? "border-dashed border-amber-500/50 bg-amber-500/5" : ""}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <img
              src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.author_id}`}
              alt={author?.display_name || "User"}
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{author?.display_name || "Community Member"}</span>
                {author?.role && author.role !== "author" && (
                  <Badge variant="outline" className="text-[9px] uppercase px-1 py-0 h-4 font-mono text-indigo-600 bg-indigo-50">
                    {author.role}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{dateFormatted}</span>
            </div>
          </div>

          {isPending && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/30 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Pending Moderation
            </Badge>
          )}
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pl-9">
          {comment.content}
        </p>

        {/* Reply Action */}
        <div className="mt-2 pl-9 flex items-center gap-3">
          <button
            onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
            className="text-[11px] font-semibold text-muted-foreground hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <CornerDownRight className="h-3 w-3" />
            {replyToId === comment.id ? "Cancel Reply" : "Reply"}
          </button>
        </div>

        {/* Inline Reply Box */}
        {replyToId === comment.id && (
          <div className="mt-3 ml-9 p-3 bg-secondary/50 rounded-xl space-y-2 border border-border">
            <Textarea
              placeholder={`Replying to ${author?.display_name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="text-xs resize-none bg-background"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="text-xs h-7">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handlePostComment(comment.id)}
                disabled={submitting}
                className="text-xs h-7 bg-amber-600 hover:bg-amber-700 text-white"
              >
                Send Reply
              </Button>
            </div>
          </div>
        )}

        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 mt-2">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-600" />
          Responses ({comments.length})
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          Eprovider Realtime Live
        </span>
      </div>

      {/* Main Comment Composer */}
      <div className="p-4 bg-card rounded-2xl border border-border shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <img
            src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=guest`}
            alt=""
            className="w-5 h-5 rounded-full"
          />
          <span>Posting as <strong className="text-foreground">{currentUser?.display_name || "Guest Reader"}</strong></span>
        </div>
        <Textarea
          placeholder="What are your thoughts on this article? Join the discussion..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          className="resize-none text-sm bg-background/50 focus:bg-background"
        />
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-muted-foreground">
            Comments are reviewed by moderators before public publishing.
          </p>
          <Button
            size="sm"
            onClick={() => handlePostComment(null)}
            disabled={submitting || !commentText.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-4 gap-1.5 font-medium"
          >
            <Send className="h-3.5 w-3.5" />
            Post Response
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-secondary/30 rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
            No comments yet. Be the first to share your perspective!
          </div>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};