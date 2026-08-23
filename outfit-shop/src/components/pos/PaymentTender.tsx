"use client";

import { useState } from "react";
import { PaymentMethod } from "@/types/pos.types";
import { Banknote, CreditCard, Wallet, Ticket, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentTenderProps {
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
  onCheckout: (method: PaymentMethod) => Promise<void>;
  loading?: boolean;
}

export function PaymentTender({ totals, onCheckout, loading }: PaymentTenderProps) {
  const [method, setMethod] = useState<PaymentMethod>("CASH");

  return (
    <div className="flex flex-col h-full bg-surface rounded-card border border-border overflow-hidden shadow-md">
      <div className="bg-bg/50 px-4 py-3 border-b border-border">
        <h3 className="text-xs font-black text-text uppercase tracking-widest">Transaction Summary</h3>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-2 border-b border-border pb-4">
          <div className="flex justify-between text-xs text-text-muted">
            <span>Subtotal</span>
            <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>Discount</span>
            <span className="font-mono">-${totals.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>Tax (0%)</span>
            <span className="font-mono">${totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-sm font-black text-text uppercase tracking-wider">Balance Due</span>
            <span className="text-xl font-black text-primary font-mono">${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Select Tender</label>
          <div className="grid grid-cols-2 gap-2">
            <TenderButton
              active={method === "CASH"}
              onClick={() => setMethod("CASH")}
              icon={Banknote}
              label="Cash"
            />
            <TenderButton
              active={method === "CARD"}
              onClick={() => setMethod("CARD")}
              icon={CreditCard}
              label="Card"
            />
            <TenderButton
              active={method === "WALLET"}
              onClick={() => setMethod("WALLET")}
              icon={Wallet}
              label="Wallet"
            />
            <TenderButton
              active={method === "GIFT_CARD"}
              onClick={() => setMethod("GIFT_CARD")}
              icon={Ticket}
              label="Gift Card"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-bg/20 border-t border-border">
        <button
          onClick={() => onCheckout(method)}
          disabled={loading || totals.total <= 0}
          className="flex w-full h-14 items-center justify-center rounded-btn bg-primary text-white font-black uppercase tracking-widest shadow-lg hover:bg-primary/90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            `Complete Sale (F12)`
          )}
        </button>
      </div>
    </div>
  );
}

function TenderButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-3 rounded-[2px] border transition-all",
        active
          ? "border-primary bg-primary text-white shadow-sm ring-1 ring-primary"
          : "border-border bg-surface text-text-muted hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <Icon size={20} className={cn("mb-1", active ? "text-white" : "text-primary")} />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}
