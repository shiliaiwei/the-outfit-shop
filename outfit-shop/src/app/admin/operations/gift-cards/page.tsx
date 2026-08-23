"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { GiftCard } from "@/types/inventory.types";
import { Plus, Ticket, Search, MoreVertical, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GiftCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await opsService.getGiftCards();
        setCards(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Gift Card Manager</h1>
          <p className="text-text-muted text-sm mt-1">Issue and track digital credit for VIP patronage</p>
        </div>
        <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all">
          <Plus size={18} /> Issue New Card
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/30 border-b border-border">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Card Code</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Initial</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Balance</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Expiry</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-bg rounded w-full"></div></td>
                  </tr>
                ))
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No gift cards issued.</td>
                </tr>
              ) : (
                cards.map((c) => (
                  <tr key={c.id} className="hover:bg-bg/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket size={14} className="text-primary" />
                        <span className="text-xs font-black text-text font-mono select-all">{c.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <CardStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted font-mono">${Number(c.initial_balance ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-black text-text font-mono">${Number(c.current_balance ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-text-muted font-mono">{new Date(c.expiry_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-text-muted hover:text-primary transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CardStatusBadge({ status }: { status: string }) {
  const styles: any = {
    ACTIVE: "bg-success/10 text-success border-success/20",
    REDEEMED: "bg-accent/10 text-accent border-accent/20",
    EXPIRED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-[2px] text-[9px] font-black border uppercase tracking-tighter",
      styles[status] || "bg-bg text-text-muted border-border"
    )}>
      {status}
    </span>
  );
}
