"use client";

import { X, Receipt, ShieldAlert, CheckCircle2, User, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

interface OrderDetailsSheetProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onVoidSuccess: () => void;
}

export function OrderDetailsSheet({ order, isOpen, onClose, onVoidSuccess }: OrderDetailsSheetProps) {
  const [voiding, setVoiding] = useState(false);

  const handleVoid = async () => {
    if (!confirm("CRITICAL: This action will reverse all stock changes and mark the transaction as VOID. Proceed?")) return;

    setVoiding(true);
    try {
      await api.post(`/orders/${order.id}/void`, { reason: "Admin Override" });
      toast.success("Transaction VOIDED successfully.");
      onVoidSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Void action failed");
    } finally {
      setVoiding(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#1E2631]/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex w-full sm:w-[500px] animate-in slide-in-from-right duration-300">
        <div className="h-full w-full bg-surface border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-bg/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-[2px] text-primary">
                <Receipt size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-text uppercase tracking-widest">Order Detail</h3>
                <p className="text-[10px] font-mono text-text-muted">REF: OUTFIT-{order.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text hover:bg-bg transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Status & User */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-3 rounded-[2px] bg-bg/50 border border-border">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-1">Transaction Status</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", order.is_void ? "bg-danger" : "bg-success")} />
                    <span className="text-xs font-black uppercase text-text">{order.is_void ? "VOIDED" : "COMPLETED"}</span>
                  </div>
               </div>
               <div className="p-3 rounded-[2px] bg-bg/50 border border-border">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-1">Authenticated Cashier</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-text truncate">
                    <User size={12} className="text-text-muted" />
                    <span className="uppercase">{order.cashier_name || "Internal"}</span>
                  </div>
               </div>
            </div>

            {/* Items Table */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-text uppercase tracking-widest border-b border-border pb-2">Line Items</h4>
               <div className="space-y-3">
                  {order.items?.map((item: any) => {
                    const price = Number(item.price ?? item.unit_price ?? 0);
                    const qty = Number(item.quantity ?? item.qty ?? 1);
                    return (
                      <div key={item.id} className="flex justify-between items-start">
                         <div>
                            <p className="text-xs font-bold text-text uppercase">{item.product_name}</p>
                            <p className="text-[9px] font-mono text-text-muted mt-0.5">{item.sku} × {qty}</p>
                         </div>
                         <span className="text-xs font-black text-text font-mono">${(price * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-card border border-border bg-bg/10 space-y-2">
               <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal ?? order.sub_total ?? 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                  <span>Tax (5%)</span>
                  <span>${Number(order.tax ?? order.tax_amount ?? 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <span className="text-xs font-black text-text uppercase tracking-wider">Grand Total</span>
                  <span className="text-lg font-black text-primary font-mono">${Number(order.total ?? order.grand_total ?? order.total_amount ?? 0).toFixed(2)}</span>
               </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-[9px] font-mono text-text-muted uppercase tracking-widest">
               <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>Placed: {new Date(order.created_at || Date.now()).toLocaleString()}</span>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          {!order.is_void && (
            <div className="p-6 border-t border-border bg-bg/5 space-y-4">
              <div className="flex gap-4">
                 <button className="flex-1 rounded-btn bg-surface border border-border py-2.5 text-[10px] font-black uppercase text-text tracking-widest hover:bg-bg transition-all">
                    Re-print Receipt
                 </button>
              </div>
              <button
                onClick={handleVoid}
                disabled={voiding}
                className="w-full flex items-center justify-center gap-2 rounded-btn bg-danger/10 text-danger border border-danger/20 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-danger/20 transition-all disabled:opacity-50"
              >
                {voiding ? "Processing Reversal..." : <><ShieldAlert size={14} /> VOID TRANSACTION</>}
              </button>
              <p className="text-[8px] text-center text-text-muted uppercase leading-relaxed font-mono">
                VOID action is tracked and will be logged to the security audit trail with manager attribution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
