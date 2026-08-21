import { useEffect, useState } from "react";
import mockInspections from "@/data/mockInspections";

const STORAGE_KEY = "govserve_inspections_v1";

export function loadInspections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore parse errors
  }
  return mockInspections;
}

export function saveInspections(inspections: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
  } catch (e) {
    console.error("Failed to save inspections to localStorage", e);
  }
}

export function useInspections() {
  const [inspections, setInspections] = useState(() => loadInspections());

  useEffect(() => {
    saveInspections(inspections);
  }, [inspections]);

  const addInspection = (ins: any) => setInspections((s) => [ins, ...s]);
  const updateInspection = (updated: any) => setInspections((s) => s.map((i: any) => (i.id === updated.id ? updated : i)));

  return { inspections, addInspection, updateInspection };
}
