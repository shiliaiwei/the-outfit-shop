"use client";

import { useState, useEffect } from "react";
import { usePosMutations } from "@/hooks/pos/usePosMutations";
import { Shift } from "@/types/pos.types";
import { DoorOpen, Loader2 } from "lucide-react";

interface ShiftGuardProps {
  children: React.ReactNode;
}

export function ShiftGuard({ children }: ShiftGuardProps) {
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCurrentShift, openShift } = usePosMutations();
  const [openingFloat, setOpeningFloat] = useState("100.00");

  useEffect(() => {
    async function check() {
      const current = await getCurrentShift();
      setShift(current);
      setLoading(false);
    }
    check();
  }, []);

  const handleOpen = async () => {
    try {
      const res = await openShift(parseFloat(openingFloat), 0);
      setShift(res);
    } catch (err) {
      alert("Failed to open shift");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg p-6">
        <div className="max-w-md w-full rounded-card border border-border bg-surface p-8 text-center shadow-xl">
          <div className="rounded-full bg-warning/10 p-4 text-warning w-fit mx-auto mb-6">
            <DoorOpen size={48} />
          </div>
          <h2 className="text-2xl font-black text-text uppercase tracking-tighter mb-2">Shift Required</h2>
          <p className="text-text-muted text-sm mb-8">You must open a new shift before processing transactions.</p>

          <div className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 block">Opening Float (USD)</label>
              <input
                type="number"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
                className="w-full rounded-md border border-border bg-bg px-4 py-3 text-lg font-black focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleOpen}
              className="w-full rounded-btn bg-primary py-4 text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              Open Shift
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
