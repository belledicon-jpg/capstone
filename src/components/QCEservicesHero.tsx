import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import govServeLogo from "@/assets/logo.png";

export const QCEservicesHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b2246] via-[#103063] to-[#0e3b79] shadow-xl text-white">
      {/* QC eServices Sub-Header Navigation */}
      <nav aria-label="QC eServices navigation" className="border-b border-white/10 bg-black/20 px-4 py-3 sm:px-6">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 p-1 ring-1 ring-white/20">
              <img src={govServeLogo} alt="QC Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                QC <span className="text-cyan-400">eServices</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider text-blue-200/80">Quezon City Government</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-blue-100">
            <Link to="/" className="transition-colors hover:text-cyan-400">
              HOME
            </Link>
            <div className="group relative flex items-center gap-1 cursor-pointer hover:text-cyan-400">
              <Link to="/sanitation-services">SERVICES</Link>
              <ChevronDown className="h-3.5 w-3.5 text-blue-300" />
            </div>
            <a href="#citizens-charter" className="transition-colors hover:text-cyan-400">
              CITIZEN'S CHARTER
            </a>
            <a href="#contact-us" className="transition-colors hover:text-cyan-400">
              CONTACT US
            </a>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg bg-blue-500/30 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-500/50 ring-1 ring-white/20"
            >
              Login/Register
            </button>
            <button
              type="button"
              aria-label="Search eServices"
              className="rounded-lg p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        {/* Background Decorative Rings/Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-300 ring-1 ring-cyan-400/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Portal of Quezon City eServices</span>
          </div>

          <h1 className="font-heading mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            WELCOME TO <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">QC eServices!</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
            Transforming city services for a faster, convenient, and smarter digital experience for QCitizens.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/sanitation-services")}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#citizens-charter"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
            >
              Citizen's Charter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCEservicesHero;
