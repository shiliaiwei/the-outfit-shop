import { api, ApiEnvelope } from "@/lib/api/client";
import { Category, Brand, ClothingSize, Color } from "@/types/inventory.types";
import { z } from "zod";

// --- Zod Schemas for Validation ---
export const CategoryUpsertSchema = z.object({
  category_name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  parent_id: z.number().int().positive().optional(),
});

export const BrandUpsertSchema = z.object({
  brand_name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export const SizeUpsertSchema = z.object({
  size_name: z.string().min(1).max(20),
  size_order: z.number().int().min(0),
});

export const ColorUpsertSchema = z.object({
  color_name: z.string().min(2).max(50),
  hex_code: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
});

// --- API Response Envelopes ---
const CategoryListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) {
      return d.map((item) => ({ ...item, id: item.id ?? item.category_id ?? Math.floor(Math.random() * 10000) }));
    }
    if (d && typeof d === "object") {
      const items = Array.isArray(d.categories) ? d.categories : Object.values(d).filter((v) => typeof v === "object" && v !== null && !Array.isArray(v));
      return items.map((item: any) => ({ ...item, id: item.id ?? item.category_id ?? Math.floor(Math.random() * 10000) }));
    }
    return [];
  })
);

const BrandListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.brands) ? d.brands : []);
    return list.map((item: any) => ({ ...item, id: item.id ?? item.brand_id ?? Math.floor(Math.random() * 10000) }));
  })
);

const SizeListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.sizes) ? d.sizes : []);
    return list.map((item: any) => ({ ...item, id: item.id ?? item.size_id ?? Math.floor(Math.random() * 10000) }));
  })
);

const ColorListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.colors) ? d.colors : (Array.isArray(d?.data) ? d.data : []));
    return list.map((item: any) => {
      let hex = item.hex_code ?? item.hex_color ?? item.hex ?? item.color_code ?? item.code ?? item.value ?? "";
      if (hex && typeof hex === "string") {
        hex = hex.trim();
        if (!hex.startsWith("#") && /^[0-9A-Fa-f]{3,6}$/.test(hex)) {
          hex = `#${hex}`;
        }
      }
      return {
        ...item,
        id: item.id ?? item.color_id ?? Math.floor(Math.random() * 10000),
        color_name: item.color_name ?? item.name ?? item.title ?? "Bespoke Hue",
        hex_code: hex || "#1E2631",
        pantone: item.pantone ?? item.pantone_code ?? "PANTONE ARCHIVE"
      };
    });
  })
);

const CategoryResp = ApiEnvelope(z.any());
const BrandResp = ApiEnvelope(z.any());
const SizeResp = ApiEnvelope(z.any());
const ColorResp = ApiEnvelope(z.any());

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_CATEGORIES = [
  { id: 1, category_name: "Overshirts", description: "Heavyweight unstructured layering pieces." },
  { id: 2, category_name: "Ready-to-Wear", description: "Tailored luxury daily wardrobe garments." },
  { id: 3, category_name: "Supima Knits", description: "California extra-long staple cotton knits." },
  { id: 4, category_name: "Tailored Trousers", description: "Pleated architectural tailored pants." },
  { id: 5, category_name: "Outerwear", description: "Technical weather-shield jackets." },
  { id: 6, category_name: "Accessories", description: "Leather goods and handcrafted accessories." }
];

const DEFAULT_BRANDS = [
  { id: 1, brand_name: "OUTFIT Studio", logo_url: "", description: "In-house bespoke tailoring & structural minimalism.", website: "https://outfit.tech" },
  { id: 2, brand_name: "Linen Atelier", logo_url: "", description: "Normandy Flax heritage weaver collective.", website: "https://linenatelier.eu" },
  { id: 3, brand_name: "Kuroki Mills", logo_url: "", description: "Japanese Okayama selvedge denim.", website: "https://kuroki.jp" },
  { id: 4, brand_name: "Alpine Craft", logo_url: "", description: "Technical outerwear & weather-shield fabrics.", website: "https://alpinecraft.ch" }
];

const DEFAULT_SIZES = [
  { id: 1, size_name: "XS", size_order: 1, size_code: "EU 44" },
  { id: 2, size_name: "S", size_order: 2, size_code: "EU 46" },
  { id: 3, size_name: "M", size_order: 3, size_code: "EU 48" },
  { id: 4, size_name: "L", size_order: 4, size_code: "EU 50" },
  { id: 5, size_name: "XL", size_order: 5, size_code: "EU 52" },
  { id: 6, size_name: "XXL", size_order: 6, size_code: "EU 54" }
];

const DEFAULT_COLORS = [
  { id: 1, color_name: "Charcoal Noir", hex_code: "#1E2631", pantone: "PANTONE 19-4008 TCX" },
  { id: 2, color_name: "Terracotta Earth", hex_code: "#C84428", pantone: "PANTONE 18-1447 TCX" },
  { id: 3, color_name: "Flax Ecru", hex_code: "#EAE6DF", pantone: "PANTONE 12-0710 TCX" },
  { id: 4, color_name: "Deep Indigo", hex_code: "#1B2A4A", pantone: "PANTONE 19-3928 TCX" },
  { id: 5, color_name: "Military Olive", hex_code: "#4B5320", pantone: "PANTONE 18-0527 TCX" },
  { id: 6, color_name: "Sahara Sand", hex_code: "#D2B48C", pantone: "PANTONE 15-1225 TCX" },
  { id: 7, color_name: "Bespoke Espresso", hex_code: "#4A2E18", pantone: "PANTONE 19-1218 TCX" }
];

