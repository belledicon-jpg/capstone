import React from "react";

const SeverityBadge = ({ severity }: { severity: string }) => {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold";
  if (severity === "Critical") return <span className={`${base} bg-red-100 text-red-800`}>{severity}</span>;
  if (severity === "Major") return <span className={`${base} bg-amber-100 text-amber-800`}>{severity}</span>;
  return <span className={`${base} bg-emerald-100 text-emerald-800`}>{severity}</span>;
};

const ViolationsList = ({ violations, onCreateAction }: any) => {
  return (
    <div className="space-y-3">
      {violations.map((v: any) => (
        <div key={v.id} className="rounded-md border p-3 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">{v.category}</div>
                <SeverityBadge severity={v.severity} />
              </div>
              <div className="text-sm text-slate-600 mt-1">{v.description}</div>
              {v.location && <div className="text-xs text-slate-400 mt-1">Location: {v.location}</div>}
              {v.regulation && <div className="text-xs text-slate-400 mt-1">Regulation: {v.regulation}</div>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                {v.evidence?.map((src: string, idx: number) => (
                  <img key={idx} src={src} alt={`evidence-${idx}`} className="h-12 w-12 rounded object-cover" />
                ))}
              </div>
              <button
                className="rounded bg-blue-600 px-3 py-1 text-white text-sm"
                onClick={() => onCreateAction(v)}
              >
                Create corrective action
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViolationsList;
