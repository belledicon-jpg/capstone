import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/eproviderAuth";
import { AuthSession, Profile } from "@/types/blog";
import { MOCK_PROFILES } from "@/data/mockData";
import { blogStore } from "@/services/blogStore";
import {
  PenSquare,
  ShieldCheck,
  LayoutDashboard,
  User,
  LogOut,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle2,
  Sliders,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EproviderStatusModal } from "@/components/layout/EproviderStatusModal";

export const Navbar = () => {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = authService.subscribe((s) => setSession(s));
    return unsub;
  }, []);

  const handleRoleSwitch = (profileId: string) => {
    authService.switchUser(profileId);
    const p = MOCK_PROFILES[profileId];
    toast.success(`Switched role to ${p.display_name} (${p.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    authService.logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const handleProcessCron = () => {
    const published = blogStore.processScheduledPosts();
    if (published > 0) {
      toast.success(`Cron Job executed: ${published} scheduled post(s) published!`);
    } else {
      toast.info("Cron Job executed: No pending scheduled posts reached their target time.");
    }
  };

  const user = session?.profile;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-sm transition-transform group-hover:scale-105">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  Eprovider <span className="text-xs font-sans font-semibold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-full">Blog</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono -mt-1 hidden sm:inline">
                  tenant_5e712edc...
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  location.pathname === "/"
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                Explore
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    location.pathname === "/dashboard"
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {(user?.role === "admin" || user?.role === "moderator") && (
                <Link
                  to="/moderation"
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    location.pathname === "/moderation"
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  Moderation
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Eprovider Status Pill */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground border-border/80 hover:bg-secondary rounded-full px-3"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Eprovider Native</span>
              <Sliders className="h-3 w-3 ml-0.5 text-muted-foreground" />
            </Button>

            {/* Cron Trigger Tool */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProcessCron}
              title="Run Cron Job: Publish scheduled posts"
              className="text-muted-foreground hover:text-foreground h-9 px-2.5 hidden sm:flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs">Cron</span>
            </Button>

            {/* Write New Post Button */}
            <Button
              asChild
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full shadow-sm gap-1.5 px-4"
            >
              <Link to="/editor">
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
              </Link>
            </Button>

            {/* Persona / Auth Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-border/80 hover:ring-amber-500/50">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                      alt={user.display_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold leading-none">{user.display_name}</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-mono ${
                            user.role === "admin"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : user.role === "moderator"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Articles & Drafts</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>

                  {(user.role === "admin" || user.role === "moderator") && (
                    <DropdownMenuItem onClick={() => navigate("/moderation")} className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
                      <span>Moderation Queue</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                    Quick Persona Switcher
                  </DropdownMenuLabel>

                  {Object.values(MOCK_PROFILES).map((p) => (
                    <DropdownMenuItem
                      key={p.id}
                      onClick={() => handleRoleSwitch(p.id)}
                      className={`cursor-pointer text-xs flex items-center justify-between ${
                        user.id === p.id ? "bg-amber-500/10 font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                        <span>{p.display_name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{p.role}</span>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary text-primary-foreground">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Connection & Architecture Diagnostic Modal */}
      <EproviderStatusModal open={statusModalOpen} onOpenChange={setStatusModalOpen} />
    </>
  );
};