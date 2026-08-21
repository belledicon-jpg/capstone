import {
  BarChart3,
  Building2,
  ClipboardCheck,
  FileBarChart,
  HelpCircle,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

type CivicSidebarProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
};

const primaryLinks = [
  { label: "Overview", icon: LayoutDashboard, to: "/" },
  { label: "Sanitation services", icon: Trash2, to: "/#services" },
  { label: "Health inspections", icon: ClipboardCheck, to: "/#inspections" },
  { label: "Facilities", icon: Building2, to: "/#facilities" },
  { label: "Community reports", icon: Users, to: "/#community" },
  { label: "Analytics", icon: BarChart3, to: "/#analytics" },
  { label: "Reports", icon: FileBarChart, to: "/#reports" },
];

const secondaryLinks = [
  { label: "Settings", icon: Settings, to: "/#settings" },
  { label: "Help center", icon: HelpCircle, to: "/#help" },
];

type NavLinkProps = {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  collapsed: boolean;
  active?: boolean;
  onClick: () => void;
};

const NavLink = ({
  label,
  icon: Icon,
  to,
  collapsed,
  active,
  onClick,
}: NavLinkProps) => (
  <Link
    to={to}
    title={collapsed ? label : undefined}
    aria-label={collapsed ? label : undefined}
    onClick={onClick}
    className={cn(
      "group flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
      collapsed ? "justify-center px-2" : "gap-3 px-3",
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-950/20"
        : "text-slate-300 hover:bg-white/10 hover:text-white",
    )}
  >
    <Icon
      className="h-[18px] w-[18px] flex-none"
      aria-hidden="true"
    />
    {!collapsed && <span>{label}</span>}
  </Link>
);

export const CivicSidebar = ({
  open,
  collapsed,
  onClose,
}: CivicSidebarProps) => {
  const { pathname, hash } = useLocation();

  const isActive = (to: string) =>
    to === "/"
      ? pathname === "/" && !hash
      : `${pathname}${hash}` === to;

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          type="button"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0d1b34] px-4 pb-5 pt-4 text-white shadow-2xl transition-[width,transform] duration-300 lg:translate-x-0",
          collapsed ? "w-[272px] lg:w-[88px]" : "w-[272px]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "mb-7 flex items-center px-1",
            collapsed ? "lg:justify-center" : "gap-3",
          )}
        >
          <img
            src="/assets/civicsanity-mark.jpg"
            alt="CivicSanity"
            className="h-11 w-11 flex-none rounded-xl bg-white object-contain p-1.5 shadow-sm"
          />

          <div className={cn("min-w-0", collapsed && "lg:hidden")}>
            <p className="font-heading text-lg font-bold tracking-tight">
              CivicSanity
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-blue-300">
              Public Health Office
            </p>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace */}
        <div
          className={cn(
            "mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500",
            collapsed && "lg:sr-only",
          )}
        >
          Workspace
        </div>

        <nav className="space-y-1" aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              collapsed={collapsed}
              active={isActive(link.to)}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto">
          {/* System status */}
          <div
            className={cn(
              "mb-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4",
              collapsed && "lg:flex lg:justify-center lg:p-2.5",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white",
                !collapsed && "mb-3",
              )}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className={cn(collapsed && "lg:hidden")}>
              <p className="text-sm font-semibold">
                System operational
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                All municipal data systems are operating normally.
              </p>
            </div>
          </div>

          {/* Support navigation */}
          <nav
            className="space-y-1"
            aria-label="Support navigation"
          >
            {secondaryLinks.map((link) => (
              <NavLink
                key={link.label}
                {...link}
                collapsed={collapsed}
                active={isActive(link.to)}
                onClick={onClose}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
