import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { blogStore } from "@/services/blogStore";
import { Post, Comment } from "@/types/blog";
import { CommentSection } from "@/components/comments/CommentSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, ArrowLeft, Share2, Bookmark, Check, Sparkles, MessageSquare, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/eproviderAuth";

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentUser = authService.getUser();

  useEffect(() => {
    if (!slug) return;
    const found = blogStore.getPostBySlug(slug) || blogStore.getPostById(slug);
    setPost(found);
    if (found) {
      setComments(blogStore.getPublicComments(found.id));
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshComments = () => {
    if (post) {
      setComments(blogStore.getPublicComments(post.id));
    }
  };

  const handleClap = () => {
    if (!post) return;
    const newCount = blogStore.clapPost(post.id);
    setPost({ ...post, claps_count: newCount });
    setClapped(true);
    toast.success("Applauded story!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="font-serif text-3xl font-bold">Article not found</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            The requested post may be a private draft or has been unpublished.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const author = post.author;
  const isAuthorOrAdmin = currentUser?.id === post.author_id || currentUser?.role === "admin";
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-amber-600 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-1 pb-20">
        {/* Article Header */}
        <header className="container max-w-4xl px-4 sm:px-8 pt-8 sm:pt-12 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-muted-foreground hover:text-foreground -ml-2 mb-2"
          >
            <Link to="/">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to stories
            </Link>
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-semibold py-1 px-3">
              {post.category}
            </Badge>
            {post.tags.map((t) => (
              <span key={t} className="text-xs text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-full">
                #{t}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-serif">
            {post.excerpt}
          </p>

          {/* Author bar & actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60">
            <div className="flex items-center gap-3">
              <img
                src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author_id}`}
                alt={author?.display_name || "Author"}
                className="w-11 h-11 rounded-full object-cover ring-1 ring-border"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{author?.display_name || "Elena Rostova"}</span>
                  {author?.role && (
                    <Badge variant="outline" className="text-[9px] uppercase font-mono text-amber-700 bg-amber-50">
                      {author.role}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.read_time_minutes || 5} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthorOrAdmin && (
                <Button variant="outline" size="sm" asChild className="rounded-full text-xs gap-1 h-9">
                  <Link to={`/editor/${post.id}`}>
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Link>
                </Button>
              )}
              <Button
                variant={clapped ? "default" : "outline"}
                size="sm"
                onClick={handleClap}
                className={`rounded-full text-xs gap-1.5 h-9 ${clapped ? "bg-rose-600 text-white hover:bg-rose-700" : ""}`}
              >
                <Heart className={`h-3.5 w-3.5 ${clapped ? "fill-white" : "text-rose-500"}`} />
                <span>{post.claps_count}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="rounded-full text-xs h-9 px-3"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.cover_image && (
          <div className="container max-w-4xl px-4 sm:px-8 my-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-80 sm:h-[420px] object-cover rounded-3xl shadow-sm border border-border"
            />
          </div>
        )}

        {/* Rich Content Article Body */}
        <article className="container max-w-3xl px-4 sm:px-8 space-y-6 text-foreground text-base sm:text-lg leading-relaxed font-serif">
          {post.content.map((block) => {
            if (block.type === "paragraph") {
              return <p key={block.id} className="text-foreground/90 font-serif leading-8">{block.text}</p>;
            }
            if (block.type === "heading1") {
              return <h2 key={block.id} className="font-serif text-3xl font-bold pt-4 text-foreground">{block.text}</h2>;
            }
            if (block.type === "heading2") {
              return <h3 key={block.id} className="font-serif text-2xl font-bold pt-3 text-foreground">{block.text}</h3>;
            }
            if (block.type === "heading3") {
              return <h4 key={block.id} className="font-serif text-xl font-semibold pt-2 text-foreground">{block.text}</h4>;
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={block.id}
                  className="p-6 my-6 border-l-4 border-amber-600 bg-amber-500/5 rounded-r-2xl italic text-lg sm:text-xl font-serif text-foreground/95"
                >
                  {block.text}
                </blockquote>
              );
            }
            if (block.type === "code") {
              return (
                <div key={block.id} className="my-6 rounded-2xl overflow-hidden bg-slate-950 text-slate-100 p-4 font-mono text-xs sm:text-sm">
                  {block.language && (
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-bold">
                      {block.language}
                    </div>
                  )}
                  <pre className="overflow-x-auto whitespace-pre-wrap">{block.text}</pre>
                </div>
              );
            }
            if (block.type === "image" && block.url) {
              return (
                <figure key={block.id} className="my-6 space-y-2">
                  <img src={block.url} alt="" className="w-full rounded-2xl object-cover max-h-96" />
                  {block.caption && (
                    <figcaption className="text-xs text-center text-muted-foreground italic">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return null;
          })}
        </article>

        {/* Author Bio Box */}
        <div className="container max-w-3xl px-4 sm:px-8 mt-12">
          <div className="p-6 bg-card rounded-3xl border border-border/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author_id}`}
              alt={author?.display_name || "Author"}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/30"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="font-serif font-bold text-lg text-foreground">Written by {author?.display_name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {author?.bio || "Technical writer and software engineer exploring distributed database architecture on Eprovider."}
              </p>
            </div>
          </div>
        </div>

        {/* Responses & Realtime Comments Section */}
        <div className="container max-w-3xl px-4 sm:px-8 mt-12">
          <CommentSection postId={post.id} comments={comments} onCommentAdded={refreshComments} />
        </div>
      </main>
    </div>
  );
};

export default PostDetail;