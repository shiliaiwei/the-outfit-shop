---
name: rbac-role-permission-matrix
description: >
  Authoritative role-based access control (RBAC) matrix, permissions hierarchy, route guards, and token management
  rules for OUTFIT (PUBLIC, STAFF, CASHIER, MANAGER, ADMIN). Trigger on: "rbac", "roles", "permissions",
  "guard", "auth", "role matrix", "access control".
---

# OUTFIT RBAC Role-Based Access Control & Permission Matrix

This skill documents the user role hierarchy, route guard implementations, and endpoint permission matrices for the OUTFIT platform.

---

## 1 · User Roles Hierarchy

```
 ┌─────────┐
 │  ADMIN  │  ➔ Full access to all 46+ modules, system settings, accounts, APM, webhooks
 └────┬────┘
      │
 ┌────▼────┐
 │ MANAGER │  ➔ Full access to CRM, Orders, Inventory, Catalog, Intelligence, Reports, Shifts
 └────┬────┘
      │
 ┌────▼────┐
 │ CASHIER │  ➔ Access to POS Terminal, Customers, Orders, Shift Controls
 └────┬────┘
      │
 ┌────▼────┐
 │  STAFF  │  ➔ Access to Inventory Products, Stock Ledger, Inbound Shipments
 └────┬────┘
      │
 ┌────▼────┐
 │ PUBLIC  │  ➔ Storefront product catalog, cart, checkout, VIP registration
 └─────────┘
```

---

## 2 · Route & Module Permission Matrix

| Module / Route | PUBLIC | STAFF | CASHIER | MANAGER | ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Storefront (`/`, `/category/*`)** | ✅ View | ✅ View | ✅ View | ✅ View | ✅ View |
| **POS Terminal (`/pos`)** | ❌ | ❌ | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| **Admin Dashboard (`/admin/dashboard`)** | ❌ | ✅ View | ✅ View | ✅ Full | ✅ Full |
| **Customers CRM (`/admin/customers`)** | ❌ | ❌ | ✅ View/Create | ✅ CRUD | ✅ CRUD |
| **Orders Hub (`/admin/orders`)** | ❌ | ❌ | ✅ View | ✅ CRUD | ✅ CRUD |
| **Inventory (`/admin/inventory`)** | ❌ | ✅ View/Edit | ❌ | ✅ CRUD | ✅ CRUD |
| **Stock Ledger & Transfers** | ❌ | ✅ View | ❌ | ✅ CRUD | ✅ CRUD |
| **Catalog (Brands, Categories)** | ❌ | ❌ | ❌ | ✅ CRUD | ✅ CRUD |
| **AI Intelligence & Forecast** | ❌ | ❌ | ❌ | ✅ View | ✅ View |
| **Employees (`/admin/employees`)** | ❌ | ❌ | ❌ | ❌ | ✅ CRUD |
| **System Settings & APM** | ❌ | ❌ | ❌ | ❌ | ✅ CRUD |
| **Webhooks & Developer API** | ❌ | ❌ | ❌ | ❌ | ✅ CRUD |

---

## 3 · Client Route Protection Architecture

- **Guard Component**: `<Guard allowedRoles={[...]}>` (`src/components/auth/Guard.tsx`).
- **Behavior**:
  - If user is unauthenticated &rarr; Redirects to `/login`.
  - If user lacks required role &rarr; Displays permission denial modal with action to return to authorized zone.
- **Session Persistence**: JWT token stored in `localStorage` under `outfit_auth_token` with automatic header injection via Axios interceptors.
