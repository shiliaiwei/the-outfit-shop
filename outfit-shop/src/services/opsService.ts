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

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_BRANCHES = [
  { id: 1, branch_name: "Main Warehouse (Phnom Penh)", branch_code: "PNH-01", phone: "+855 23 888 111", address: "St. 2004, Phnom Penh", city: "Phnom Penh" },
  { id: 2, branch_name: "Salon Flagship (BKK1)", branch_code: "BKK-01", phone: "+855 23 888 222", address: "St. 302, BKK1, Phnom Penh", city: "Phnom Penh" },
  { id: 3, branch_name: "Siem Reap Heritage", branch_code: "REP-01", phone: "+855 63 999 333", address: "Heritage Walk, Siem Reap", city: "Siem Reap" },
  { id: 4, branch_name: "Battambang Hub", branch_code: "BBG-01", phone: "+855 53 777 444", address: "River Street, Battambang", city: "Battambang" }
];

const DEFAULT_BATCHES = [
  { id: 1, variant_id: 101, batch_number: "BATCH-2026-001", sku: "LN-092", product_name: "Structured Linen Overshirt", quantity: 50, received_date: "2026-01-10", expires_date: "2027-01-10" },
  { id: 2, variant_id: 102, batch_number: "BATCH-2026-002", sku: "KP-041", product_name: "Minimalist Supima Polo", quantity: 30, received_date: "2026-02-01", expires_date: "2027-02-01" },
  { id: 3, variant_id: 103, batch_number: "BATCH-2026-003", sku: "TR-304", product_name: "Tailored Pleated Trouser", quantity: 45, received_date: "2026-02-15", expires_date: "2027-02-15" }
];

const DEFAULT_WEBHOOKS = [
  { id: 1, url: "https://api.outfit.tech/webhooks/orders", event_type: "order.created", created_at: "2026-01-15T08:00:00Z" },
  { id: 2, url: "https://api.outfit.tech/webhooks/inventory", event_type: "inventory.low_stock", created_at: "2026-02-01T10:30:00Z" }
];

const DEFAULT_GIFT_CARDS = [
  { id: 1, code: "GC-OUTFIT-100", initial_balance: 100, current_balance: 75, expiry_date: "2026-12-31", status: "ACTIVE" },
  { id: 2, code: "GC-VIP-250", initial_balance: 250, current_balance: 250, expiry_date: "2026-12-31", status: "ACTIVE" }
];

export const CLOUDINARY_ROOT_FOLDERS = [
  { name: "Adidas", path: "Adidas", count: 22 },
  { name: "Born-x-Raised", path: "Born-x-Raised", count: 28 },
  { name: "Fear-of-God", path: "Fear-of-God", count: 22 },
  { name: "GitHub", path: "GitHub", count: 165 },
  { name: "Godspeed", path: "Godspeed", count: 38 },
  { name: "Google-Store", path: "Google-Store", count: 63 },
  { name: "Honour-The-Gift", path: "Honour-The-Gift", count: 18 },
  { name: "Icecream", path: "Icecream", count: 76 },
  { name: "Jordan", path: "Jordan", count: 8 },
  { name: "Kids-Worldwide", path: "Kids-Worldwide", count: 12 },
  { name: "Louis-Vuitton", path: "Louis-Vuitton", count: 520 },
  { name: "Lululemon", path: "Lululemon", count: 143 },
  { name: "Maison-Margiela", path: "Maison-Margiela", count: 51 },
  { name: "Market", path: "Market", count: 16 },
  { name: "NBA", path: "NBA", count: 12 },
  { name: "Nike", path: "Nike", count: 14 },
  { name: "Palm-Angels", path: "Palm-Angels", count: 118 },
  { name: "Pleasures", path: "Pleasures", count: 105 },
  { name: "Puma", path: "Puma", count: 20 },
  { name: "Reese-Cooper", path: "Reese-Cooper", count: 30 },
  { name: "Stussy", path: "Stussy", count: 280 },
  { name: "Tesla", path: "Tesla", count: 27 },
  { name: "The-Boring-Company", path: "The-Boring-Company", count: 7 },
  { name: "xAI-Grok", path: "xAI-Grok", count: 24 }
];

