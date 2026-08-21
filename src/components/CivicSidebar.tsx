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
  { label: "Sanitation Services", icon: Trash2, to: "/sanitation-services" },
  { label: "Health inspections", icon: ClipboardCheck, to: "/inspections" },
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
