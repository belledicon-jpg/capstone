import {
  BarChart3,
  Building2,
  ClipboardCheck,
  CreditCard,
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
import govServeLogo from '@/assets/logo.png';

type CivicSidebarProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
};

const primaryLinks = [
  { label: "Overview", icon: LayoutDashboard, to: "/" },
  { label: "Sanitation Services", icon: Trash2, to: "/sanitation-services" },
  { label: "Health inspections", icon: ClipboardCheck, to: "/inspections" },
  { label: "Facilities", icon: Building2, to: "/#facilities" },
  { label: "Community reports", icon: Users, to: "/#community" },
  { label: "Analytics", icon: BarChart3, to: "/#analytics" },
  { label: "Reports", icon: FileBarChart, to: "/#reports" },
];

const secondaryLinks = [
  { label: "Subscription & Billing", icon: CreditCard, to: "/subscription" },
  { label: "Settings", icon: Settings, to: "/settings" },
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
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={govServeLogo}
              alt="GovServe Logo"
              className="w-full h-full object-contain p-0.5"
            />
            </div>
            {!collapsed && <span className="font-semibold">GovServe</span>}
          </Link>

          <div className="lg:hidden">
            <button
              aria-label="Close navigation"
              className="rounded p-2 text-white/80 hover:bg-white/10"
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-auto">
          <div className="space-y-2">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                label={link.label}
                icon={link.icon}
                to={link.to}
                collapsed={collapsed}
                active={isActive(link.to)}
                onClick={() => {
                  if (open) onClose();
                }}
              />
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="space-y-2">
              {secondaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  label={link.label}
                  icon={link.icon}
                  to={link.to}
                  collapsed={collapsed}
                  active={isActive(link.to)}
                  onClick={() => {
                    if (open) onClose();
                  }}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto px-1">
          {!collapsed && (
            <div className="mt-4 text-sm text-slate-300">Version 0.1</div>
          )}
        </div>
      </aside>
    </>
  );
};
