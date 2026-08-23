# OUTFIT Haute Atelier — Master Platform & Storefront

Official monorepo and production application for the **OUTFIT** luxury retail management platform, high-density Admin Dashboard, and Storefront.

[![CI/CD Pipeline](https://github.com/shiliaiwei/the-outfit-shop/actions/workflows/deploy.yml/badge.svg)](https://github.com/shiliaiwei/the-outfit-shop/actions/workflows/deploy.yml)
[![Edge Production](https://img.shields.io/badge/Production-theoufit.kesararamwithdigital.tech-C84428)](https://theoufit.kesararamwithdigital.tech)

---

## 🌟 Overview

- **Brand Integrity**: Strict universal **OUTFIT** branding, warm Espresso (`#4A3F35`) no-black palette, and precision Liquid Glass UI with 3px radius standards (`rounded-[3px]`).
- **Full-Stack Retail Platform**: POS terminal with hotkey navigation (`F2`, `F9`, `F12`), Master Catalog with multi-brand support, FIFO batch inventory tracking, and purchase orders.
- **Enterprise Governance**: Triple-lock RBAC, GDPR data compliance, and APM telemetry.
- **Modern Web Stack**: Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS 4, TanStack Query, and Zod data validation envelopes.

---

## 📁 Repository Structure

```
├── .agents/
│   ├── rules/                 # Coding and brand design rules
│   │   ├── brand-select-dropdowns.md
│   │   └── git-workflow.md
│   └── skills/                # Liquid glass design system specifications
│       └── liquid-glass-design-system/SKILL.md
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD typecheck, audit, build & deployment pipeline
├── outfit-shop/               # Next.js 16 Production Application
│   ├── src/
│   │   ├── app/               # Next.js App Router (Storefront & Admin)
│   │   ├── components/        # Liquid Glass UI & feature components
│   │   ├── hooks/             # Custom React & TanStack Query hooks
│   │   ├── lib/               # API client, query client, utilities
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

### 4. Strict Typecheck & Build
```bash
npm --prefix outfit-shop run build
```

---

## 📘 Documentation Index
- [Platform Architecture & Design System](outfit-shop/ARCHITECTURE.md)
- [Application Readme](outfit-shop/README.md)
- [Liquid Glass Design System Specification](.agents/skills/liquid-glass-design-system/SKILL.md)
- [Brand Select Component Guidelines](.agents/rules/brand-select-dropdowns.md)
- [API Master Collection](OutfitShop_Master_Collection.json)

---

© 2026 OUTFIT Master Platform. Confidential & Proprietary.
