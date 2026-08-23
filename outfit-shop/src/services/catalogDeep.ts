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
    return list.map((item) => ({ ...item, id: item.id ?? item.brand_id ?? Math.floor(Math.random() * 10000) }));
  })
);

const SizeListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.sizes) ? d.sizes : []);
    return list.map((item) => ({ ...item, id: item.id ?? item.size_id ?? Math.floor(Math.random() * 10000) }));
  })
);

const ColorListResp = ApiEnvelope(
  z.union([z.array(z.any()), z.any()]).transform((d: any) => {
    const list = Array.isArray(d) ? d : (Array.isArray(d?.colors) ? d.colors : []);
    return list.map((item) => ({ ...item, id: item.id ?? item.color_id ?? Math.floor(Math.random() * 10000) }));
  })
);

const CategoryResp = ApiEnvelope(z.any());
const BrandResp = ApiEnvelope(z.any());
const SizeResp = ApiEnvelope(z.any());
const ColorResp = ApiEnvelope(z.any());

export const catalogDeepService = {
  // Categories
  getCategories: async () => {
    const data = await api.get<any>("/categories");
    return CategoryListResp.parse(data);
  },
  createCategory: async (payload: z.infer<typeof CategoryUpsertSchema>) => {
    const data = await api.post<any>("/categories", payload);
    return CategoryResp.parse(data);
  },
  updateCategory: async (id: number, payload: Partial<z.infer<typeof CategoryUpsertSchema>>) => {
    const data = await api.patch<any>(`/categories/${id}`, payload);
    return CategoryResp.parse(data);
  },
  deleteCategory: async (id: number) => {
    return await api.delete(`/categories/${id}`);
  },

  // Brands
  getBrands: async () => {
    const data = await api.get<any>("/brands");
    return BrandListResp.parse(data);
  },
  createBrand: async (payload: z.infer<typeof BrandUpsertSchema>) => {
    const data = await api.post<any>("/brands", payload);
    return BrandResp.parse(data);
  },
  updateBrand: async (id: number, payload: Partial<z.infer<typeof BrandUpsertSchema>>) => {
    const data = await api.patch<any>(`/brands/${id}`, payload);
    return BrandResp.parse(data);
  },
  deleteBrand: async (id: number) => {
    return await api.delete(`/brands/${id}`);
  },

  // Sizes
  getSizes: async () => {
    const data = await api.get<any>("/clothing-sizes");
    return SizeListResp.parse(data);
  },
  createSize: async (payload: z.infer<typeof SizeUpsertSchema>) => {
    const data = await api.post<any>("/clothing-sizes", payload);
    return SizeResp.parse(data);
  },
  updateSize: async (id: number, payload: Partial<z.infer<typeof SizeUpsertSchema>>) => {
    const data = await api.patch<any>(`/clothing-sizes/${id}`, payload);
    return SizeResp.parse(data);
  },
  deleteSize: async (id: number) => {
    return await api.delete(`/clothing-sizes/${id}`);
  },

  // Colors
  getColors: async () => {
    const data = await api.get<any>("/colors");
    return ColorListResp.parse(data);
  },
  createColor: async (payload: z.infer<typeof ColorUpsertSchema>) => {
    const data = await api.post<any>("/colors", payload);
    return ColorResp.parse(data);
  },
  updateColor: async (id: number, payload: Partial<z.infer<typeof ColorUpsertSchema>>) => {
    const data = await api.patch<any>(`/colors/${id}`, payload);
    return ColorResp.parse(data);
  },
  deleteColor: async (id: number) => {
    return await api.delete(`/colors/${id}`);
  },
};

export const CatalogDeepService = catalogDeepService;
