export enum Role {
  PUBLIC  = "public",
  STAFF   = "staff",
  CASHIER = "cashier",
  MANAGER = "manager",
  ADMIN   = "admin",
}

export const ROLE_RANK: Record<Role, number> = {
  [Role.PUBLIC]:  0,
  [Role.STAFF]:   1,
  [Role.CASHIER]: 2,
  [Role.MANAGER]: 3,
  [Role.ADMIN]:   4,
};

export type PermissionBit =
  | "product:read"
  | "variant:read"
  | "catalog:read"
  | "bundle:read"
  | "promotion:read"
  | "branch:read"
  | "inventory:read"
  | "banner:read"
  | "currency:read"
  | "system:health"
  | "cart:use"
  | "wishlist:use"
  | "payment:process"
  | "pos:lookup"
  | "session:manage"
  | "customer:crud"
  | "shift:open-close"
  | "order:create-read"
  | "invoice:issue"
  | "giftcard:redeem"
  | "shipping:process"
  | "alerts:view"
  | "analytics:view"
  | "forecasting:view"
  | "catalog:crud"
  | "product:crud"
  | "variant:crud"
  | "bundle:crud"
  | "promotion:crud"
  | "supplier:crud"
  | "purchase:crud"
  | "stockmovement:view"
  | "stocktransfer:manage"
  | "batch:manage"
  | "branch:crud"
  | "image:upload"
  | "order:void"
  | "audit:view"
  | "banner:crud"
  | "export:run"
  | "mis:view"
  | "ai:use"
  | "gdpr:process"
  | "webhook:manage"
  | "employee:crud"
  | "account:manage"
  | "system:monitor";
