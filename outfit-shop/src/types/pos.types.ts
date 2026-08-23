import { Variant } from "./inventory.types";

export interface CartItem {
  id: string; // unique cart item id
  variant_id: number;
  product_name: string;
  sku: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  discount?: number; // per item discount amount or percentage? Postman shows "discount":0
  image_url?: string;
}

export interface Shift {
  id: number;
  cashier_id: number;
  opening_float_usd: number;
  opening_float_khr: number;
  opened_at: string;
  status: "OPEN" | "CLOSED";
}

export type PaymentMethod = "CASH" | "CARD" | "WALLET" | "GIFT_CARD";

export interface CheckoutPayload {
  customer_id?: number | null;
  items: {
    variant_id: number;
    quantity: number;
    discount?: number;
  }[];
  payment_method: PaymentMethod;
  payment_amount?: number;
  tax_rate?: number;
  notes?: string;
  idempotency_key: string;
}
