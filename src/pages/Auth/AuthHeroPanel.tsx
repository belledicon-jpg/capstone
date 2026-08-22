import { Building2, ShieldCheck, Sparkles } from "lucide-react";

export const AuthHeroPanel = () => (
  <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#1d4ed8] via-[#1e40af] to-[#0f2f7a] text-white lg:flex">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_34%)]" />
    <div className="relative z-10 flex w-full flex-col justify-between p-12">
      <div className="flex items-center gap-3 text-sm font-semibold tracking-wide">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <div>GovServe</div>
          <div className="text-xs text-white/75">City services, online</div>
        </div>
      </div>

      <div className="max-w-md">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15">
          <Sparkles className="h-4 w-4" />
          Fast, secure access to public services
        </div>
        <h2 className="text-4xl font-bold leading-tight">
          Quezon City
          <br />
          services, online
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-6 text-white/80">
          One account for certificates, permits, appointments, inquiries, and consultations.
        </p>

        <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 text-sm">
          {["Certificates", "Appointments", "Inquiries", "Verified accounts"].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
            >
              <ShieldCheck className="mb-2 h-5 w-5" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