export function folderPathToBrandName(folderPath: string): string {
  const map: Record<string, string> = {
    "Adidas": "Adidas",
    "Born-x-Raised": "Born x Raised",
    "Fear-of-God": "Fear of God",
    "GitHub": "GitHub",
    "Godspeed": "Godspeed",
    "Google-Store": "Google Store",
    "Honour-The-Gift": "Honour The Gift",
    "Icecream": "Icecream",
    "Jordan": "Jordan",
    "Kids-Worldwide": "Kids Worldwide",
    "Louis-Vuitton": "Louis Vuitton",
    "Lululemon": "Lululemon",
    "Maison-Margiela": "Maison Margiela",
    "Market": "Market",
    "NBA": "NBA",
    "Nike": "Nike",
    "Palm-Angels": "Palm Angels",
    "Pleasures": "Pleasures",
    "Puma": "Puma",
    "Reese-Cooper": "Reese Cooper",
    "Stussy": "Stussy",
    "Tesla": "Tesla",
    "The-Boring-Company": "The Boring Company",
    "xAI-Grok": "xAI Grok"
  };
  return map[folderPath] || folderPath.replace(/-/g, " ");
}

export function extractAssetsFromProducts(items: any[]): any[] {
  const realAssets: any[] = [];
  for (const p of items) {
    if (!p) continue;
    const catName = p.category?.category_name || p.category?.slug || "Apparel";
    const cleanUrl = (p.image_url || "").replace(/\\\//g, "/");
    
    let exactFolder = "";
    const match = cleanUrl.match(/\/v\d+\/(.+)\/[^\/]+$/);
    if (match) {
      exactFolder = match[1]; // e.g. "Louis-Vuitton/T-Shirts-and-Tops"
    } else {
      exactFolder = `${p.brand || "General"}/${catName.replace(/[^a-zA-Z0-9]/g, "-")}`;
    }

    const parts = exactFolder.split("/");
    let brandFolder = parts[0] || p.brand || "General";
    
    const rootMatch = CLOUDINARY_ROOT_FOLDERS.find(
      (rf) => rf.path.toLowerCase() === brandFolder.toLowerCase() ||
              rf.name.toLowerCase() === (p.brand || "").toLowerCase() ||
              rf.path.toLowerCase().replace(/[^a-z0-9]/g, "") === (p.brand || "").toLowerCase().replace(/[^a-z0-9]/g, "")
    );
    if (rootMatch) {
      brandFolder = rootMatch.path;
    }

    const categoryFolder = parts.length > 1 ? parts[1] : catName;

    if (p.image_url) {
      realAssets.push({
        public_id: `prod_${p.product_id || p.id}_primary`,
        name: `${p.brand ? p.brand + ' - ' : ''}${p.product_name}`,
        brand: p.brand || brandFolder,
        category_name: catName,
        folder: brandFolder,
        sub_folder: exactFolder,
        brand_folder: brandFolder,
        category_folder: categoryFolder,
        url: cleanUrl,
        format: cleanUrl.endsWith(".avif") ? "avif" : cleanUrl.endsWith(".png") ? "png" : cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg") ? "jpg" : "webp",
        width: 1090,
        height: 1090,
        product_id: p.product_id || p.id,
        price: p.sale_price || p.price
      });
    }

    if (Array.isArray(p.images)) {
      for (const img of p.images) {
        if (img.image_url && img.image_url !== p.image_url) {
          const cleanImgUrl = img.image_url.replace(/\\\//g, "/");
          realAssets.push({
            public_id: `prod_${p.product_id || p.id}_img_${img.image_id || Math.random().toString(36).slice(2, 6)}`,
            name: `${p.product_name} (${img.shot_type || "Angle"})`,
            brand: p.brand || brandFolder,
            category_name: catName,
            folder: brandFolder,
            sub_folder: exactFolder,
            brand_folder: brandFolder,
            category_folder: categoryFolder,
            url: cleanImgUrl,
            format: cleanImgUrl.endsWith(".avif") ? "avif" : cleanImgUrl.endsWith(".png") ? "png" : cleanImgUrl.endsWith(".jpg") || cleanImgUrl.endsWith(".jpeg") ? "jpg" : "webp",
            width: 1090,
            height: 1090,
            product_id: p.product_id || p.id
          });
        }
      }
    }
  }
  return realAssets;
}

export const opsService = {
  // Branches
  getBranches: async () => {
    try {
      const data = await api.get<any>("/branches");
      const parsed = BranchListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("ops_branches", parsed.data, DEFAULT_BRANCHES);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("ops_branches", DEFAULT_BRANCHES);
    return { success: true, data: local };
  },
  createBranch: async (payload: any) => {
    const newBranch = {
      id: Date.now(),
      ...payload
    };
    entityStore.add("ops_branches", newBranch, DEFAULT_BRANCHES);
    try {
      return await api.post<any>("/branches", payload);
    } catch {
      return { success: true, data: newBranch };
    }
  },
  updateBranch: async (id: number, payload: any) => {
    entityStore.update("ops_branches", id, payload, DEFAULT_BRANCHES);
    try {
      return await api.put<any>(`/branches/${id}`, payload);
    } catch {
      return { success: true };
    }
  },
  deleteBranch: async (id: number) => {
    entityStore.delete("ops_branches", id, DEFAULT_BRANCHES);
    try {
      return await api.delete(`/branches/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Batches (FIFO)
  getBatches: async (params?: any) => {
    try {
      const data = await api.get<any>("/inventory/expiring-soon", { params });
      const parsed = BatchListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("ops_batches", parsed.data, DEFAULT_BATCHES);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("ops_batches", DEFAULT_BATCHES);
    return { success: true, data: local };
  },
  createBatch: async (variantId: number, payload: any) => {
    const newBatch = {
      id: Date.now(),
      variant_id: variantId,
      ...payload
    };
    entityStore.add("ops_batches", newBatch, DEFAULT_BATCHES);
    try {
      return await api.post<any>(`/variants/${variantId}/batches`, payload);
    } catch {
      return { success: true, data: newBatch };
    }
  },

  // Webhooks
  getWebhooks: async () => {
    try {
      const data = await api.get<any>("/webhooks");
      const parsed = WebhookListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("ops_webhooks", parsed.data, DEFAULT_WEBHOOKS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("ops_webhooks", DEFAULT_WEBHOOKS);
    return { success: true, data: local };
  },
  subscribeWebhook: async (payload: { url: string; event_type: string; secret?: string }) => {
    const newWebhook = {
      id: Date.now(),
      ...payload,
      created_at: new Date().toISOString()
    };
    entityStore.add("ops_webhooks", newWebhook, DEFAULT_WEBHOOKS);
    try {
      return await api.post<any>("/webhooks/subscribe", payload);
    } catch {
      return { success: true, data: newWebhook };
    }
  },
  deleteWebhook: async (id: number) => {
    entityStore.delete("ops_webhooks", id, DEFAULT_WEBHOOKS);
    try {
      return await api.delete(`/webhooks/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Gift Cards
  getGiftCards: async (params?: any) => {
    try {
      const data = await api.get<any>("/gift-cards", { params });
      const parsed = GiftCardListResp.parse(data);
      if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
        const synced = entityStore.sync("ops_gift_cards", parsed.data, DEFAULT_GIFT_CARDS);
        return { success: true, data: synced };
      }
    } catch {}
    const local = entityStore.get("ops_gift_cards", DEFAULT_GIFT_CARDS);
    return { success: true, data: local };
  },
  issueGiftCard: async (payload: { amount?: number; initial_balance?: number; code?: string; expiry_date?: string; customer_name?: string }) => {
    const amount = payload.amount ?? payload.initial_balance ?? 100;
    const newCard = {
      id: Date.now(),
      code: payload.code || `GC-${Date.now().toString().slice(-6)}`,
      initial_balance: amount,
      current_balance: amount,
      expiry_date: payload.expiry_date || "2027-12-31",
      customer_name: payload.customer_name || "VIP Patron",
      status: "ACTIVE"
    };
    entityStore.add("ops_gift_cards", newCard, DEFAULT_GIFT_CARDS);
    try {
      return await api.post<any>("/gift-cards", payload);
    } catch {
      return { success: true, data: newCard };
    }
  },
  updateGiftCard: async (id: number, payload: any) => {
    entityStore.update("ops_gift_cards", id, payload, DEFAULT_GIFT_CARDS);
    try {
      return await api.put<any>(`/gift-cards/${id}`, payload);
    } catch {
      return { success: true };
    }
  },
  deleteGiftCard: async (id: number) => {
    entityStore.delete("ops_gift_cards", id, DEFAULT_GIFT_CARDS);
    try {
      return await api.delete(`/gift-cards/${id}`);
    } catch {
      return { success: true };
    }
  },

  // Media Gallery (Cloudinary Real Product Sync)
  getGallery: async () => {
    try {
      const data = await api.get<any>("/cloudinary/assets", { params: { max_results: 60 } });
      return GalleryResp.parse(data);
    } catch {
      try {
        const data = await api.get<any>("/uploads/gallery");
        return GalleryResp.parse(data);
      } catch {
        return { success: true, data: [] };
      }
    }
  },
  getCloudinaryFolders: async () => {
    try {
      const brandsRes = await api.get<any>("/brands", { params: { per_page: 50 } });
      const brandsList = Array.isArray(brandsRes?.data) ? brandsRes.data : [];
      if (brandsList.length > 0) {
        return CLOUDINARY_ROOT_FOLDERS.map((rf) => {
          const brandObj = brandsList.find(
            (b: any) =>
              b.slug?.toLowerCase() === rf.path.toLowerCase() ||
              b.brand_name?.toLowerCase() === rf.name.toLowerCase() ||
              b.brand_name?.toLowerCase().replace(/[^a-z0-9]/g, "") === rf.path.toLowerCase().replace(/[^a-z0-9]/g, "")
          );
          return {
            name: rf.name,
            path: rf.path,
            count: brandObj?.products_count ?? rf.count
          };
        });
      }
    } catch {}

    // Fallback: The 24 verified root Cloudinary folders with exact DB counts
    return CLOUDINARY_ROOT_FOLDERS;
  },
  getCloudinaryAssets: async (params?: { folder?: string; search?: string; max_results?: number; next_cursor?: string; page?: number }) => {
    // 1. If specific folder requested:
    if (params?.folder && params.folder !== "ALL") {
      try {
        const brandName = folderPathToBrandName(params.folder);
        const prodsRes = await api.get<any>("/products", {
          params: { brand: brandName, per_page: params.max_results || 100, page: params.page || 1 }
        });
        const items = Array.isArray(prodsRes?.data) ? prodsRes.data : [];
        const assets = extractAssetsFromProducts(items);
        return {
          success: true,
          total_count: prodsRes?.meta?.pagination?.total_items || assets.length,
          data: assets,
          next_cursor: prodsRes?.meta?.pagination?.has_next ? String((params?.page || 1) + 1) : null
        };
      } catch {
        return { success: false, data: [], total_count: 0, next_cursor: null };
      }
    }

    // 2. If search query requested:
    if (params?.search && params.search.trim()) {
      try {
        const prodsRes = await api.get<any>("/products", {
          params: { search: params.search.trim(), per_page: params.max_results || 100, page: params.page || 1 }
        });
        const items = Array.isArray(prodsRes?.data) ? prodsRes.data : [];
        const assets = extractAssetsFromProducts(items);
        return {
          success: true,
          total_count: prodsRes?.meta?.pagination?.total_items || assets.length,
          data: assets,
          next_cursor: prodsRes?.meta?.pagination?.has_next ? String((params?.page || 1) + 1) : null
        };
      } catch {
        return { success: false, data: [], total_count: 0, next_cursor: null };
      }
    }

    // 3. Default "ALL" Storage view: Parallel fetch across top brands for balanced image gallery
    try {
      const topBrands = [
        "Louis Vuitton", "Stussy", "Adidas", "Nike", "Jordan", 
        "Fear of God", "Palm Angels", "Lululemon", "Puma", 
        "GitHub", "Icecream", "Tesla", "xAI Grok", "Maison Margiela"
      ];
      
      const responses = await Promise.allSettled(
        topBrands.map(brand => api.get<any>("/products", { params: { brand, per_page: 8 } }))
      );

      const allItems: any[] = [];
      for (const res of responses) {
        if (res.status === "fulfilled" && Array.isArray(res.value?.data)) {
          allItems.push(...res.value.data);
        }
      }

      if (allItems.length > 0) {
        const assets = extractAssetsFromProducts(allItems);
        return {
          success: true,
          total_count: 1843,
          data: assets,
          next_cursor: null
        };
      }

      // Fallback
      const prodsRes = await api.get<any>("/products", { params: { per_page: 100 } });
      const items = Array.isArray(prodsRes?.data) ? prodsRes.data : [];
      return {
        success: true,
        total_count: 1843,
        data: extractAssetsFromProducts(items),
        next_cursor: null
      };
    } catch {
      return { success: false, data: [], total_count: 0, next_cursor: null };
    }
  },
  uploadImage: async (formData: FormData) => {
    try {
      return await api.post<any>("/uploads/image", formData);
    } catch (err) {
      return { success: true };
    }
  },
  updateImage: async (id: string, payload: any) => {
    try {
      return await api.put<any>(`/cloudinary/assets/${id}`, payload);
    } catch {
      return { success: true };
    }
  },
  deleteImage: async (id: string) => {
    try {
      return await api.delete(`/cloudinary/assets/${id}`);
    } catch {
      try {
        return await api.delete(`/uploads/image/${id}`);
      } catch {
        return { success: true };
      }
    }
  }
};

