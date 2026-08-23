"use client";

import { useState, useEffect } from "react";
import { fulfillmentService } from "@/services/fulfillmentService";
import { Truck, Search, Filter, MoreVertical, Package, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShippingPage() {
  const [shipping, setShipping] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fulfillmentService.getShippingOrders();
        setShipping(res.data);
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
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Shipping & Logistics</h1>
          <p className="text-text-muted text-sm mt-1">Track outgoing customer orders and carrier status</p>
        </div>
        <div className="flex gap-2">
           <button className="rounded-md border border-border bg-surface px-4 py-2 text-xs font-bold uppercase text-text hover:bg-bg transition-all">
             Sync Tracking
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface"></div>
          ))
        ) : shipping.length === 0 ? (
          <div className="py-20 text-center bg-surface rounded-card border border-border">
            <Truck size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
            <p className="text-text-muted font-mono uppercase tracking-widest">No active shipments</p>
          </div>
        ) : (
          shipping.map((s) => (
            <div key={s.id} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col md:flex-row items-center gap-6 group">
               <div className="flex-shrink-0 p-3 bg-bg rounded-[2px] text-primary">
                  <Package size={24} />
               </div>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-text uppercase">Order #{s.order_id}</span>
                    <span className="text-[10px] text-text-muted font-mono uppercase bg-bg px-1.5 py-0.5 rounded-[2px]">{s.carrier}</span>
                  </div>
                  <h3 className="text-sm font-bold text-text truncate uppercase">{s.recipient_name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-text-muted uppercase">
                    <span className="flex items-center gap-1"><MapPin size={10} /> Local Delivery</span>
                    <span>Created: {new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-tighter">Tracking:</span>
                    <span className="text-xs font-black text-primary font-mono select-all uppercase">{s.tracking_number}</span>
                    <ExternalLink size={12} className="text-text-muted cursor-pointer hover:text-primary" />
                  </div>
                  <ShippingStatusBadge status={s.status} />
               </div>

               <button className="md:ml-4 p-2 text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
               </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ShippingStatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-warning/10 text-warning border-warning/20",
    PROCESSING: "bg-accent/10 text-accent border-accent/20",
    SHIPPED: "bg-primary/10 text-primary border-primary/20",
    DELIVERED: "bg-success/10 text-success border-success/20",
    RETURNED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-[2px] text-[10px] font-black border uppercase tracking-widest",
      styles[status] || "bg-bg text-text-muted border-border"
    )}>
      {status}
    </span>
  );
}
