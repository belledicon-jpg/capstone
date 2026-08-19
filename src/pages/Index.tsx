import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  Droplets,
  Menu,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import { CivicSidebar } from "@/components/CivicSidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Waste collected",
    value: "1,284 t",
    change: "+8.2%",
    trend: "up",
    detail: "vs. previous month",
    icon: Trash2,
    color: "blue",
  },
  {
    label: "Inspections completed",
    value: "2,481",
    change: "+12.5%",
    trend: "up",
    detail: "94% completion rate",
    icon: ClipboardCheck,
    color: "emerald",
  },
  {
    label: "Water quality score",
    value: "96.8%",
    change: "+1.4%",
    trend: "up",
    detail: "All districts compliant",
    icon: Droplets,
    color: "cyan",
  },
  {
    label: "Open service reports",
    value: "143",
    change: "-6.8%",
    trend: "down",
    detail: "32 require attention",
    icon: Users,
    color: "amber",
  },
];

const weeklyData = [
  { day: "Mon", collection: 72, inspection: 48 },
  { day: "Tue", collection: 84, inspection: 65 },
  { day: "Wed", collection: 63, inspection: 79 },
  { day: "Thu", collection: 91, inspection: 70 },
  { day: "Fri", collection: 76, inspection: 86 },
  { day: "Sat", collection: 88, inspection: 58 },
  { day: "Sun", collection: 67, inspection: 44 },
];

const districts = [
  { name: "Central District", score: 94, sites: 28, status: "On track" },
  { name: "North Borough", score: 87, sites: 21, status: "On track" },
  { name: "Riverside Ward", score: 76, sites: 18, status: "Monitor" },
  { name: "East Municipality", score: 91, sites: 24, status: "On track" },
];

const inspections = [
  { id: "INS-2408", facility: "Central Community Market", type: "Food safety", date: "14 Jun 2025", status: "Passed" },
  { id: "INS-2407", facility: "Riverside Water Station", type: "Water quality", date: "14 Jun 2025", status: "Review" },
  { id: "INS-2406", facility: "North District Clinic", type: "Health facility", date: "13 Jun 2025", status: "Passed" },
  { id: "INS-2405", facility: "Eastside Transfer Point", type: "Waste management", date: "13 Jun 2025", status: "Action needed" },
];

const iconColors: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
};

const statusStyles: Record<string, string> = {
  Passed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Review: "bg-amber-50 text-amber-700 ring-amber-600/15",
  "Action needed": "bg-rose-50 text-rose-700 ring-rose-600/15",
};

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("Last 30 days");
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <CivicSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search dashboard"
                placeholder="Search inspections, facilities, reports..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="View notifications"
                onClick={() => setNotifications(0)}
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <button type="button" className="flex items-center gap-3 rounded-xl px-1.5 py-1 hover:bg-slate-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                  AM
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-slate-800">Amina Mensah</p>
                  <p className="text-xs text-slate-500">Municipal Administrator</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm font-semibold text-blue-600">Municipal operations</p>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Health & sanitation overview
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Monitor service delivery and public health performance across all districts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  aria-label="Reporting period"
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-0 pl-9 pr-9 text-sm font-medium text-slate-700 shadow-sm sm:w-[160px]"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This quarter</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <Button className="h-10 rounded-xl bg-blue-600 px-4 shadow-sm shadow-blue-600/20 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export report</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;
              return (
                <article
                  key={metric.label}
                  className="dashboard-card animate-in fade-in slide-in-from-bottom-2 p-5 duration-500"
                  style={{ animationDelay: `${index * 70}ms`, animationFillMode: "both" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                      <p className="font-heading mt-2 text-2xl font-bold tracking-tight text-slate-900">{metric.value}</p>
                    </div>
                    <div className={cn("rounded-xl p-2.5", iconColors[metric.color])}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className={cn("inline-flex items-center font-semibold", metric.trend === "down" ? "text-emerald-600" : "text-emerald-600")}>
                      <TrendIcon className="mr-0.5 h-3.5 w-3.5" />
                      {metric.change}
                    </span>
                    <span className="text-slate-400">{metric.detail}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mb-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <article className="dashboard-card p-5 sm:p-6">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">Weekly service activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Collection and inspection completion by day</p>
                </div>
                <div className="hidden items-center gap-4 text-xs text-slate-500 sm:flex">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" />Collection</span>
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />Inspections</span>
                </div>
              </div>
              <div className="flex h-[245px] items-end gap-3 border-b border-slate-200 pt-4 sm:gap-5" aria-label="Weekly activity chart">
                {weeklyData.map((item) => (
                  <div key={item.day} className="flex h-full flex-1 flex-col justify-end">
                    <div className="flex flex-1 items-end justify-center gap-1 sm:gap-2">
                      <div className="w-[38%] rounded-t-lg bg-blue-600 transition-opacity hover:opacity-80" style={{ height: `${item.collection}%` }} title={`${item.day} collection: ${item.collection}%`} />
                      <div className="w-[38%] rounded-t-lg bg-cyan-400 transition-opacity hover:opacity-80" style={{ height: `${item.inspection}%` }} title={`${item.day} inspections: ${item.inspection}%`} />
                    </div>
                    <span className="py-3 text-center text-[11px] font-medium text-slate-500 sm:text-xs">{item.day}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">District performance</h2>
                  <p className="mt-1 text-sm text-slate-500">Compliance score this month</p>
                </div>
                <button type="button" aria-label="More district options" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-5">
                {districts.map((district) => (
                  <div key={district.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{district.name}</p>
                        <p className="text-xs text-slate-400">{district.sites} monitored sites</p>
                      </div>
                      <span className={cn("text-sm font-bold", district.score < 80 ? "text-amber-600" : "text-slate-700")}>{district.score}%</span>
                    </div>
                    <Progress value={district.score} className={cn("h-2 bg-slate-100", district.score < 80 && "[&>div]:bg-amber-500")} />
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1fr_340px]">
            <article className="dashboard-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">Recent inspections</h2>
                  <p className="mt-1 text-sm text-slate-500">Latest facility assessments and outcomes</p>
                </div>
                <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                    <TableHead className="pl-5 sm:pl-6">Facility</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="pr-5 text-right sm:pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((inspection) => (
                    <TableRow key={inspection.id} className="hover:bg-slate-50/70">
                      <TableCell className="pl-5 sm:pl-6">
                        <p className="font-semibold text-slate-700">{inspection.facility}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{inspection.id}</p>
                      </TableCell>
                      <TableCell className="hidden text-slate-500 md:table-cell">{inspection.type}</TableCell>
                      <TableCell className="hidden text-slate-500 sm:table-cell">{inspection.date}</TableCell>
                      <TableCell className="pr-5 text-right sm:pr-6">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", statusStyles[inspection.status])}>
                          {inspection.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </article>

            <aside className="dashboard-card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">Priority alerts</h2>
                  <p className="mt-1 text-sm text-slate-500">Requires team attention</p>
                </div>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">3 new</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-rose-600" />
                    <div><p className="text-sm font-semibold text-slate-800">Water sample variance</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Riverside Station · reported 42 min ago</p></div>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex gap-3">
                    <Trash2 className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
                    <div><p className="text-sm font-semibold text-slate-800">Collection route delayed</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Route E-14 · 3 service points affected</p></div>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                    <div><p className="text-sm font-semibold text-slate-800">Weekly target achieved</p><p className="mt-1 text-xs leading-relaxed text-slate-500">North Borough inspections at 102%</p></div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">Open alert center</Button>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
