import { create } from "zustand";

type SolarState = {
  paused: boolean;
  speed: number;
  showLabels: boolean;
  showOrbits: boolean;
  selected: string | null;
  simDays: number;
  resetViewTick: number;
  focusTick: number;
  togglePaused: () => void;
  setSpeed: (speed: number) => void;
  setShowLabels: (show: boolean) => void;
  setShowOrbits: (show: boolean) => void;
  select: (id: string) => void;
  clearSelection: () => void;
  setSimDays: (days: number) => void;
  requestReset: () => void;
};

export const useSolar = create<SolarState>((set) => ({
  paused: false,
  speed: 1,
  showLabels: true,
  showOrbits: true,
  selected: null,
  simDays: 0,
  resetViewTick: 0,
  focusTick: 0,
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  setSpeed: (speed) => set({ speed }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setShowOrbits: (showOrbits) => set({ showOrbits }),
  select: (selected) => set((s) => ({ selected, focusTick: s.focusTick + 1 })),
  clearSelection: () => set({ selected: null }),
  setSimDays: (simDays) => set({ simDays }),
  requestReset: () => set((s) => ({ selected: null, resetViewTick: s.resetViewTick + 1 })),
}));
