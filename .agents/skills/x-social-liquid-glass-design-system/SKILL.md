---
name: x-social-liquid-glass-design-system
description: >
  Comprehensive guide and rules for the X.com-inspired modern social architecture combined with Liquid Glass
  specular bevels, full pill border radius, dark moon (Lights Out #000000) default theme, 6 dynamic X accent colors,
  and role-adaptive UI consoles (Admin, Manager, Cashier, Staff). Trigger on: "x.com", "social design",
  "theme switcher", "lights out", "pill button", "dark moon", "liquid glass", "x design", "role view".
---

# X.com Social Liquid Glass Design System & Role Architecture

This skill defines the authoritative specification, token hierarchy, and implementation rules for OUTFIT's **X.com (Twitter)-inspired UI design system**, merged with high-end **Liquid Glass 360° specular reflection physics**, **Dark Moon ("Lights Out" `#000000`) default Next.js theme**, and **dynamic Role-Adaptive interfaces (`ADMIN`, `MANAGER`, `CASHIER`, `STAFF`)**.

---

## 1 · Design DNA & Visual Hierarchy

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ X.COM PILL GEOMETRY + LIQUID GLASS SPECULAR BEVELS                       │
 ├──────────────────────────────────────────────────────────────────────────┤
 │ • Pill Components (rounded-full): Buttons, inputs, chips, badges, tabs   │
 │ • Container Cards (rounded-2xl / rounded-3xl): Hairline 1px border       │
 │ • Specular Depth: inset 0 1px 0 rgba(...) + backdrop-blur-md            │
 │ • Typography: Bold high-contrast sans hierarchy with minimal icon noise  │
 └──────────────────────────────────────────────────────────────────────────┘
```

### Key Token Rules:
1. **Full-Pill Geometry (`rounded-full`)**:
   - Every interactive button (`.btn-liquid`), search capsule, tag, radio circle, role indicator, and tab uses `rounded-full` (1000px / 9999px border radius).
2. **Card Geometry (`rounded-2xl` / `rounded-3xl`)**:
   - Every dashboard card, data table container, modal window, and popover uses `rounded-2xl` (16px) or `rounded-3xl` (24px).
3. **Hairline Glass Borders**:
   - `1px solid var(--border)` (`#2F3336` in Lights Out / `#EFF3F4` in Default).
   - High-end top specular highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.10)`).

---

## 2 · X.com Color System & Theme Modes

### Accent Palette:
| Color | Hex | Visual Identity |
| :--- | :--- | :--- |
| **Blue (Default)** | `#1D9BF0` | Core brand accent & primary action buttons |
| **Yellow** | `#FFD400` | Warm luxury & cautionary telemetry |
| **Pink** | `#F91880` | High-energy highlights & notifications |
| **Purple** | `#7856FF` | Deep tech & intelligence forecasting |
| **Orange** | `#FF7A00` | Dynamic stock & operational badges |
| **Green** | `#00BA7C` | Success states, live heartbeats & positive trends |

### Background Modes:
1. **Lights Out (Dark Moon — Default)**:
   - Body Background: `#000000` (Pure Black)
   - Surface / Sidebar / Header: `#000000` / `#000000/80 backdrop-blur-md`
   - Cards & Data Modules: `#16181C`
   - Sub-surfaces & Search Input: `#202327`
   - Borders: `#2F3336`
   - Primary Text: `#E7E9EA`
   - Muted Text: `#71767B`
2. **Default (Day Mode)**:
   - Body Background: `#FFFFFF` (Pure White)
   - Surface / Sidebar / Header: `#FFFFFF` / `#FFFFFF/80 backdrop-blur-md`
   - Cards & Data Modules: `#F7F9F9`
   - Sub-surfaces & Search Input: `#EFF3F4`
   - Borders: `#EFF3F4`
   - Primary Text: `#0F1419`
   - Muted Text: `#536471`

---

## 3 · Role-Adaptive Dashboard Architecture

The dashboard at `/admin/dashboard` automatically adapts based on the active role (`ADMIN`, `MANAGER`, `CASHIER`, `STAFF`):

### 1. `ADMIN` View:
- **Metrics**: Consolidated Gross Revenue, Orders Volume, Inventory Velocity, Active Staff Count.
- **Feeds**: Full multi-register telemetry stream (`REG-01`, `REG-02`, `REG-03`) with drawer balances, status pills, and heartbeats.
- **Launchpad**: Launch POS, Add Product, Transfer Stock, Shift Audit, System Monitor.

### 2. `MANAGER` View:
- **Metrics**: Store GMV, Category Margin %, Active Inter-Branch Transfers, Supplier Lead Times.
- **Feeds**: Stock movement trends, FIFO batch monitor, and floor overrides.
- **Launchpad**: Purchase Orders, Inter-Branch Transfers, Daily Reports.

### 3. `CASHIER` View:
- **Metrics**: Today's Shift Sales, Cash Drawer Balance, Shift Status (`OPEN` / `CLOSED`), Loyalty Points.
- **Feeds**: Interactive **Open/Close Shift (Z-Report)** toggle, and **Safe Cash Drop ($500.00)**.
- **Launchpad**: Direct 1-tap POS Terminal checkout with barcode scanner integration.

### 4. `STAFF` View:
- **Metrics**: Total Catalog Units (1,843 items), Inbound Intake Shipments, Low Stock Alerts, Colorways/Sizes.
- **Feeds**: RFID mesh stock verification, warehouse shelf bin lookups, discrepancy reports.
- **Launchpad**: Product Catalog, Stock Ledger, Instant Barcode Price Lookup.

---

## 4 · Interactive Display Settings Component

The `<XDisplaySettingsCard />` provides real-time customization embedded right on the dashboard:
- **Font Size Slider**: 5-step interactive track with circular step dots.
- **Color Selector**: 6 X.com accent circles with checkmarks.
- **Background Selector**: Selectable "Default" (White) vs "Lights out" (Black) card boxes with radio check indicators.
- **Persistence**: Automatically syncs with `localStorage` (`outfit_x_bg`, `outfit_x_color`, `outfit_x_font`) and updates root HTML attributes.

---

## 5 · Minimalist Iconography Standard

- **Less is More**: Eliminate dense clutter of icons inside lists and data tables.
- **Purposeful Icons**: Use icons strictly for core navigation anchors, primary action buttons, and status indicators.
- **Color Inheritance**: All icons must use `color: inherit` or `var(--text)` to smoothly adapt between Dark Moon (`#000000`) and Light Day (`#FFFFFF`) modes.

---

## 6 · Code Quality & CI/CD Checklist

Before every merge or push:
1. `cd outfit-shop && npx tsc --noEmit` must pass with **0 errors**.
2. `cd outfit-shop && npm run build` must compile with **exit code 0** and generate all routes cleanly.
3. No `Math.random()` during initial SSR render (strict deterministic hydration).
