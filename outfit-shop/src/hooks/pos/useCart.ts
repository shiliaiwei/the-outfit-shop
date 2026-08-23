"use client";

import { useState, useCallback, useMemo } from "react";
import { CartItem } from "@/types/pos.types";
import { Variant } from "@/types/inventory.types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // 0.1 for 10%

  const addItem = useCallback((variant: Variant, productName: string, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variant_id === variant.id);
      if (existing) {
        return prev.map((i) =>
          i.variant_id === variant.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      const newItem: CartItem = {
        id: `${variant.id}-${Date.now()}`,
        variant_id: variant.id,
        product_name: productName,
        sku: variant.sku,
        price: variant.sale_price,
        quantity: qty,
        discount: 0,
      };
      return [...prev, newItem];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i)).filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomerId(null);
    setDiscountAmount(0);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return (subtotal - discountAmount) * taxRate;
  }, [subtotal, discountAmount, taxRate]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + taxAmount);
  }, [subtotal, discountAmount, taxAmount]);

  return {
    items,
    customerId,
    setCustomerId,
    discountAmount,
    setDiscountAmount,
    taxRate,
    setTaxRate,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totals: {
      subtotal,
      taxAmount,
      discountAmount,
      total,
    },
  };
}
