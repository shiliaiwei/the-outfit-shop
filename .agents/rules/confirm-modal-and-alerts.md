# Compact Liquid Glass Modal & Zero Native Alert/Confirm Standard

## 1. Zero Native `confirm()` / `alert()` Policy
* **MANDATORY LAW:** Native browser `window.confirm()` and `window.alert()` popups are **STRICTLY PROHIBITED** across the entire application.
* **Rationale:** Browser-native dialog boxes (`localhost:3000 says ...`) break user experience, cannot be styled, block main-thread execution, and ruin the luxury Liquid Glass design system.

---

## 2. Mandatory Custom `<ConfirmModal />` Standard
All destructive actions (e.g. voiding orders, deleting webhooks, deleting media assets, wiping POS carts, GDPR erasure) must use the reusable `<ConfirmModal />` component (`src/components/ui/ConfirmModal.tsx`).

### Design & Engineering Rules:
1. **Compact Dimensions**: `max-w-xs sm:max-w-sm` with padding `p-5 sm:p-6`.
2. **Liquid Glass Backdrop**: Clean translucent glass overlay (`bg-black/50 backdrop-blur-xs`).
3. **Typography & Hierarchy**:
   - Title: Crisp uppercase tracking `text-xs font-black text-text uppercase tracking-widest`.
   - Description: High readability `text-xs text-text-muted leading-relaxed font-mono`.
4. **Fewer Decorative Icons**:
   - Do NOT clutter modals with massive icon backgrounds or decorative chips.
   - Rely on crisp high-contrast typography and clear `Cancel` / `Confirm` button actions.
5. **Action Buttons**:
   - `Cancel`: Minimal liquid glass button (`btn-liquid btn-liquid-glass py-2 text-xs font-bold uppercase`).
   - `Confirm (Danger)`: Terracotta red button (`btn-liquid btn-liquid-terracotta py-2 text-xs font-bold uppercase`).
6. **Non-blocking Status Messages**:
   - All simple notifications and feedback must use **Sonner toast** (`toast.success()`, `toast.error()`, `toast.info()`).
