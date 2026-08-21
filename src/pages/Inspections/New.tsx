import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition, ScrollReveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { useInspections } from "@/hooks/useInspections";

const NewInspection = () => {
  const navigate = useNavigate();
  const { addInspection } = useInspections();

  const [facilityName, setFacilityName] = useState("");
  const [type, setType] = useState("Routine");
  const [inspector, setInspector] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const id = `HI-${Date.now()}`;
    const newIns = {
      id,
      type,
      date,
      inspector,
      status: "Pending",
      facility: { name: facilityName, type, address: "", owner: "", contact: "" },
      findings: [],
      violations: [],
      correctiveActions: [],
      followUp: null,
      score: null,
      riskLevel: "Medium",
      audit: { createdBy: inspector || "unknown", createdAt: new Date().toISOString() },
    };

    addInspection(newIns);
    navigate(`/inspections/${id}`);
  };

  return (
    <PageTransition>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">New Inspection</h1>
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Facility name</label>
              <input value={facilityName} onChange={(e) => setFacilityName(e.target.value)} className="w-full rounded border px-3 py-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Inspection type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded border px-3 py-2">
                <option>Routine</option>
                <option>Follow-up</option>
                <option>Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Inspector</label>
              <input value={inspector} onChange={(e) => setInspector(e.target.value)} className="w-full rounded border px-3 py-2" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border px-3 py-2" required />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Create</Button>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default NewInspection;
