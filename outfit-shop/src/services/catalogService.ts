import { 
  ApiProduct, 
  ShopProduct, 
  CurrencyCode, 
  ProductQueryParams, 
  PaginatedProductsResult, 
  ApiPagination, 
  ApiCategory, 
  ApiBrand 
} from '@/types';

const API_BASE_URL = 'https://api.kesararamwithdigital.tech/api/v1';

// High-resolution curated editorial fashion imagery for items with missing/broken images
const EDITORIAL_FALLBACK_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85', // Linen shirt
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85', // Minimalist tee
  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85', // Tailored trousers
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=85', // Work jacket
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85', // Black sweater
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85', // Denim jacket
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85', // Knit polo
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=85', // Luxury collection
];

// Fallback catalog in case of extreme backend disconnection
const VERIFIED_FALLBACK_PRODUCTS: ShopProduct[] = [
  {
    id: '182',
    name: 'Gucci Structured Oxford Shirt',
    brand: 'Gucci',
    category: 'Ready-to-Wear',
    description: 'Tailored organic Egyptian cotton oxford shirt with mother-of-pearl buttons and relaxed tailoring fit.',
    price: 125.00,
    originalPrice: 160.00,
    stock: 269,
    sku: 'SKU-GUC-0182',
    barcode: 'SKU-GUC-0182',
    material: '100% Egyptian Cotton • 180 GSM',
    season: 'Core Collection 2026',
    imageUrl: 'https://res.cloudinary.com/od8t271n/image/upload/v1787072813/Velvet_Jacquard_Short_Sleeved_T_Shirt_HUY36WCW4001_PM2_Front_View.webp',
    gallery: [
      'https://res.cloudinary.com/od8t271n/image/upload/v1787072813/Velvet_Jacquard_Short_Sleeved_T_Shirt_HUY36WCW4001_PM2_Front_View.webp',
      'https://res.cloudinary.com/od8t271n/image/upload/v1787073012/Monogram_Double_Face_Overshirt_HUB29WCO1859_PM2_Front_View.webp'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Mineral Charcoal', hex: '#1E2631' }, { name: 'Canvas Ecru', hex: '#EAE6DF' }]
  },
  {
    id: '2',
    name: 'Tailored Normandy Linen Overshirt',
    brand: 'OutFIT',
    category: 'Overshirts',
    description: 'Unstructured tailoring crafted from heavy 280 GSM Normandy linen. Garment dyed for subtle patina.',
    price: 89.00,
    originalPrice: 110.00,
    stock: 48,
    sku: 'OUTFIT-LN-092',
    barcode: 'SKU-LN-092-M',
    material: '100% Normandy Flax Linen • 280 GSM',
    season: 'Spring / Summer 2026',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Terracotta', hex: '#C84428' }, { name: 'Raw Sand', hex: '#D2B48C' }]
  },
  {
    id: '3',
    name: 'Minimalist Supima Knit Polo',
    brand: 'OutFIT',
    category: 'Knits',
    description: 'Ultra-fine gauge knit polo in California Supima cotton with a seamless French collar.',
    price: 65.00,
    stock: 32,
    sku: 'OUTFIT-KP-041',
    barcode: 'SKU-KP-041-L',
    material: '100% California Supima Cotton • 24 Gauge',
    season: 'Core Collection 2026',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
    gallery: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sage Green', hex: '#879A89' }, { name: 'Deep Navy', hex: '#1B263B' }]
  },
  {
    id: '4',
    name: 'Pleated Relaxed Tailored Trouser',
    brand: 'OutFIT',
    category: 'Trousers',
    description: 'High-waisted double pleated trouser cut from high-twist tropical wool with natural stretch.',
    price: 95.00,
    originalPrice: 130.00,
    stock: 24,
    sku: 'OUTFIT-TR-304',
    barcode: 'SKU-TR-304-M',
    material: '100% High-Twist Tropical Wool',
    season: 'Spring / Summer 2026',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
    gallery: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Slate Gray', hex: '#5A6678' }, { name: 'Obsidian Black', hex: '#1E2631' }]
  }
];

export const CatalogService = {
  // Fetch real-time products with dynamic query parameters from the backend REST API
  async getLiveProducts(params?: ProductQueryParams): Promise<PaginatedProductsResult> {
    const page = params?.page || 1;
    const perPage = params?.per_page || 24;

    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('per_page', String(perPage));
    if (params?.brand && params.brand !== 'All') {
      query.set('brand', params.brand);
    }
    if (params?.category_id && params.category_id !== 'All') {
      query.set('category_id', String(params.category_id));
    }
    if (params?.q && params.q.trim()) {
      query.set('q', params.q.trim());
    }

    const queryString = query.toString();

    const fallbackPagination: ApiPagination = {
      current_page: page,
      per_page: perPage,
      total_items: VERIFIED_FALLBACK_PRODUCTS.length,
      total_pages: Math.max(1, Math.ceil(VERIFIED_FALLBACK_PRODUCTS.length / perPage)),
      has_next: false,
      has_previous: page > 1,
      from: VERIFIED_FALLBACK_PRODUCTS.length > 0 ? (page - 1) * perPage + 1 : 0,
      to: Math.min(page * perPage, VERIFIED_FALLBACK_PRODUCTS.length),
      next_cursor: null,
      previous_cursor: null,
    };

    try {
      let json: any = null;

      // 1. Try Next.js internal edge proxy first (Zero CORS)
      try {
        const proxyRes = await fetch(`/api/products?${queryString}`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (proxyRes.ok) {
          json = await proxyRes.json();
        }
      } catch {
        // Fallback to direct call
      }

      // 2. If proxy didn't return data, fetch direct endpoint
      if (!json || !json.data) {
        const res = await fetch(`${API_BASE_URL}/products?${queryString}`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        if (res.ok) {
          json = await res.json();
        }
      }

      if (!json || !json.data || !Array.isArray(json.data)) {
        return {
          products: VERIFIED_FALLBACK_PRODUCTS,
          pagination: fallbackPagination,
        };
      }

      // Helper to strictly ban generic placeholders and bleu-SNPCodeLab
      const isValidImg = (url?: string | null): boolean => {
        if (!url || typeof url !== 'string') return false;
        if (url.includes('bleu-SNPCodeLab') || url.endsWith('null') || url.includes('placeholder')) return false;
        return url.startsWith('http');
      };

      // Transform raw API data into polished ShopProduct structure
      const products: ShopProduct[] = json.data.map((p: ApiProduct, index: number) => {
        // Collect gallery images (Strictly excluding bleu-SNPCodeLab)
        const galleryUrls: string[] = [];
        if (isValidImg(p.primary_image?.image_url)) galleryUrls.push(p.primary_image!.image_url!);
        if (p.images && Array.isArray(p.images)) {
          p.images.forEach((img) => {
            if (isValidImg(img.image_url) && !galleryUrls.includes(img.image_url)) {
              galleryUrls.push(img.image_url);
            }
          });
        }
        if (isValidImg(p.image_url) && !galleryUrls.includes(p.image_url!)) {
          galleryUrls.push(p.image_url!);
        }

        // Assign authentic editorial fashion image if none exists
        let primaryImg = galleryUrls[0];
        if (!isValidImg(primaryImg)) {
          primaryImg = EDITORIAL_FALLBACK_IMAGES[index % EDITORIAL_FALLBACK_IMAGES.length];
        }

        // Determine price and stock from variants
        let calculatedPrice = 85.00;
        let calculatedStock = 18;
        let skuCode = `OUTFIT-SKU-${p.product_id}`;
        let barcodeCode = `SKU-0${p.product_id}`;

        if (p.variants && p.variants.length > 0) {
          const firstVar = p.variants[0];
          calculatedPrice = Number(firstVar.sale_price) || 85.00;
          calculatedStock = p.variants.reduce((acc, v) => acc + (Number(v.quantity) || 0), 0);
          if (firstVar.sku) skuCode = firstVar.sku;
          if (firstVar.barcode) barcodeCode = firstVar.barcode;
        }

        const categoryName = p.category?.category_name || 'Ready-to-Wear';
        const categoryId = p.category?.category_id || p.category_id;
        const brandName = p.brand || 'OutFIT';
        const materialName = p.material_fabric || '100% Organic Tailored Cotton • 220 GSM';
        const seasonName = p.season_collection || 'Core Collection 2026';

        return {
          id: String(p.product_id),
          name: p.product_name || `Luxury Piece #${p.product_id}`,
          brand: brandName,
          category: categoryName,
          categoryId: categoryId,
          description: p.description || 'Expertly structured haute tailoring garment designed with quiet luxury aesthetics.',
          price: calculatedPrice,
          originalPrice: calculatedPrice > 100 ? calculatedPrice * 1.2 : undefined,
          stock: calculatedStock,
          sku: skuCode,
          barcode: barcodeCode,
          material: materialName,
          season: seasonName,
          imageUrl: primaryImg,
          gallery: galleryUrls.length > 0 ? galleryUrls : [primaryImg],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: [
            { name: 'Charcoal', hex: '#1E2631' },
            { name: 'Terracotta', hex: '#C84428' },
            { name: 'Ecru', hex: '#EAE6DF' }
          ]
        };
      });

      // Parse metadata pagination directly from API
      const rawPagination = json.meta?.pagination;
      const pagination: ApiPagination = rawPagination
        ? {
            current_page: Number(rawPagination.current_page) || page,
            per_page: Number(rawPagination.per_page) || perPage,
            total_items: Number(rawPagination.total_items) ?? products.length,
            total_pages: Number(rawPagination.total_pages) || 1,
            has_next: Boolean(rawPagination.has_next),
            has_previous: Boolean(rawPagination.has_previous),
            from: rawPagination.from !== undefined && rawPagination.from !== null ? Number(rawPagination.from) : (products.length > 0 ? (page - 1) * perPage + 1 : 0),
            to: rawPagination.to !== undefined && rawPagination.to !== null ? Number(rawPagination.to) : (products.length > 0 ? (page - 1) * perPage + products.length : 0),
            next_cursor: rawPagination.next_cursor || null,
            previous_cursor: rawPagination.previous_cursor || null,
          }
        : {
            current_page: page,
            per_page: perPage,
            total_items: products.length,
            total_pages: Math.max(1, Math.ceil(products.length / perPage)),
            has_next: false,
            has_previous: page > 1,
            from: products.length > 0 ? (page - 1) * perPage + 1 : 0,
            to: (page - 1) * perPage + products.length,
            next_cursor: null,
            previous_cursor: null,
          };

      return {
        products,
        pagination,
      };
    } catch {
      return {
        products: VERIFIED_FALLBACK_PRODUCTS,
        pagination: fallbackPagination,
      };
    }
  },

  // Fetch live categories from backend API
  async getCategories(): Promise<ApiCategory[]> {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const directRes = await fetch(`${API_BASE_URL}/categories`);
      if (directRes.ok) {
        const json = await directRes.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    return [
      { category_id: 1, category_name: 'T-Shirts & Tops' },
      { category_id: 2, category_name: 'Hoodies & Sweatshirts' },
      { category_id: 3, category_name: 'Jackets & Outerwear' },
      { category_id: 4, category_name: 'Pants & Shorts' },
      { category_id: 13, category_name: 'Ready-to-Wear & Luxury Goods' }
    ];
  },

  // Fetch live brands from backend API
  async getBrands(): Promise<ApiBrand[]> {
    try {
      const res = await fetch('/api/brands', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const directRes = await fetch(`${API_BASE_URL}/brands`);
      if (directRes.ok) {
        const json = await directRes.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    return [];
  },

  // Fetch diverse random products across multiple brands specifically for Hero Marquee
  async getMarqueeShowcaseProducts(): Promise<ShopProduct[]> {
    try {
      // Fetch 100 products from page 1 to get a broad cross-brand sample
      const broadRes = await this.getLiveProducts({ page: 1, per_page: 100 });
      if (broadRes.products && broadRes.products.length >= 10) {
        return broadRes.products;
      }
    } catch {
      // Fallback
    }
    return VERIFIED_FALLBACK_PRODUCTS;
  },

  // Currency formatting helper
  formatPrice(amountUSD: number, currency: CurrencyCode): string {
    switch (currency) {
      case 'KHR':
        return `${Math.round(amountUSD * 4100).toLocaleString('en-US')} ៛`;
      case 'EUR':
        return `€${(amountUSD * 0.92).toFixed(2)}`;
      case 'USD':
      default:
        return `$${amountUSD.toFixed(2)}`;
    }
  }
};


