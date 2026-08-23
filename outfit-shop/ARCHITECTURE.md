# OUTFIT Master Platform Architecture

## 💎 Design System: Liquid Glass

### 1. The 3px Radius Standard
A defining characteristic of OUTFIT is its sharp, architectural geometry.
- **Rule:** Every UI component (Buttons, Inputs, Cards, Modals) MUST use a **3px radius**.
- **Utility:** `rounded-[3px]` or `var(--radius-all)`.

### 2. The "No Black" Palette
Pure black (`#000000`) is prohibited to maintain the luxury warmth of the brand.
- **Primary Text/Borders:** Warm Espresso **#4A3F35**.
- **`OUT` Wordmark:** Mineral Charcoal **#1E2631**.
- **`FIT` Wordmark/Actions:** Terracotta **#C84428**.

### 3. Glass Refraction formula
Containers use a specialized refractive blur to simulate high-end materials:
```css
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(74, 63, 53, 0.08);
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
```

## 🔐 Security & Logic

### Triple-Lock RBAC
We enforce security at three distinct barriers:
1.  **Middleware:** Route blocking before rendering.
2.  **Guard HOC:** Component-level rank checking.
3.  **UI Logic:** Utility-based button filtering (`hasPermission()`).

### API Integration Pattern
- **Centralized Client:** Uses a custom `fetch` wrapper in `lib/api/client.ts` with auto-interceptors for 401/403 errors.
- **Zod Validation:** All incoming data is strictly parsed to prevent UI regressions.
- **Envelope Standard:** All responses follow: `{ success, data, message, meta }`.

## 📂 Operational Logic

### High-Frequency POS
Designed for zero-latency retail interactions:
- **Hotkeys:** `F2` (Search), `F9` (Abort), `F12` (Instant Cash).
- **ShiftGuard:** Transactions require an open shift with a verified float.
- **Hardware Ready:** HID wedge barcode support and 80mm thermal receipt sizing.

### Intelligence Hub
Predictive analytics powered by multi-cycle neural forecasting:
- **Sales Trajectory:** Area charts tracking revenue across 30 cycles.
- **Asset Velocity:** AI-detected surges (e.g., "Overshirt surge predicted in Paris").
- **APM Telemetry:** Real-time throughput and p95 latency monitoring.

## 🏗️ Technical Stack
- **Next.js 16+ (App Router):** Core framework (Turbopack).
- **React 19:** View layer and concurrency.
- **Tailwind CSS 4.0:** High-performance styling engine.
- **TanStack Query (React Query):** Server-state caching and synchronization.
- **Zod 3:** Schema validation and type inference envelopes.
- **Recharts:** High-density data visualization.
- **Sonner:** System-level notification dispatch.

---
© 2026 OUTFIT Master Platform. Technical Documentation.
