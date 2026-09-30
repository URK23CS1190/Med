import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HealthEntry {
  id: string;
  date: string; // ISO string
  type: "Walking" | "Jogging" | "Running" | "Cycling" | "Other";
  duration: number; // minutes
  distance?: number; // km, optional
}

interface HealthStore {
  entries: HealthEntry[];
  addEntry: (entry: Omit<HealthEntry, "id" | "date">) => void;
  clearEntries: () => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const newEntry: HealthEntry = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          ...entry,
        };
        set({ entries: [newEntry, ...get().entries] });
      },
      clearEntries: () => set({ entries: [] }),
    }),
    { name: "health-tracker-store" }
  )
);
