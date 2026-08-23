"use client";

import { forwardRef } from "react";
import { CartItem, PaymentMethod } from "@/types/pos.types";
import { User } from "@/types/auth.types";

interface ReceiptTemplateProps {
  orderId?: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
  };
  method: PaymentMethod;
  user: User | null;
  timestamp: string;
}

export const ReceiptTemplate = forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ orderId, items, totals, method, user, timestamp }, ref) => {
    return (
      <div ref={ref} className="w-[80mm] bg-white p-4 font-mono text-black text-xs space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-lg font-black tracking-tighter">OUTFIT STORE</h1>
          <p>SS-MIS POS TERMINAL #01</p>
          <p>Phnom Penh, Cambodia</p>
        </div>

        <div className="border-t border-b border-black border-dashed py-2 text-[10px]">
          <div className="flex justify-between">
            <span>ORDER:</span>
            <span>{orderId || "PENDING"}</span>
          </div>
          <div className="flex justify-between">
            <span>DATE:</span>
            <span>{timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span>CASHIER:</span>
            <span>{user?.employee_name || user?.username}</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.id} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span className="uppercase">{item.product_name}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-black pt-2 space-y-1">
          <div className="flex justify-between">
            <span>SUBTOTAL:</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>DISCOUNT:</span>
            <span>-${totals.discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>TAX (0%):</span>
            <span>${totals.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-black pt-2">
            <span>TOTAL:</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="text-center pt-4">
          <p className="font-bold">PAID VIA {method}</p>
          <p className="mt-4 text-[10px]">THANK YOU FOR SHOPPING AT OUTFIT</p>
          <p className="text-[9px]">theoufit.kesararamwithdigital.tech</p>
        </div>

        {/* Dummy Barcode */}
        <div className="flex flex-col items-center pt-4">
          <div className="h-8 w-full bg-black"></div>
          <span className="text-[8px] mt-1">{orderId || "000000000000"}</span>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = "ReceiptTemplate";
