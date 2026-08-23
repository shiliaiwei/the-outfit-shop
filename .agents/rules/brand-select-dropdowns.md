# Strict Universal Brand Select & Option Popup Design Standard

## 1. Zero Native `<select>` / `<option>` Policy
* **MANDATORY LAW:** Native HTML `<select>` and `<option>` elements are **STRICTLY PROHIBITED** across the entire application, all admin panels, settings pages, POS interfaces, customer modals, and forms.
* **Rationale:** Native browser `<select>` popups render with generic OS dark-gray or blue dropdown windows (as seen on macOS/Windows/Mobile), completely breaking the luxury OUTFIT aesthetic, custom typography, and design system continuity.

---

## 2. Mandatory Brand Select Component Architecture
All dropdown selections and option menus must use custom brand-styled floating overlay components (such as `<BrandSelect />`).

### Key Specifications:
1. **Trigger Pill / Container**:
   - Background: Clean Ecru/White background (`bg-[#F8F7F4]` or `bg-white`) with high-contrast text (`text-[#1E2631]`).
   - Border: Subtle border `border-[#E5E0D8]` or `border-border`, switching to Terracotta highlight `border-[#C84428]` or `ring-1 ring-[#C84428]` on active/focused state.
   - Border Radius: Strict `2px` or `rounded-md` consistent with brand tokens.
   - Chevron: Modern animated Lucide `ChevronDown` rotating `180deg` when opened.

2. **Floating Options Popup / Overlay**:
   - `position: absolute; z-index: 50;` with smooth entrance animation (`animate-in fade-in-0 zoom-in-95`).
   - Background: Pure solid cream/white or liquid glass backdrop (`bg-white/98 backdrop-blur-md`).
   - Shadow: Deep luxury elevation shadow (`shadow-xl shadow-black/10`).
   - Border: Crisp `1px solid rgba(229, 224, 216, 0.9)`.
   - Max Height & Overflow: `max-h-60 overflow-y-auto` with custom thin luxury scrollbar.

3. **Option Item Row**:
   - Typography: Brand font (Inter / Outfit / Google Sans for Khmer).
   - Default State: `text-[#1E2631]` with subtle padding (`px-3 py-2.5 text-xs font-medium`).
   - Hover / Active State: Background shift to `bg-[#F8F7F4]` or `bg-[#C84428]/5` with text color shifting to `#C84428`.
   - Selected State: Clear `Check` icon indicator in signature Terracotta `#C84428` and subtle bold weight.

4. **Interaction & Accessibility**:
   - Click-outside detection (`useRef` listener) to close popups automatically.
   - Keyboard accessible (`Esc` to close, `ArrowUp`/`ArrowDown` navigation, `Enter` to select).
