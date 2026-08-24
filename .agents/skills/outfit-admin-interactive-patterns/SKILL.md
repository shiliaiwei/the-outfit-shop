---
name: outfit-admin-interactive-patterns
description: >
  Comprehensive guide and architectural rules for OUTFIT admin interactivity: Compact Liquid Glass
  confirmation modals, zero native browser alert/confirm popups, Cloudinary asset picker and search,
  interactive size chips multi-selector, minimal icon aesthetics (#1E2631 solid without shape containers),
  live event-driven header notification feeds, and universal mobile navigation drawers.
  Trigger on: "skill", "record skill", "confirm modal", "cloudinary picker", "size selector", "alert", "header dropdown".
---

# OUTFIT Admin Interactive Engineering & Design Patterns Skill

This skill documents the master UI/UX architecture, component patterns, and operational guidelines for the **OUTFIT Luxury E-Commerce & Admin MIS Suite**.

---

## 1. Zero Native Browser Alerts Policy & `<ConfirmModal />` Architecture
* **Rule**: Never invoke browser native `window.alert()` or `window.confirm()`.
* **Component**: Use `<ConfirmModal />` (`src/components/ui/ConfirmModal.tsx`).
* **Attributes**:
  - Compact container width (`max-w-xs` to `max-w-sm`).
  - Subtle backdrop blur (`bg-black/50 backdrop-blur-xs`).
  - Minimalist iconography with high-contrast typography.
  - Non-blocking notification toasts using Sonner (`toast.success()`, `toast.error()`, `toast.info()`).

---

## 2. Cloudinary Asset Browser & Live Image Picker
* **Rule**: Do not require users to manually type long Cloudinary image URLs in product forms.
* **Component**: Use `<CloudinaryAssetPicker />` (`src/components/admin/CloudinaryAssetPicker.tsx`).
* **Capabilities**:
  - Live gallery synchronization via `opsService.getGallery()`.
  - Instant live keyword filtering across garment types and names.
  - 1-click image selection with immediate form synchronization.
  - Mode switch between **"Cloudinary Library"** and **"Custom URL"**.

---

## 3. Interactive Size Chips Multi-Selector
* **Rule**: Replace raw comma-separated text fields with interactive toggle pills.
* **Component**: Use `<SizeSelector />` (`src/components/admin/SizeSelector.tsx`).
* **Capabilities**:
  - Standard sizes: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `3XL`, `28`, `30`, `32`, `34`, `36`, `One Size`.
  - Active toggle styling: `bg-[#1E2631] text-white border-[#1E2631]`.
  - `+ Custom` inline form for bespoke tailoring measurements.

---

## 4. Minimal Icon & No-Shape-Background Standard
* **Rule**: Icons must not have circular backgrounds, square chips, or decorative wrapper boxes.
* **Framework**: FontAwesome (`@fortawesome/react-fontawesome`).
* **Fill Color**: `#1E2631` solid dark neutral fill.
* **Density**: Use icons sparingly for utility/navigation only; avoid icon clutter on every table cell or text label.

---

## 5. Real-Time Notification & Header Menu Popovers
* **Component**: `<Header />` (`src/components/layout/Header.tsx`).
* **Data Sources**:
  - Live inventory stock thresholds (&le; 5 units = low stock, 0 units = out of stock).
  - POS checkout idempotency transactions.
  - CRM patron VIP milestone upgrades.
  - Edge database replication telemetry.
* **Interaction**: Click-outside auto-close and `Escape` key listeners.

---

## 6. Mandatory Pre-Push CI/CD Checkpoint
Before any git push or deployment:
1. `cd outfit-shop && npx tsc --noEmit` &rarr; Must exit with **0 errors**.
2. `cd outfit-shop && npm run build` &rarr; Must generate all 48+ routes with **exit code 0**.
