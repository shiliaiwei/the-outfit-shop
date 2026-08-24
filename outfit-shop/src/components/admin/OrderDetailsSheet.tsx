"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faReceipt,
  faUser,
  faClock,
  faTriangleExclamation,
  faRotate,
  faPrint,
  faBan
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface OrderDetailsSheetProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onVoidSuccess: () => void;
}

export function OrderDetailsSheet({ order, isOpen, onClose, onVoidSuccess }: OrderDetailsSheetProps) {
  const [voiding, setVoiding] = useState(false);
  const [isConfirmVoidOpen, setIsConfirmVoidOpen] = useState(false);

  const handleVoid = async () => {
    setVoiding(true);
    try {
      await api.post(`/orders/${order.id}/void`, { reason: "Admin Override" });
      toast.success("Transaction voided successfully");
      setIsConfirmVoidOpen(false);
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex w-full sm:w-[480px] animate-in slide-in-from-right duration-300">
        <div className="h-full w-full bg-surface border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-bg/20">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faReceipt} className="text-[#1E2631] text-lg" />
              <div>
                <h3 className="text-sm font-black text-text uppercase tracking-widest">Order Specification</h3>
                <p className="text-[10px] font-mono text-text-muted">REF: OUTFIT-{order.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text cursor-pointer">
              <FontAwesomeIcon icon={faXmark} className="text-base text-[#1E2631]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Status & User */}
            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 rounded-[2px] bg-bg border border-border">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", order.is_void ? "bg-danger" : "bg-success")} />
                    <span className="text-xs font-black uppercase text-text">{order.is_void ? "VOIDED" : "COMPLETED"}</span>
                  </div>
               </div>
               <div className="p-3 rounded-[2px] bg-bg border border-border">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-1">Operator</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text truncate">
                    <FontAwesomeIcon icon={faUser} className="text-[#1E2631] text-[10px]" />
                    <span className="uppercase truncate">{order.cashier_name || "Internal"}</span>
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
                      <div key={item.id} className="flex justify-between items-start text-xs font-mono">
                         <div>
                            <p className="font-bold text-text uppercase">{item.product_name}</p>
                            <p className="text-[9px] text-text-muted mt-0.5">{item.sku} &times; {qty}</p>
                         </div>
                         <span className="font-black text-text">${(price * qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-[2px] border border-border bg-bg/40 space-y-2">
               <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal ?? order.sub_total ?? 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase">
                  <span>Tax (5%)</span>
                  <span>${Number(order.tax ?? order.tax_amount ?? 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-border/40 mt-2">
                  <span className="text-xs font-black text-text uppercase tracking-wider">Grand Total</span>
                  <span className="text-lg font-black text-primary font-mono">${Number(order.total ?? order.grand_total ?? order.total_amount ?? 0).toFixed(2)}</span>
               </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">
               <FontAwesomeIcon icon={faClock} className="text-[#1E2631] text-xs" />
               <span>Placed: {new Date(order.created_at || Date.now()).toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Actions */}
          {!order.is_void && (
            <div className="p-4 sm:p-6 border-t border-border bg-bg/10 space-y-3">
              <button
                onClick={() => toast.success("Receipt sent to thermal printer")}
                className="w-full btn-liquid btn-liquid-glass py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPrint} className="text-[#1E2631] text-xs" />
                <span>Re-print Thermal Receipt</span>
              </button>
              <button
                onClick={() => setIsConfirmVoidOpen(true)}
                disabled={voiding}
                className="w-full btn-liquid bg-danger text-white py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>Void Transaction</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compact Liquid Glass Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmVoidOpen}
        onClose={() => setIsConfirmVoidOpen(false)}
        onConfirm={handleVoid}
        loading={voiding}
        title="Void Transaction"
        description={`Are you sure you want to void transaction OUTFIT-${order.id}? This will reverse inventory deductions.`}
        confirmLabel="Void Order"
        cancelLabel="Keep Order"
        variant="danger"
      />
    </div>
  );
}
