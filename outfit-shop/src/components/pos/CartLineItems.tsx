"use client";

import { CartItem } from "@/types/pos.types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartLineItemsProps {
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartLineItems({ items, onUpdateQty, onRemove }: CartLineItemsProps) {
  return (
    <div className="flex flex-col border rounded-card bg-surface overflow-hidden border-border h-full shadow-sm">
      <div className="bg-bg/50 px-4 py-2 border-b border-border flex justify-between items-center">
        <h3 className="text-xs font-black text-text uppercase tracking-wider">Cart Items ({items.length})</h3>
        <span className="text-[10px] text-text-muted font-mono uppercase">Qty | Line Total</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-bg flex items-center justify-center mb-2">
              <Plus className="text-text-muted opacity-20" />
            </div>
            <p className="text-sm font-medium text-text-muted uppercase tracking-tighter">Cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-3 hover:bg-bg/30 transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text truncate uppercase">{item.product_name}</p>
                  <p className="text-[10px] text-text-muted font-mono mt-0.5">{item.sku}</p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-border bg-surface text-text hover:border-primary active:scale-90"
                  >
                    <Minus size={12} />
                  </button>
                  <div className="w-10 text-center text-xs font-mono font-black">{item.quantity}</div>
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-border bg-surface text-text hover:border-primary active:scale-90"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-text font-mono">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono">
                    @ ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
