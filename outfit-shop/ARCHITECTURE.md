# OUTFIT Master Platform Architecture

## 🌟 Project Overview
OUTFIT is a production-grade, high-density Admin Dashboard and Live POS Terminal designed for luxury retail operations. The platform strictly adheres to the OUTFIT brand guidelines, featuring a "No Black" Espresso palette and a Liquid Glass design system.

## 🎨 Design System: Liquid Glass
The platform uses a custom design system characterized by:
- **Strict 3px Radius:** Applied globally to all UI elements for a sharp, architectural look.
- **Specularity:** 360-degree highlights and refractive blur on all containers.
- **Brand Palette:** 
  - `OUT` (Charcoal #1E2631)
  - `FIT` (Terracotta #C84428)
  - Text & Borders (Warm Espresso #4A3F35)

## 🏗️ Technical Stack
- **Framework:** Next.js 16+ (App Router)
- **Styling:** Tailwind CSS 4.0
- **State Management:** React Context (Auth) + Custom Hooks (Cart/POS)
- **Data Visualization:** Recharts
- **Validation:** Zod
- **Icons:** Lucide React
- **Notifications:** Sonner

## 🔐 Security & Governance
- **Triple-Lock RBAC:**
  1. **API Layer:** Token-based authentication.
  2. **Middleware:** Route-level protection.
  3. **Component Guards:** UI-level feature filtering based on role rank (ADMIN, MANAGER, CASHIER, STAFF).
- **Immutable Audit Trail:** All sensitive actions are logged with operator attribution and IP tracking.
- **GDPR Portal:** Built-in tools for Data Portability (Art. 20) and Right to Erasure (Art. 17).

## 📂 Core Modules
1. **Command Hub:** Adaptive dashboard for real-time intelligence and AI forecasting.
2. **Inventory Ledger:** Editorial-style asset management with SKU density and stock velocity tracking.
3. **Live POS Terminal:** High-frequency retail interface with keyboard shortcuts (F2/F9/F12).
4. **Order Hub:** Master transaction audit with secure VOID authority.
5. **Customer CRM:** Unified client profiles with loyalty tier tracking.
6. **Supply Chain:** Purchase Orders, inter-branch transfers, and supplier performance metrics.
7. **Infrastructure Pulse:** Real-time APM telemetry and distributed cluster monitoring.

## 🚀 Getting Started
1. **Install Dependencies:**
   ```bash
   npm install zod recharts lucide-react clsx tailwind-merge sonner
   ```
2. **Environment Setup:**
   Configure `NEXT_PUBLIC_API_BASE` in your `.env.local`.
3. **Run Development:**
   ```bash
   npm run dev
   ```

---
© 2026 OUTFIT Master Platform. Confidential & Proprietary.