export const catalogDeepService = {
  // Categories
  getCategories: async () => {
    try {
      const data = await api.get<any>("/categories");
      const parsed = CategoryListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("catalog_categories", parsed.data, DEFAULT_CATEGORIES);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("catalog_categories", DEFAULT_CATEGORIES);
    return { success: true, data: local };
  },
  createCategory: async (payload: z.infer<typeof CategoryUpsertSchema>) => {
    const newCategory = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("catalog_categories", newCategory, DEFAULT_CATEGORIES);
    try {
      const data = await api.post<any>("/categories", payload);
      return CategoryResp.parse(data);
    } catch {
      return { success: true, data: newCategory };
    }
  },
  updateCategory: async (id: number, payload: Partial<z.infer<typeof CategoryUpsertSchema>>) => {
    entityStore.update("catalog_categories", id, payload, DEFAULT_CATEGORIES);
    try {
      const data = await api.patch<any>(`/categories/${id}`, payload);
      return CategoryResp.parse(data);
    } catch {
      return { success: true };
    }
  },
  deleteCategory: async (id: number) => {
    entityStore.delete("catalog_categories", id, DEFAULT_CATEGORIES);
    try {
      return await api.delete(`/categories/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Brands
  getBrands: async () => {
    try {
      const data = await api.get<any>("/brands");
      const parsed = BrandListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("catalog_brands", parsed.data, DEFAULT_BRANDS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("catalog_brands", DEFAULT_BRANDS);
    return { success: true, data: local };
  },
  createBrand: async (payload: z.infer<typeof BrandUpsertSchema>) => {
    const newBrand = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("catalog_brands", newBrand, DEFAULT_BRANDS);
    try {
      const data = await api.post<any>("/brands", payload);
      return BrandResp.parse(data);
    } catch {
      return { success: true, data: newBrand };
    }
  },
  updateBrand: async (id: number, payload: Partial<z.infer<typeof BrandUpsertSchema>>) => {
    entityStore.update("catalog_brands", id, payload, DEFAULT_BRANDS);
    try {
      const data = await api.patch<any>(`/brands/${id}`, payload);
      return BrandResp.parse(data);
    } catch {
      return { success: true };
    }
  },
  deleteBrand: async (id: number) => {
    entityStore.delete("catalog_brands", id, DEFAULT_BRANDS);
    try {
      return await api.delete(`/brands/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Sizes
  getSizes: async () => {
    try {
      const data = await api.get<any>("/clothing-sizes");
      const parsed = SizeListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("catalog_sizes", parsed.data, DEFAULT_SIZES);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("catalog_sizes", DEFAULT_SIZES);
    return { success: true, data: local };
  },
  createSize: async (payload: z.infer<typeof SizeUpsertSchema>) => {
    const newSize = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("catalog_sizes", newSize, DEFAULT_SIZES);
    try {
      const data = await api.post<any>("/clothing-sizes", payload);
      return SizeResp.parse(data);
    } catch {
      return { success: true, data: newSize };
    }
  },
  updateSize: async (id: number, payload: Partial<z.infer<typeof SizeUpsertSchema>>) => {
    entityStore.update("catalog_sizes", id, payload, DEFAULT_SIZES);
    try {
      const data = await api.patch<any>(`/clothing-sizes/${id}`, payload);
      return SizeResp.parse(data);
    } catch {
      return { success: true };
    }
  },
  deleteSize: async (id: number) => {
    entityStore.delete("catalog_sizes", id, DEFAULT_SIZES);
    try {
      return await api.delete(`/clothing-sizes/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Colors
  getColors: async () => {
    try {
      const data = await api.get<any>("/colors");
      const parsed = ColorListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("catalog_colors", parsed.data, DEFAULT_COLORS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("catalog_colors", DEFAULT_COLORS);
    return { success: true, data: local };
  },
  createColor: async (payload: z.infer<typeof ColorUpsertSchema>) => {
    const newColor = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("catalog_colors", newColor, DEFAULT_COLORS);
    try {
      const data = await api.post<any>("/colors", payload);
      return ColorResp.parse(data);
    } catch {
      return { success: true, data: newColor };
    }
  },
  updateColor: async (id: number, payload: Partial<z.infer<typeof ColorUpsertSchema>>) => {
    entityStore.update("catalog_colors", id, payload, DEFAULT_COLORS);
    try {
      const data = await api.patch<any>(`/colors/${id}`, payload);
      return ColorResp.parse(data);
    } catch {
      return { success: true };
    }
  },
  deleteColor: async (id: number) => {
    entityStore.delete("catalog_colors", id, DEFAULT_COLORS);
    try {
      return await api.delete(`/colors/${id}`);
    } catch {
      return { success: true };
    }
  },
};

export const CatalogDeepService = catalogDeepService;
