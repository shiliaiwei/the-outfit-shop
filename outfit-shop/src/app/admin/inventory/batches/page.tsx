"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { InventoryBatch } from "@/types/inventory.types";
import { Box, Calendar, Clock, AlertCircle, CheckCircle2, MoreVertical, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BatchesPage() {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await opsService.getBatches();
        setBatches(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getDaysRemaining = (expiry: string) => {
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">FIFO Batch Tracker</h1>
          <p className="text-text-muted text-sm mt-1">Monitor inventory batches and expiration lifecycles</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-xs font-bold uppercase text-text hover:bg-bg transition-all">
                <Filter size={14} /> Filter
            </button>
            <button className="rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all">
                Audit All Batches
            </button>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/30 border-b border-border">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Batch ID</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Product / SKU</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Qty on Hand</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Expiry Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Received</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-bg rounded w-full"></div></td>
                  </tr>
                ))
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No active batches found.</td>
                </tr>
              ) : (
                batches.map((b) => {
                  const daysLeft = getDaysRemaining(b.expires_date);
                  const isExpired = daysLeft <= 0;
                  const isCritical = daysLeft > 0 && daysLeft <= 30;

                  return (
                    <tr key={b.id} className="hover:bg-bg/20 transition-colors group">
                      <td className="px-6 py-4 text-xs font-bold text-text uppercase font-mono">{b.batch_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text uppercase">{b.product_name || "Luxury Piece"}</span>
                          <span className="text-[10px] text-text-muted font-mono">{b.sku || `VAR-${b.variant_id}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-text font-mono">{b.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border text-[9px] font-black uppercase",
                          isExpired ? "bg-danger/10 text-danger border-danger/20" :
                          isCritical ? "bg-warning/10 text-warning border-warning/20" :
                          "bg-success/10 text-success border-success/20"
                        )}>
                          {isExpired ? <AlertCircle size={10} /> : <Clock size={10} />}
                          {isExpired ? "Expired" : `${daysLeft} Days Left`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted font-mono">
                        {new Date(b.received_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 text-text-muted hover:text-primary"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
