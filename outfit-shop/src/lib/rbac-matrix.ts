import { Role, PermissionBit, ROLE_RANK } from "@/types/rbac.types";

export const ROLE_PERMISSIONS: Record<Role, PermissionBit[]> = {
  [Role.PUBLIC]: [
    "product:read","variant:read","catalog:read","bundle:read","promotion:read",
    "branch:read","inventory:read","banner:read","currency:read","system:health",
    "cart:use","wishlist:use",
  ],
  [Role.STAFF]: [
    "product:read","variant:read","catalog:read","bundle:read","promotion:read",
    "branch:read","inventory:read","banner:read","currency:read","system:health",
    "cart:use","wishlist:use","payment:process","pos:lookup",
  ],
  [Role.CASHIER]: [
    "product:read","variant:read","catalog:read","bundle:read","promotion:read",
    "branch:read","inventory:read","banner:read","currency:read","system:health",
    "cart:use","wishlist:use","payment:process","pos:lookup",
    "session:manage","customer:crud","shift:open-close","order:create-read",
    "invoice:issue","giftcard:redeem","shipping:process","alerts:view",
  ],
  [Role.MANAGER]: [
    "product:read","variant:read","catalog:read","bundle:read","promotion:read",
    "branch:read","inventory:read","banner:read","currency:read","system:health",
    "cart:use","wishlist:use","payment:process","pos:lookup",
    "session:manage","customer:crud","shift:open-close","order:create-read",
    "invoice:issue","giftcard:redeem","shipping:process","alerts:view",
    "analytics:view","forecasting:view","catalog:crud","product:crud","variant:crud",
    "bundle:crud","promotion:crud","supplier:crud","purchase:crud",
    "stockmovement:view","stocktransfer:manage","batch:manage","branch:crud",
    "image:upload","order:void","audit:view","banner:crud","export:run",
    "mis:view","ai:use","gdpr:process","webhook:manage",
  ],
  [Role.ADMIN]: [
    "product:read","variant:read","catalog:read","bundle:read","promotion:read",
    "branch:read","inventory:read","banner:read","currency:read","system:health",
    "cart:use","wishlist:use","payment:process","pos:lookup",
    "session:manage","customer:crud","shift:open-close","order:create-read",
    "invoice:issue","giftcard:redeem","shipping:process","alerts:view",
    "analytics:view","forecasting:view","catalog:crud","product:crud","variant:crud",
    "bundle:crud","promotion:crud","supplier:crud","purchase:crud",
    "stockmovement:view","stocktransfer:manage","batch:manage","branch:crud",
    "image:upload","order:void","audit:view","banner:crud","export:run",
    "mis:view","ai:use","gdpr:process","webhook:manage",
    "employee:crud","account:manage","system:monitor",
  ],
};

export function hasRole(userRole: Role | null, required: Role): boolean {
  if (!userRole) return false;
  return (ROLE_RANK[userRole] ?? 0) >= ROLE_RANK[required];
}

export function isAtLeast(userRole: Role | null, rank: number): boolean {
  if (!userRole) return false;
  return (ROLE_RANK[userRole] ?? 0) >= rank;
}

export function hasPermission(userRole: Role | null, perm: PermissionBit): boolean {
  if (!userRole) return ROLE_PERMISSIONS[Role.PUBLIC].includes(perm);
  return (ROLE_PERMISSIONS[userRole] ?? []).includes(perm);
}

export function requireRoleOrThrow(userRole: Role | null, required: Role): void {
  if (!hasRole(userRole, required)) {
    const err = new Error(`FORBIDDEN: role ${String(userRole)} cannot access`);
    (err as any).code = "FORBIDDEN";
    throw err;
  }
}
