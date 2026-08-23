# Icon Design & Visual Hierarchy Standards

## 1. Minimalist Icon Usage
- **Less is More:** Do not clutter UI surfaces, tables, or buttons with excessive, redundant icons.
- **Permanent Ban on Decorative Background Watermark Icons:** Never place giant, semi-transparent watermark icons in card backgrounds (e.g. `size={200}` or `size={120}` background icons).

## 2. Solid Black / Neutral Dark Color Rule & No Shape Backgrounds
- **Mandatory Law:** All UI icons must render in solid dark neutral / black (`text-[#1E2631]` or `text-text`), never in saturated colorful pastel badges.
- **Permanent Ban on Shape Backgrounds Under Icons:** Never place background shape boxes, rounded chips, badge containers, square borders, or circle shapes behind/under icons (no `p-3 bg-bg border rounded`, `w-8 h-8 rounded bg-white/5`, etc.). Icons must stand cleanly directly on the parent surface without wrapper boxes.
- **Status Indicators:** Use minimal text status chips or small clean status dots (`h-2 w-2 rounded-full`) instead of oversized colored icon cards.
