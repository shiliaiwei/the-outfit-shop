import { api, ApiEnvelope } from "@/lib/api/client";
import { Product, ProductStatus } from "@/types/inventory.types";
import { z } from "zod";

const ProductSchema = z
  .object({
    id: z.number().optional(),
    product_id: z.number().optional(),
    product_name: z.string().optional().default("Unnamed Product"),
    category_id: z.number().optional().default(1),
    brand_id: z.number().optional(),
    brand: z.string().optional(),
    status: z.string().optional().default("ACTIVE"),
    description: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    material_fabric: z.string().nullable().optional(),
    variants: z.array(z.any()).optional().default([]),
    images: z.array(z.any()).optional().default([]),
    primary_image: z.any().optional(),
  })
  .passthrough()
  .transform((item: any) => ({
    ...item,
    id: item.id ?? item.product_id ?? Math.floor(Math.random() * 100000),
  }));

const ProductListResp = ApiEnvelope(
  z.union([z.array(ProductSchema), z.any()]).transform((data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  })
);
const ProductResp = ApiEnvelope(ProductSchema);

export const inventoryService = {
  getProducts: async (params: any) => {
    const data = await api.get<any>("/products", {
      // Need to handle query params in fetch wrapper or here
    });
    return ProductListResp.parse(data);
  },

  getProduct: async (id: number) => {
    const data = await api.get<any>(`/products/${id}`);
    return ProductResp.parse(data).data;
  },

  createProduct: async (product: any) => {
    const data = await api.post<any>("/products", product);
    return ProductResp.parse(data).data;
  },

  adjustStock: async (adjustment: {
    variant_id: number;
    quantity: number;
    movement_type: string;
    note?: string;
  }) => {
    return await api.post("/stock-movements/adjust", adjustment);
  }
};
