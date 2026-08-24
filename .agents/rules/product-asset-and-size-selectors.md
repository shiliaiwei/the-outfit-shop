# Product Imagery Cloudinary Browser & Interactive Size Selection Standard

## 1. Zero Manual Image URL Typing Requirement
* Whenever users manage product imagery (in Add Product or Edit Product modals), provide a visual **Cloudinary Asset Browser / Picker** (`<CloudinaryAssetPicker />`) that:
  - Fetches real live assets from the Cloudinary gallery (`opsService.getGallery()`) and verified catalog assets.
  - Supports instant search/filtering (e.g. *overshirt, tee, jacket, knit, linen*).
  - Shows visual aspect ratio cards with 1-click selection.
  - Retains an optional "Custom URL" switch for advanced URL pasting.

---

## 2. Interactive Size Chips Multi-Selector Standard
* **STRICT RULE:** Never use raw text inputs for `"Available Sizes (Comma Separated)"`.
* Use the interactive **`<SizeSelector />`** component:
  - Standard pre-populated fashion sizes: `XS`, `S`, `M`, `L`, `XL`, `XXL`, `3XL`, `28`, `30`, `32`, `34`, `36`, `One Size`.
  - 1-tap/click toggle behavior with solid dark active highlight (`bg-[#1E2631] text-white`).
  - Support `+ Custom` size entry for tailored sizing (e.g. `40R`, `42L`).
