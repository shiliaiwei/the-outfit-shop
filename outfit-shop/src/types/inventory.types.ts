export enum ProductStatus {
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

export interface Product {
  id: number;
  product_name: string;
  category_id: number;
  brand_id?: number;
  description?: string;
  status: ProductStatus;
  material_fabric?: string;
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  barcode: string;
  cost_price: number;
  sale_price: number;
  quantity: number;
  size_id?: number;
  color_id?: number;
}

export interface Supplier {
  id: number;
  supplier_name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface StockMovement {
  id: number;
  variant_id: number;
  sku: string;
  product_name: string;
  quantity: number; // signed
  movement_type: "SALE" | "RETURN" | "ADJUSTMENT" | "TRANSFER" | "INTAKE";
  note?: string;
  created_at: string;
}

export enum TransferStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PICKED = "PICKED",
  SHIPPED = "SHIPPED",
  RECEIVED = "RECEIVED",
  CANCELLED = "CANCELLED",
}

export interface StockTransfer {
  id: number;
  from_branch_id: number;
  to_branch_id: number;
  from_branch_name?: string;
  to_branch_name?: string;
  status: TransferStatus;
  items: {
    variant_id: number;
    sku: string;
    quantity: number;
  }[];
  notes?: string;
  created_at: string;
}

export interface Category {
  id: number;
  category_name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
}

export interface Brand {
  id: number;
  brand_name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  created_at: string;
}

export interface ClothingSize {
  id: number;
  size_name: string;
  size_order: number;
  created_at: string;
}

export interface Color {
  id: number;
  color_name: string;
  hex_code: string;
  created_at: string;
}

export interface Branch {
  id: number;
  branch_name: string;
  branch_code: string;
  phone: string;
  address: string;
  city: string;
  created_at?: string;
}

export interface InventoryBatch {
  id: number;
  variant_id: number;
  sku?: string;
  product_name?: string;
  batch_number: string;
  quantity: number;
  received_date: string;
  expires_date: string;
  created_at?: string;
}

export interface WebhookSubscription {
  id: number;
  url: string;
  event_type: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

export interface GiftCard {
  id: number;
  code: string;
  initial_balance: number;
  current_balance: number;
  expiry_date: string;
  status: "ACTIVE" | "EXPIRED" | "REDEEMED";
  created_at: string;
}
