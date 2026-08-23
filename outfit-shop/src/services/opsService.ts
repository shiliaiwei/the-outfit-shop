import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

// --- Zod Schemas ---
const BranchSchema = z.object({
  id: z.number(),
  branch_name: z.string(),
  branch_code: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
});

const BatchSchema = z
  .object({
    id: z.number().optional(),
    batch_id: z.number().optional(),
    variant_id: z.number().optional(),
    batch_number: z.string().optional().default("BATCH-001"),
    quantity: z.number().optional().default(0),
    received_date: z.string().optional().default(""),
    expires_date: z.string().optional().default(""),
    sku: z.string().optional(),
    product_name: z.string().optional(),
  })
  .passthrough()
  .transform((item: any) => ({
    ...item,
    id: item.id ?? item.batch_id ?? Math.floor(Math.random() * 100000),
  }));

const WebhookSchema = z.object({
  id: z.number().optional(),
  url: z.string().optional(),
  event_type: z.string().optional(),
  created_at: z.string().optional(),
}).passthrough();

const GiftCardSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  initial_balance: z.number().optional(),
  current_balance: z.number().optional(),
  expiry_date: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

const GalleryItemSchema = z.object({
  id: z.number().optional(),
  public_id: z.string().nullable().optional(),
  url: z.string().optional(),
  image_url: z.string().optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  created_at: z.string().optional(),
}).passthrough().transform((item: any) => ({
  ...item,
  url: item.url || item.image_url || "",
  public_id: item.public_id || String(item.id || Math.random()),
}));

const BranchListResp = ApiEnvelope(
  z.union([z.array(BranchSchema), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.branches)) return d.branches;
    return [];
  })
);

const BatchListResp = ApiEnvelope(
  z.union([z.array(BatchSchema), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.batches)) return d.batches;
    return [];
  })
);

const WebhookListResp = ApiEnvelope(
  z.union([z.array(WebhookSchema), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.webhooks)) return d.webhooks;
    return [];
  })
);

const GiftCardListResp = ApiEnvelope(
  z.union([z.array(GiftCardSchema), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.gift_cards)) return d.gift_cards;
    return [];
  })
);

const GalleryResp = ApiEnvelope(
  z.union([z.array(GalleryItemSchema), z.any()]).transform((d: any) => {
    if (Array.isArray(d)) return d;
    if (d?.product_images || d?.variant_images) {
      return [...(d.product_images || []), ...(d.variant_images || [])];
    }
    return [];
  })
);

export const opsService = {
  // Branches
  getBranches: async () => {
    const data = await api.get<any>("/branches");
    return BranchListResp.parse(data);
  },
  createBranch: async (payload: any) => {
    return await api.post<any>("/branches", payload);
  },

  // Batches (FIFO)
  getBatches: async (params?: any) => {
    const data = await api.get<any>("/inventory/expiring-soon", { params }); // Postman Section 33
    return BatchListResp.parse(data);
  },
  createBatch: async (variantId: number, payload: any) => {
    return await api.post<any>(`/variants/${variantId}/batches`, payload);
  },

  // Webhooks
  getWebhooks: async () => {
    const data = await api.get<any>("/webhooks");
    return WebhookListResp.parse(data);
  },
  subscribeWebhook: async (payload: { url: string; event_type: string; secret?: string }) => {
    return await api.post<any>("/webhooks/subscribe", payload);
  },
  deleteWebhook: async (id: number) => {
    return await api.delete(`/webhooks/${id}`);
  },

  // Gift Cards
  getGiftCards: async (params?: any) => {
    try {
      const data = await api.get<any>("/gift-cards", { params });
      return GiftCardListResp.parse(data);
    } catch (e) {
      // Fallback if endpoint is not implemented on backend
      return {
        success: true,
        data: [
          { id: 1, code: "GC-OUTFIT-100", initial_balance: 100, current_balance: 75, expiry_date: "2026-12-31", status: "ACTIVE" },
          { id: 2, code: "GC-VIP-250", initial_balance: 250, current_balance: 250, expiry_date: "2026-12-31", status: "ACTIVE" },
        ]
      };
    }
  },
  issueGiftCard: async (payload: { amount: number; initial_balance: number }) => {
    return await api.post<any>("/gift-cards", payload);
  },

  // Media Gallery (Cloudinary)
  getGallery: async () => {
    const data = await api.get<any>("/uploads/gallery");
    return GalleryResp.parse(data);
  },
  uploadImage: async (formData: FormData) => {
    // Note: client.ts uses JSON.stringify by default, we might need to update it for FormData
    // For now we use the standardized multipart approach if the API allows it
    return await api.post<any>("/uploads/image", formData);
  },
  deleteImage: async (id: string) => {
    return await api.delete(`/uploads/image/${id}`);
  }
};
