import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageTransition, ScrollReveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import InspectionCard from "@/components/inspections/InspectionCard";
import mockInspections from "@/data/mockInspections";

const InspectionsIndex = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const list = mockInspections.filter((i) =>
    i.id.toLowerCase().includes(query.toLowerCase()) ||
    i.facility.name.toLowerCase().includes(query.toLowerCase()),
  );

  const exportCSV = () => {
    const rows = [
      ["ID", "Facility", "Type", "Date", "Inspector", "Status", "Score", "Risk"],
      ...list.map((i) => [i.id, i.facility.name, i.type, i.date, i.inspector, i.status, i.score ?? "", i.riskLevel ?? "" ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `inspections-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageTransition>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Health Inspections</h1>
          <div className="flex gap-2">
            <Button onClick={exportCSV}>Export CSV</Button>
            <Button onClick={() => navigate("/inspections/new")}>New Inspection</Button>
          </div>
        </div>

        <ScrollReveal>
          <div className="mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by id or facility..."
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-3">
            {list.map((ins) => (
              <div key={ins.id} onClick={() => navigate(`/inspections/${ins.id}`)}>
                <InspectionCard inspection={ins} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
};

export default InspectionsIndex;
