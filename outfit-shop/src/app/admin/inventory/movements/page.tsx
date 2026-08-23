"use client";

import { useState, useEffect } from "react";
import { inventoryDeepService } from "@/services/inventoryDeep";
import { StockMovement } from "@/types/inventory.types";
import { ArrowDownLeft, ArrowUpRight, History, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await inventoryDeepService.getStockMovements();
        setMovements(res.data as any);
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
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Stock Ledger</h1>
          <p className="text-text-muted text-sm mt-1">Audit trail of all inventory changes across branches</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-text hover:bg-bg">
            <Filter size={16} /> Filters
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            Export Audit
          </button>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/30 border-b border-border">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Type</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Product / SKU</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Quantity</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Timestamp</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-bg rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-bg rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-bg rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-bg rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-bg rounded"></div></td>
                  </tr>
                ))
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic font-mono">No movement records found.</td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="hover:bg-bg/20 transition-colors">
                    <td className="px-6 py-4">
                      <MovementBadge type={m.movement_type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text uppercase">{m.product_name}</span>
                        <span className="text-[10px] text-text-muted font-mono">{m.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-sm font-black font-mono",
                        m.quantity > 0 ? "text-success" : "text-danger"
                      )}>
                        {m.quantity > 0 ? "+" : ""}{m.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted font-mono">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-text italic">
                      {m.note || "—"}
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

function MovementBadge({ type }: { type: string }) {
  const styles: any = {
    SALE: "bg-danger/10 text-danger border-danger/20",
    RETURN: "bg-accent/10 text-accent border-accent/20",
    INTAKE: "bg-success/10 text-success border-success/20",
    ADJUSTMENT: "bg-warning/10 text-warning border-warning/20",
    TRANSFER: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-[2px] text-[9px] font-black border uppercase tracking-tighter",
      styles[type] || "bg-bg text-text-muted border-border"
    )}>
      {type}
    </span>
  );
}
