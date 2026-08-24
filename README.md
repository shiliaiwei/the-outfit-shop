# OUTFIT Haute Atelier — Master Platform & Storefront

Official monorepo and production application for the **OUTFIT** luxury retail management platform, high-density Admin Dashboard, and Storefront.

[![CI/CD Pipeline](https://github.com/shiliaiwei/the-outfit-shop/actions/workflows/deploy.yml/badge.svg)](https://github.com/shiliaiwei/the-outfit-shop/actions/workflows/deploy.yml)
[![Edge Production](https://img.shields.io/badge/Production-theoufit.kesararamwithdigital.tech-C84428)](https://theoufit.kesararamwithdigital.tech)

---

## 🌟 Overview

- **Brand Integrity**: Strict universal **OUTFIT** branding, warm Espresso (`#4A3F35`) no-black palette, and precision Liquid Glass UI with 3px radius standards (`rounded-[3px]`).
- **Dual-Layer Persistence Engine**: Synchronizes state instantly with local storage (`entityStore`) and REST API fallback, ensuring zero data loss on page refresh (`F5`).
- **Full-Stack Retail & POS Platform**: POS terminal with dual-currency cash floats (USD / KHR), hotkey navigation (`F2`, `F9`, `F12`), Master Catalog, FIFO batch inventory tracking, and purchase orders.
- **Media Asset Pipeline**: Real-time integration with Cloudinary cloud `od8t271n` across 24 folder hierarchies with 1,843 live product photos, fullscreen lightbox, and instant CDN asset inspection.
- **Operations & Fulfillment**: Shipping & logistics tracking with live Order #25 timeline, Flagship Registry location manager, and VIP Gift Card credit manager.
- **Enterprise Governance**: Triple-lock RBAC, GDPR data compliance, and APM telemetry.
- **Modern Web Stack**: Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS 4, TanStack Query, and Zod data validation envelopes.

---

## 📁 Repository Structure

```
├── .agents/
│   ├── rules/                 # Coding and brand design rules
│   │   ├── brand-select-dropdowns.md
│   │   ├── confirm-modal-and-alerts.md
│   │   ├── authentication-ui-standards.md
│   │   ├── icon-design-standards.md
│   │   ├── product-asset-and-size-selectors.md
│   │   ├── api-error-triage-and-backend-prompts.md
│   │   └── git-workflow.md
│   └── skills/                # Liquid glass design & admin interactive patterns
│       ├── liquid-glass-design-system/SKILL.md
│       ├── outfit-admin-interactive-patterns/SKILL.md
│       └── api-error-diagnosis-and-backend-handoff/SKILL.md
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD typecheck, audit, build & deployment pipeline
├── outfit-shop/               # Next.js 16 Production Application
│   ├── src/
│   │   ├── app/               # Next.js App Router (Storefront & Admin 46+ routes)
│   │   ├── components/        # Liquid Glass UI & feature components
│   │   ├── hooks/             # Custom React, POS & TanStack Query hooks
│   │   ├── lib/               # Storage sync (entityStore), API client, utilities
│   │   ├── services/          # Typed API service integrations
│   │   └── types/             # Canonical TypeScript interfaces
│   ├── ARCHITECTURE.md        # Technical architecture & design guidelines
│   └── README.md              # Application guide & quickstart
├── OutfitShop_Master_Collection.json # Postman / REST API specification
└── package.json               # Root monorepo workspace scripts
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm --prefix outfit-shop install
```

### 2. Environment Configuration
Create `outfit-shop/.env.local`:
```env
NEXT_PUBLIC_API_BASE=https://api.kesararamwithdigital.tech/api/v1
```

### 3. Run Locally
```bash
# From repository root
npm run dev

# Or inside outfit-shop
cd outfit-shop && npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Mandatory Pre-Push & Pre-Merge CI/CD Checkpoint
```bash
# Strict Typecheck (0 errors)
cd outfit-shop && npx tsc --noEmit

# Production Build & Route Generation (Exit Code 0)
cd outfit-shop && npm run build
```

---

## 📘 Documentation Index
- [Platform Architecture & Design System](outfit-shop/ARCHITECTURE.md)
- [Application Readme](outfit-shop/README.md)
- [Liquid Glass Design System Specification](.agents/skills/liquid-glass-design-system/SKILL.md)
- [Admin Interactive Patterns Specification](.agents/skills/outfit-admin-interactive-patterns/SKILL.md)
- [API Error Diagnosis & Backend Handoff](.agents/skills/api-error-diagnosis-and-backend-handoff/SKILL.md)
- [Brand Select Component Guidelines](.agents/rules/brand-select-dropdowns.md)
- [Confirm Modal & Alert Standards](.agents/rules/confirm-modal-and-alerts.md)
- [API Master Collection](OutfitShop_Master_Collection.json)

---

© 2026 OUTFIT Master Platform. Confidential & Proprietary.
