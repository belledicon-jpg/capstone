import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PostCard } from "@/components/posts/PostCard";
import { blogStore } from "@/services/blogStore";
import { Post } from "@/types/blog";
import { MOCK_PROFILES } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, TrendingUp, BookOpen, PenSquare, ArrowRight, ShieldCheck, Database } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const CATEGORIES = ["All", "Architecture", "Engineering", "Design", "AI & Future", "Database"];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const publishedPosts = blogStore.getPublishedPosts();

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchCat = selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  const featuredPost = publishedPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id || searchQuery || selectedCategory !== "All");

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Editorial Hero Banner */}
        <section className="border-b border-border/50 bg-gradient-to-b from-amber-500/5 via-background to-background py-12 sm:py-16">
          <div className="container px-4 sm:px-8 max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Eprovider Native Platform Blog
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                  Ideas, Systems & Editorial Craft
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Deep technical articles, system architecture patterns, and thoughts on craft—powered by multi-tenant PostgreSQL, RLS, and Edge Functions.
                </p>
              </div>

              {/* Quick Search Bar */}
              <div className="w-full md:w-72">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card rounded-full border-border/80 text-xs h-10 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-foreground text-background font-semibold shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Body */}
        <div className="container px-4 sm:px-8 max-w-6xl mt-8 space-y-12">
          {/* Featured Hero Story (when not searching) */}
          {!searchQuery && selectedCategory === "All" && featuredPost && (
            <section>
              <PostCard post={featuredPost} featured />
            </section>
          )}

          {/* Grid of Articles + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Primary Articles Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  {searchQuery ? `Search results for "${searchQuery}"` : "Latest Stories"}
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  {gridPosts.length} {gridPosts.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {gridPosts.length === 0 ? (
                <div className="p-12 text-center bg-card rounded-3xl border border-dashed border-border space-y-3">
                  <p className="text-muted-foreground text-sm">No articles found matching your criteria.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="text-xs rounded-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {gridPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: Authors, Architecture & Trending */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Eprovider Highlights Card */}
              <div className="p-5 bg-gradient-to-br from-amber-500/10 via-card to-card rounded-3xl border border-amber-500/20 space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Database className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-foreground">Eprovider Multi-Tenant</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Posts and comments are isolated inside schema <code className="text-foreground font-mono text-[10px]">tenant_5e712edc...</code> using row-level policies.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="w-full text-xs rounded-full h-8">
                    <Link to="/editor">Write a Post</Link>
                  </Button>
                </div>
              </div>

              {/* Author Spotlight */}
              <div className="p-5 bg-card rounded-3xl border border-border/80 space-y-4 shadow-sm">
                <h3 className="font-serif font-bold text-sm text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Featured Writers
                </h3>
                <div className="space-y-3">
                  {Object.values(MOCK_PROFILES).slice(0, 3).map((author) => (
                    <div key={author.id} className="flex items-center gap-3">
                      <img
                        src={author.avatar_url}
                        alt={author.display_name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{author.display_name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{author.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-8 bg-card text-xs text-muted-foreground">
        <div className="container px-4 sm:px-8 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-foreground">Eprovider Blog Engine</span>
            <span>•</span>
            <span>PostgreSQL RLS & Edge Functions</span>
          </div>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;