"use client";

import { useCart } from "@/hooks/pos/useCart";
import { useAuth } from "@/hooks/useAuth";
import { usePosMutations } from "@/hooks/pos/usePosMutations";
import { BarcodeScanner, BarcodeScannerRef } from "@/components/pos/BarcodeScanner";
import { ProductQuickGrid } from "@/components/pos/ProductQuickGrid";
import { CartLineItems } from "@/components/pos/CartLineItems";
import { PaymentTender } from "@/components/pos/PaymentTender";
import { ShiftGuard } from "@/components/pos/ShiftGuard";
import { Guard } from "@/components/auth/Guard";
import { ReceiptTemplate } from "@/components/pos/ReceiptTemplate";
import { useKeyboardShortcuts } from "@/hooks/pos/useKeyboardShortcuts";
import { useRef, useState } from "react";
import { PaymentMethod } from "@/types/pos.types";
import { toast } from "sonner";
import { Clock, User as UserIcon, Monitor, Zap, ShoppingBag, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function PosPage() {
  const { user } = useAuth();
  const { items, updateQty, removeItem, clearCart, totals, addItem } = useCart();
  const { checkout, loading: checkoutLoading } = usePosMutations();
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [isWipeConfirmOpen, setIsWipeConfirmOpen] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<BarcodeScannerRef>(null);

  const handleCheckout = async (method: PaymentMethod) => {
    if (items.length === 0) {
      toast.error("CART EMPTY: SELECT PIECES TO CONTINUE");
      return;
    }
    try {
      const payload = {
        items: items.map(i => ({
          variant_id: i.variant_id,
          quantity: i.quantity,
          discount: i.discount
        })),
        payment_method: method,
        idempotency_key: `pos-${Date.now()}`,
      };

      const res = await checkout(payload);
      setLastOrder({ ...res, method, timestamp: new Date().toLocaleString() });
      setShowReceipt(true);
      toast.success("OUTFIT TRANSACTION AUTHENTICATED");
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error("TRANSACTION FAILED: SYSTEM TIMEOUT");
    }
  };

  useKeyboardShortcuts([
    { key: "F2", action: () => scannerRef.current?.focus() },
    { key: "F9", action: () => { if (items.length > 0) setIsWipeConfirmOpen(true); } },
    { key: "F12", action: () => handleCheckout("CASH") },
  ]);

  const onScan = async (barcode: string) => {
    toast.info(`SCANNED: ${barcode}`);
    // Real logic to find variant would go here
  };

  return (
    <Guard allowedRoles={["CASHIER", "MANAGER", "ADMIN"]}>
      <ShiftGuard>
        <div className="flex h-screen flex-col bg-bg overflow-hidden animate-in fade-in duration-500" data-role="staff">

          {/* 1. HIGH-DENSITY TERMINAL HEADER */}
          <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 shadow-xl relative z-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-sm">
                    <Monitor size={20} />
                 </div>
                 <div className="flex flex-col">
                    <h1 className="text-sm font-black text-text uppercase tracking-[0.2em] leading-none">OUTFIT Terminal</h1>
                    <span className="text-[8px] font-mono font-bold text-text-muted mt-1 uppercase">ID: TERM-001-KHMER</span>
                 </div>
              </div>

              <div className="h-6 w-px bg-border/40" />

              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 liquid-glass border-success/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[9px] font-black text-success uppercase tracking-widest">LIVE SESSION</span>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-mono font-black text-text-muted uppercase">
                    <Clock size={12} className="text-primary" />
                    <span>SHIFT: 08:42:00</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
               <div className="text-right">
                <p className="text-[10px] font-black text-text uppercase tracking-widest">@{user?.username}</p>
                <p className="text-[8px] text-text-muted font-mono uppercase mt-0.5">{user?.role} REGISTERED</p>
              </div>
              <div className="h-10 w-10 rounded-[3px] bg-bg border border-border flex items-center justify-center text-primary shadow-inner">
                <UserIcon size={20} />
              </div>
            </div>
          </header>

          {/* 2. DUAL-PANEL OPERATIONAL GRID */}
          <main className="flex flex-1 overflow-hidden p-6 gap-6 relative z-10">

            {/* Left Panel: Intelligent Search & Catalog Discovery */}
            <div className="flex flex-[0.65] flex-col gap-6">
              <div className="liquid-glass p-2 shadow-2xl">
                 <BarcodeScanner ref={scannerRef} onScan={onScan} />
              </div>

              <div className="flex-1 overflow-hidden liquid-glass p-6 bg-surface shadow-xl">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[10px] font-black text-text uppercase tracking-[0.3em] flex items-center gap-2">
                       <Zap size={14} className="text-primary" /> Quick Selection Segment
                    </h2>
                    <span className="text-[9px] font-mono font-bold text-text-muted uppercase bg-bg px-2 py-1 rounded-[3px]">ACTIVE CATALOG</span>
                 </div>
                 <ProductQuickGrid onAddVariant={addItem} />
              </div>
            </div>

            {/* Right Panel: Transaction Integrity & Tender */}
            <div className="flex flex-[0.35] flex-col gap-6">
              <div className="flex-[0.6] liquid-glass bg-surface shadow-2xl overflow-hidden flex flex-col">
                 <div className="px-6 py-4 border-b border-border bg-bg/20 flex items-center justify-between">
                    <h2 className="text-[10px] font-black text-text uppercase tracking-widest flex items-center gap-2">
                       <ShoppingBag size={14} className="text-primary" /> Current Basket
                    </h2>
                    <span className="text-[9px] font-mono font-black text-primary">{items.length} PIECES</span>
                 </div>
                 <div className="flex-1 overflow-hidden p-4">
                    <CartLineItems
                      items={items}
                      onUpdateQty={updateQty}
                      onRemove={removeItem}
                    />
                 </div>
              </div>

              <div className="flex-[0.4] liquid-glass p-8 bg-surface shadow-2xl border-primary/20 relative">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary pointer-events-none">
                    <ShieldCheck size={120} strokeWidth={1} />
                 </div>
                 <PaymentTender
                    totals={totals}
                    onCheckout={handleCheckout}
                    loading={checkoutLoading}
                 />
              </div>
            </div>
          </main>

          {/* Terminal Footer Utilities */}
          <footer className="h-10 border-t border-border bg-surface px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)] relative z-20">
             <div className="flex gap-6">
                <span className="text-[8px] font-mono font-black text-text-muted uppercase">F2: SEARCH FOCUS</span>
                <span className="text-[8px] font-mono font-black text-text-muted uppercase">F9: WIPE CART</span>
                <span className="text-[8px] font-mono font-black text-text-muted uppercase">F12: INSTANT CASH</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-success animate-ping" />
                <span className="text-[8px] font-mono font-black text-success uppercase">ENCRYPTED TUNNEL ACTIVE</span>
             </div>
          </footer>

          {/* Hidden Receipt Logic */}
          <div className="hidden">
             {showReceipt && lastOrder && (
               <ReceiptTemplate
                 ref={receiptRef}
                 orderId={lastOrder.order_id}
                 items={items}
                 totals={totals}
                 method={lastOrder.method}
                 user={user}
                 timestamp={lastOrder.timestamp}
               />
             )}
          </div>

          {/* Compact Liquid Glass Cart Wipe Confirmation */}
          <ConfirmModal
            isOpen={isWipeConfirmOpen}
            onClose={() => setIsWipeConfirmOpen(false)}
            onConfirm={() => {
              clearCart();
              setIsWipeConfirmOpen(false);
              toast.info("Cart cleared");
            }}
            title="Wipe POS Cart"
            description="Are you sure you want to abort this transaction and clear all scanned items?"
            confirmLabel="Wipe Cart"
            cancelLabel="Keep Items"
            variant="danger"
          />
        </div>
      </ShiftGuard>
    </Guard>
  );
}
