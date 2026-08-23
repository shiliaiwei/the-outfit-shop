"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { OrderDetailsSheet } from "@/components/admin/OrderDetailsSheet";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Search, Filter, ShoppingBag, Eye, ShieldAlert, CreditCard, Banknote, Calendar, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function load() {
    try {
      const res = await api.get<any>("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleOpenOrder = (order: any) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-[3px] border border-primary/20 text-primary">
                <Receipt size={24} />
             </div>
             <h1 className="text-4xl font-black text-text uppercase tracking-tighter">Order Hub</h1>
          </div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] pl-1">
             Real-time Transaction Audit Ledger • {orders.length} Verified Records
          </p>
        </div>
        <div className="flex gap-3">
          <RealTimeBadge label="POS API Connected" />
          <LiquidButton onClick={() => load()}>
             Sync Ledger
          </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : orders.map((o) => (
          <div
            key={o.id}
            onClick={() => handleOpenOrder(o)}
            className={cn(
              "liquid-glass flex flex-col md:flex-row items-center gap-6 p-5 group cursor-pointer transition-all duration-500 hover:border-primary/30",
              o.is_void && "bg-danger/[0.03] border-danger/20 opacity-80"
            )}
          >
            <div className="flex-shrink-0 p-3 bg-bg border border-border/10 text-text-muted group-hover:text-primary transition-colors">
              <ShoppingBag size={20} />
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
               <div className="space-y-1">
                  <p className="text-[9px] font-mono text-primary font-black uppercase tracking-widest">OUTFIT-{o.id}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black text-text uppercase tracking-tight">
                    {o.customer_name || "Guest Patron"}
                  </div>
               </div>

               <div className="space-y-1">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Auth Signature</p>
                  <p className="text-[10px] font-mono font-bold text-text uppercase">@{o.cashier_name || "System"}</p>
               </div>

               <div className="space-y-1">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Operational Cycle</p>
                  <p className="text-[10px] font-mono font-bold text-text-muted uppercase truncate">
                    {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(o.created_at).toLocaleDateString()}
                  </p>
               </div>

               <div className="text-right pr-4">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-1">Transaction Value</p>
                  <p className="text-xl font-black text-text font-mono tracking-tighter leading-none">${o.total.toFixed(2)}</p>
               </div>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-border/10">
               <div className={cn(
                 "px-3 py-1 rounded-[3px] text-[8px] font-black uppercase border tracking-widest",
                 o.is_void ? "bg-danger text-white border-danger" : "bg-success/10 text-success border-success/20"
               )}>
                  {o.is_void ? "VOIDED" : "VERIFIED"}
               </div>
               <Eye size={18} className="text-text-muted group-hover:text-primary transition-all" />
            </div>
          </div>
        ))}
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onVoidSuccess={load}
      />
    </div>
  );
}
