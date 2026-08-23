# OUTFIT Master Platform

OUTFIT is a production-grade, high-density Admin Dashboard and Live POS Terminal designed for luxury retail operations. Achieving 100% coverage of the SS-MIS functional specification, it serves as an authoritative management hub for the OUTFIT haute atelier.

## 🌟 Executive Summary

### 1. Brand Integrity
- **Universal All-Caps:** Strict **OUTFIT** branding across all system layers.
- **"No Black" Palette:** Warm **Espresso #4A3F35** for all primary text and borders.
- **Liquid Glass Design:** High-specularity surfaces with architectural **3px radius** standards.

### 2. Operational Excellence
- **Live POS Terminal:** Rapid retail interface with keyboard-first navigation (F2/F9/F12).
- **Master Inventory:** Editorial-style ledger with real-time sync and low-stock intelligence.
- **Supply Chain:** Integrated Purchase Orders and inter-branch logistics tracking.

### 3. Intelligence & Governance
- **Command Hub:** Predictive sales forecasting and multi-cluster APM telemetry.
- **Triple-Lock RBAC:** Secure access control enforced from API to UI components.
- **Compliance Portal:** Automated GDPR workflows for data portability and erasure.

## 📂 Platform Modules

| Group | Key Modules |
| :--- | :--- |
| **Intelligence** | Dashboard, AI Insights, MIS Reports, AI Forecast |
| **Customer CRM** | Customer Registry, Loyalty Tracking, Order Hub |
| **Inventory** | Products, Purchases, Stock Ledger, Transfers, FIFO Batches, Suppliers |
| **Operations** | POS Terminal, Shipping, Branches, Media Assets (Cloudinary), Gift Cards |
| **System** | Infrastructure Pulse, User Accounts, Security Logs, Shift Audit, Webhooks |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Access to OUTFIT API Gateway

### Quick Start
1. **Initialize Dependencies:**
   ```bash
   npm install zod recharts lucide-react clsx tailwind-merge sonner
   ```
2. **Setup Environment:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE=https://api.kesararamwithdigital.tech/api/v1
   ```
3. **Run Development Mode:**
   ```bash
   npm run dev
   ```

## 📘 Documentation
- [Architecture & Design System](ARCHITECTURE.md)
- [API Specification](OutfitShop_Master_Collection.json)

---
© 2026 OUTFIT Master Platform. Confidential & Proprietary.
