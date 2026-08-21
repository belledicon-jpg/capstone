import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { PageTransition, ScrollReveal } from "@/components/animations";
import { useInspections } from "@/hooks/useInspections";
import ViolationsList from "@/components/inspections/ViolationsList";
import { Button } from "@/components/ui/button";

const InspectionDetails = () => {
  const { id } = useParams();
  const { inspections, updateInspection } = useInspections();

  const inspection = useMemo(() => inspections.find((i: any) => i.id === id), [inspections, id]);

  if (!inspection) {
    return (
      <PageTransition>
        <main className="mx-auto max-w-4xl px-4 py-6">Inspection not found</main>
      </PageTransition>
    );
  }

  const addActionFromViolation = (violation: any) => {
    const newAction = {
      id: `CA-${Math.floor(Math.random() * 900000 + 100000)}`,
      action: `Address violation: ${violation.description}`,
      responsible: "Owner",
      deadline: null,
      status: "Pending",
    };

    const updated = { ...inspection, correctiveActions: [newAction, ...(inspection.correctiveActions || [])] };
    updateInspection(updated);
  };

  const markActionComplete = (actionId: string) => {
    const updated = {
      ...inspection,
      correctiveActions: (inspection.correctiveActions || []).map((a: any) =>
        a.id === actionId ? { ...a, status: "Completed" } : a,
      ),
    };
    updateInspection(updated);
  };

  const actions = inspection.correctiveActions || [];
  const followUp = inspection.followUp;

  return (
    <PageTransition>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{inspection.id} — {inspection.facility.name}</h1>
          <div className="text-sm text-slate-600">{inspection.date} • {inspection.type} • Inspector: {inspection.inspector}</div>
        </div>

        <ScrollReveal>
          {/* Summary */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Overall result</div>
                <div className="text-lg font-semibold">{inspection.status} — {inspection.score ?? "-"}/100</div>
                <div className="text-sm text-slate-500">Risk: {inspection.riskLevel ?? "-"}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Facility type</div>
                <div className="font-medium">{inspection.facility.type}</div>
                <div className="text-sm text-slate-500 mt-2">Contact</div>
                <div className="font-medium">{inspection.facility.contact ?? "-"}</div>
              </div>
            </div>
          </section>

          {/* Violations */}
          <section className="mb-6">
            <h2 className="font-heading text-xl font-bold mb-3">Findings & Violations</h2>
            <ViolationsList violations={inspection.violations} onCreateAction={addActionFromViolation} />
          </section>

          {/* Corrective Actions */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-heading text-xl font-bold mb-3">Corrective Actions</h2>
            {actions.length === 0 ? (
              <div className="text-sm text-slate-500">No corrective actions yet</div>
            ) : (
              <div className="space-y-3">
                {actions.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{a.action}</div>
                      <div className="text-sm text-slate-500">Responsible: {a.responsible} {a.deadline ? `• Deadline: ${a.deadline}` : ""}</div>
                    </div>
                    <div className="flex gap-2">
                      {a.status !== "Completed" && (
                        <Button onClick={() => markActionComplete(a.id)}>Mark complete</Button>
                      )}
                      <div className="text-sm text-slate-500">{a.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Follow-up */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-heading text-xl font-bold mb-3">Follow-up</h2>
            {followUp ? (
              <div>
                <div className="text-sm text-slate-500">Date: {followUp.date}</div>
                <div className="mt-2">{followUp.notes}</div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">No follow-up scheduled</div>
            )}
          </section>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default InspectionDetails;
