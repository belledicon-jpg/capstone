import { useState } from "react";
import { Bell, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Outlet } from "react-router-dom";

import { AIChatWidget } from "@/components/AIChatWidget";
import { CivicSidebar } from "@/components/CivicSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <CivicSidebar
        open={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
      />

      <div className={cn("flex h-screen flex-col transition-[padding] duration-300", collapsed ? "lg:pl-[88px]" : "lg:pl-[272px]")}>
        <header className="z-20 flex-none border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex h-[72px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((value) => !value)}
              className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:block"
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search dashboard"
                placeholder="Search inspections, facilities, reports..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-800"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button
                type="button"
                aria-label="View notifications"
                onClick={() => setNotifications(0)}
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">{notifications}</span>}
              </button>
              <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
              <button type="button" aria-label="Open user menu" className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">AM</div>
                <div className="hidden text-left md:block"><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Amina Mensah</p><p className="text-xs text-slate-500 dark:text-slate-400">Municipal Administrator</p></div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f7fb] dark:bg-slate-950">
          <Outlet />
        </div>
      </div>
      <AIChatWidget />
    </div>
  );
};
