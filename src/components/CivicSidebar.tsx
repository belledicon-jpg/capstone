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

import { cn } from "@/lib/utils";

type CivicSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const primaryLinks = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Sanitation services", icon: Trash2 },
  { label: "Health inspections", icon: ClipboardCheck },
  { label: "Facilities", icon: Building2 },
  { label: "Community reports", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Reports", icon: FileBarChart },
];

const secondaryLinks = [
  { label: "Settings", icon: Settings },
  { label: "Help center", icon: HelpCircle },
];

const NavLink = ({
  label,
  icon: Icon,
  active,
}: {
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
}) => (
  <button
    type="button"
    className={cn(
      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-950/20"
        : "text-slate-300 hover:bg-white/10 hover:text-white",
    )}
  >
    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    <span>{label}</span>
  </button>
);

export const CivicSidebar = ({ open, onClose }: CivicSidebarProps) => (
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
        "fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-[#0d1b34] px-4 pb-5 pt-4 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="mb-7 flex items-center gap-3 px-1">
        <img
          src="/assets/civicsanity-mark.png"
          alt="CivicSanity"
          className="h-11 w-11 rounded-xl bg-white object-contain p-1.5 shadow-sm"
        />
        <div className="min-w-0">
          <p className="font-heading text-lg font-bold tracking-tight">CivicSanity</p>
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

      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Workspace
      </div>
      <nav className="space-y-1" aria-label="Main navigation">
        {primaryLinks.map((link) => (
          <NavLink key={link.label} {...link} />
        ))}
      </nav>

      <div className="mt-auto">
        <div className="mb-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold">System operational</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            All municipal data services are online.
          </p>
        </div>
        <nav className="space-y-1" aria-label="Support navigation">
          {secondaryLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </nav>
      </div>
    </aside>
  </>
);
