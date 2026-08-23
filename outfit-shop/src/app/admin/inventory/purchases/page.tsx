"use client";

import { useState, useEffect } from "react";
import { fulfillmentService } from "@/services/fulfillmentService";
import { Plus, Search, Filter, MoreVertical, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PurchasesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fulfillmentService.getPurchaseOrders();
        setOrders(res.data);
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
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Purchase Orders</h1>
          <p className="text-text-muted text-sm mt-1">Manage procurement and stock intake from manufacturers</p>
        </div>
        <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus size={18} /> New PO
        </button>
      </div>

      <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-bg/10 flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search POs..."
              className="h-10 w-full rounded-md border border-border bg-bg pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-surface text-xs font-bold uppercase text-text hover:bg-bg">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/30 border-b border-border">
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">PO Number</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Supplier</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Expected</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">Total Cost</th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-bg rounded w-full"></div></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted italic">No purchase orders found.</td>
                </tr>
              ) : (
                orders.map((po) => (
                  <tr key={po.id} className="hover:bg-bg/20 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-text uppercase font-mono">PO-{String(po.id).padStart(5, '0')}</td>
                    <td className="px-6 py-4 text-xs text-text uppercase font-bold">{po.supplier_name || `Supplier #${po.supplier_id}`}</td>
                    <td className="px-6 py-4"><POStatusBadge status={po.status} /></td>
                    <td className="px-6 py-4 text-xs text-text-muted font-mono">{new Date(po.expected_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-black text-text font-mono">${po.total_cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-text-muted hover:text-primary"><MoreVertical size={16} /></button>
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

function POStatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-warning/10 text-warning border-warning/20",
    PARTIAL: "bg-accent/10 text-accent border-accent/20",
    RECEIVED: "bg-success/10 text-success border-success/20",
    CANCELLED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-[2px] text-[9px] font-black border uppercase tracking-tighter",
      styles[status]
    )}>
      {status}
    </span>
  );
}
