import React from "react";

const InspectionCard = ({ inspection }: any) => {
  return (
    <div className="rounded-lg border p-4 bg-white hover:shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{inspection.id} • {inspection.type}</div>
          <div className="text-lg font-semibold">{inspection.facility.name}</div>
          <div className="text-sm text-slate-600">{inspection.date} • Inspector: {inspection.inspector}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg">{inspection.score ?? "-"}/100</div>
          <div className="text-sm text-slate-500">{inspection.riskLevel ?? "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default InspectionCard;
