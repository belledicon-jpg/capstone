import { Link } from "react-router-dom";
import { Post } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageSquare, Sparkles } from "lucide-react";

interface Props {
  post: Post;
  featured?: boolean;
}

export const PostCard = ({ post, featured = false }: Props) => {
  const author = post.author;
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 bg-card rounded-3xl border border-border/80 hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border-none font-medium px-3 py-1">
                Featured Story
              </Badge>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.read_time_minutes || 5} min read
              </span>
            </div>

            <Link to={`/post/${post.slug}`} className="block">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground group-hover:text-amber-600 transition-colors leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-muted-foreground text-sm sm:text-base line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author_id}`}
                alt={author?.display_name || "Author"}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
              />
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">{author?.display_name || "Elena Rostova"}</p>
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" /> {post.claps_count}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 overflow-hidden rounded-2xl">
          <Link to={`/post/${post.slug}`}>
            <img
              src={post.cover_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"}
              alt={post.title}
              className="w-full h-64 sm:h-80 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col justify-between p-5 bg-card rounded-2xl border border-border/80 hover:border-amber-500/30 transition-all duration-200 shadow-sm hover:shadow-md">
      <div>
        {post.cover_image && (
          <div className="mb-4 overflow-hidden rounded-xl h-44">
            <Link to={`/post/${post.slug}`}>
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-[11px] font-medium py-0.5">
            {post.category}
          </Badge>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.read_time_minutes || 4}m
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author_id}`}
            alt={author?.display_name || "Author"}
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground leading-tight truncate max-w-[110px]">
              {author?.display_name || "Author"}
            </span>
            <span className="text-[10px] text-muted-foreground">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
          <span className="font-medium text-[11px]">{post.claps_count}</span>
        </div>
      </div>
    </article>
  );
};