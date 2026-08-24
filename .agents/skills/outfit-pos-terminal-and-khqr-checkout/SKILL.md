---
name: outfit-pos-terminal-and-khqr-checkout
description: >
  Comprehensive guide and rules for the OUTFIT POS (Point of Sale) terminal, barcode scanner integration,
  cart line items management, cash drawer reconciliation (float, drop, Z-report), Bakong KHQR dynamic payload
  generation, audio feedback engine, and receipt printing. Trigger on: "pos", "khqr", "checkout", "cashier",
  "barcode", "shift", "z-report", "receipt".
---

# OUTFIT POS Terminal & Bakong KHQR Checkout System

This skill documents the architecture, component hierarchy, payment flows, and hardware integration rules for the **OUTFIT POS Terminal (`/pos`)**.

---

## 1 · POS Workspace Architecture

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ 1. TOP BAR: Shift Telemetry, Cash Float ($500), Active Cashier (@operator) │
 ├─────────────────────────────────────┬─────────────────────────────────────┤
 │ 2. PRODUCT CATALOG & SEARCH (60%)   │ 3. ACTIVE CART LINE ITEMS (40%)     │
 │    • Instant Barcode Scanner input  │    • Size/Color Variant line items  │
 │    • Category filter chips          │    • Quantity stepper (+ / -)       │
 │    • Grid of quick product tiles    │    • Discount & Tax calculations    │
 ├─────────────────────────────────────┴─────────────────────────────────────┤
 │ 4. PAYMENT TENDER MODAL:                                                  │
 │    • Cash (Quick bill buttons, Auto Change calculation)                   │
 │    • Bakong KHQR (Real-time dynamic payload QR generation)                │
 │    • Card / VIP Store Credit                                              │
 └───────────────────────────────────────────────────────────────────────────┘
```

---

## 2 · Key Components & File Locations

| Component | File Path | Purpose |
| :--- | :--- | :--- |
| **POS Page** | `src/app/pos/page.tsx` | Main POS terminal container with responsive desktop/tablet layout. |
| **Shift Guard** | `src/components/pos/ShiftGuard.tsx` | Enforces shift opening with opening cash float before ringing sales. |
| **Barcode Scanner** | `src/components/pos/BarcodeScanner.tsx` | Listens to USB/Bluetooth hardware scanners and manual SKU entry. |
| **Product Quick Grid** | `src/components/pos/ProductQuickGrid.tsx` | High-density tile view of products with real-time stock counts. |
| **Cart Line Items** | `src/components/pos/CartLineItems.tsx` | Manages active cart items, quantity modifications, and subtotal math. |
| **Payment Tender** | `src/components/pos/PaymentTender.tsx` | Handles Cash, KHQR, Card, and VIP Credit payment processing. |
| **Receipt Template** | `src/components/pos/ReceiptTemplate.tsx` | Formats 80mm thermal receipt printing layout with QR verification code. |

---

## 3 · Cash Management & Shift Reconciliation (Z-Report)

1. **Shift Opening**:
   - Cashier enters opening float (default: `$500.00`).
   - Terminal registers timestamp and operator ID.
2. **Safe Cash Drop**:
   - When drawer balance exceeds threshold (e.g., `>$2,000`), cashier executes a `$500.00` drop to vault.
3. **Shift Closing (Z-Report)**:
   - System aggregates Total Cash Sales, KHQR Sales, Card Sales, Cash Drops, and Expected Drawer Balance.
   - Cashier enters actual counted cash; variance is flagged in audit logs.

---

## 4 · Bakong KHQR Integration Standard

- **Currency Support**: USD and KHR dual currency.
- **Dynamic Payload**: Generates EMVCo-compliant KHQR payload with unique order bill number.
- **Polling & Webhook**: Checks payment completion status with instant visual confirmation and sound trigger (`beeps.mp3`).

---

## 5 · UX & Audio Feedback Rules

- All buttons must use full-pill styling (`rounded-full`) with `btn-liquid` highlights.
- Barcode scan success triggers audio chime (`/audio/beeps.mp3`).
- Out-of-stock items are visually disabled and cannot be added to cart.
