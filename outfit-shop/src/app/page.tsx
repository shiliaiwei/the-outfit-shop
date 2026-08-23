'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ShopProduct, CartItem, CurrencyCode, ApiPagination, ApiCategory, ApiBrand } from '@/types';
import { CatalogService } from '@/services/catalogService';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { HeroSection } from '@/components/shop/HeroSection';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductQuickViewModal } from '@/components/shop/ProductQuickViewModal';
import { ShoppingBagDrawer } from '@/components/shop/ShoppingBagDrawer';
import { CheckoutReceiptModal } from '@/components/shop/CheckoutReceiptModal';
import { AtelierCraftStory } from '@/components/shop/AtelierCraftStory';
import { ShopFooter } from '@/components/shop/ShopFooter';
import { AtelierGuideModal, AtelierGuideTopic } from '@/components/shop/AtelierGuideModal';
import { CatalogPagination } from '@/components/shop/CatalogPagination';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  Check, 
  Layers, 
  PackageX,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

const INITIAL_PAGINATION: ApiPagination = {
  current_page: 1,
  per_page: 24,
  total_items: 1843,
  total_pages: 77,
  has_next: true,
  has_previous: false,
  from: 1,
  to: 24,
  next_cursor: null,
  previous_cursor: null,
};

export default function HomePage() {
  // 1. Live Catalog & Dynamic Pagination State (Read directly from response.meta.pagination)
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [heroProducts, setHeroProducts] = useState<ShopProduct[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>(INITIAL_PAGINATION);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // 2. Filter, Search, Pagination & Sort State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(24);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [activeSort, setActiveSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock' | 'name'>('featured');

  // 3. Live Metadata (Categories & Brands fetched from backend)
  const [categoriesList, setCategoriesList] = useState<ApiCategory[]>([]);
  const [brandsList, setBrandsList] = useState<ApiBrand[]>([]);

  // 4. Cart & Modals State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ShopProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeGuideTopic, setActiveGuideTopic] = useState<AtelierGuideTopic>(null);

  const catalogRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef<boolean>(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Categories & Brands on Mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, brs] = await Promise.all([
          CatalogService.getCategories(),
          CatalogService.getBrands()
        ]);
        if (cats && cats.length > 0) setCategoriesList(cats);
        if (brs && brs.length > 0) setBrandsList(brs);
      } catch {
        // Fallback
      }
    }
    loadMeta();
  }, []);

  // Map activeCategory name to category_id
  const selectedCategoryId = useMemo(() => {
    if (activeCategory === 'All') return undefined;
    const found = categoriesList.find(
      (c) => c.category_name.toLowerCase() === activeCategory.toLowerCase()
    );
    return found ? found.category_id : undefined;
  }, [activeCategory, categoriesList]);

  // Load Products with Dynamic Backend REST API Pagination
  const fetchProducts = useCallback(async (page: number, itemsPerPage: number, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsCatalogLoading(true);
    }

    try {
      const result = await CatalogService.getLiveProducts({
        page,
        per_page: itemsPerPage,
        brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        category_id: selectedCategoryId,
        q: debouncedSearch.trim() || undefined
      });

      setProducts(result.products);
      setPagination(result.pagination);

      // Populate hero showcase if empty
      if (isInitial || heroProducts.length === 0) {
        setHeroProducts(result.products);
      }
    } catch {
      // CatalogService handles internal fallback
    } finally {
      setIsLoading(false);
      setIsCatalogLoading(false);
    }
  }, [selectedBrand, selectedCategoryId, debouncedSearch, heroProducts.length]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchProducts(1, perPage, true);
      return;
    }

    setCurrentPage(1);
    fetchProducts(1, perPage, false);
  }, [activeCategory, selectedBrand, debouncedSearch]);

  // Fetch when page or perPage changes
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
    fetchProducts(newPage, perPage, false);

    // Smooth scroll back to catalog view
    if (catalogRef.current) {
      const topOffset = catalogRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (newPerPage === perPage) return;
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchProducts(1, newPerPage, false);
  };

  // Client-side sorting for current page pieces
  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (activeSort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'stock':
        return list.sort((a, b) => b.stock - a.stock);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list.sort((a, b) => (b.imageUrl ? 1 : 0) - (a.imageUrl ? 1 : 0));
    }
  }, [products, activeSort]);

  // Curated category filter pills
  const categories = useMemo(() => {
    const list: string[] = ['All'];
    if (categoriesList.length > 0) {
      categoriesList.forEach((c) => {
        if (!list.includes(c.category_name)) list.push(c.category_name);
      });
    } else {
      list.push('T-Shirts & Tops', 'Hoodies & Sweatshirts', 'Jackets & Outerwear', 'Pants & Shorts', 'Footwear & Sneakers');
    }
    return list.slice(0, 7);
  }, [categoriesList]);

  // Curated brand filter pills
  const brandPills = useMemo(() => {
    const list: string[] = ['All'];
    if (brandsList.length > 0) {
      brandsList.slice(0, 6).forEach((b) => {
        if (!list.includes(b.brand_name)) list.push(b.brand_name);
      });
    } else {
      list.push('Louis Vuitton', 'Stussy', 'Nike', 'Tesla', 'xAI Grok');
    }
    return list;
  }, [brandsList]);

  // Cart operations
  const handleAddToCart = (product: ShopProduct, size: string, qty: number = 1) => {
    setCartItems((prev) => {
      const cartItemId = `${product.id}-${size}`;
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          price: product.price,
          qty,
          size,
          color: product.colors[0]?.name || 'Standard',
          imageUrl: product.imageUrl,
          stock: product.stock
        }
      ];
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F7F4] text-[#1E2631] font-sans selection:bg-[#C84428] selection:text-white relative">
      
      {/* 1. Global Public Header with Live Utilities & Dynamic Backend Count */}
      <ShopHeader
        cartCount={cartItems.reduce((acc, i) => acc + i.qty, 0)}
        wishlistCount={0}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalProductsCount={pagination.total_items}
      />

      {/* 2. Hero Editorial Showcase with Dual-Split Parallax Blur */}
      <HeroSection
        totalCount={pagination.total_items}
        products={heroProducts.length > 0 ? heroProducts : products}
        currency={currency}
        onExploreClick={scrollToCatalog}
        onQuickView={setQuickViewProduct}
        onAddToCart={handleAddToCart}
      />

      {/* 3. Main Catalog Section with Live REST API Dynamic Pagination */}
      <main ref={catalogRef} className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex-1">
        
        {/* Streamlined Minimalist Luxury Toolbar */}
        <div className="liquid-glass bg-white/95 border border-[#5A6678]/15 rounded-[2px] p-2 sm:p-2.5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Essential Curated Categories (Live dynamic filters) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`btn-liquid px-3 py-1.5 rounded-[2px] text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                    isSelected
                      ? 'btn-liquid-active bg-[#1E2631] text-white'
                      : 'btn-liquid-glass text-[#5A6678] hover:text-[#1E2631]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right: Curated Brand Selector + Live Count + 1-Tap Sort */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end text-xs font-mono">
            
            {/* Quick Brand Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {brandPills.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`btn-liquid px-2.5 py-1 rounded-[2px] text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                    selectedBrand === b
                      ? 'btn-liquid-terracotta'
                      : 'btn-liquid-glass text-[#8E9AA8] hover:text-[#1E2631]'
                  }`}
                >
                  {b === 'All' ? 'All Brands' : b}
                </button>
              ))}
            </div>

            {/* 1-Tap Instant Sort Switcher */}
            <div className="flex items-center gap-1 pl-2 border-l border-[#5A6678]/15 ml-auto md:ml-0">
              <span className="text-[#8E9AA8] text-[10px] font-bold uppercase tracking-wider hidden lg:inline mr-1">
                Sort:
              </span>
              
              <button
                type="button"
                onClick={() => setActiveSort('featured')}
                className={`btn-liquid px-2 py-1 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSort === 'featured'
                    ? 'btn-liquid-active bg-[#1E2631] text-white shadow-xs'
                    : 'btn-liquid-glass text-[#8E9AA8] hover:text-[#1E2631]'
                }`}
                title="Sort by Featured Atelier Pieces"
              >
                Featured
              </button>

              <button
                type="button"
                onClick={() => setActiveSort('price-asc')}
                className={`btn-liquid px-2 py-1 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSort === 'price-asc'
                    ? 'btn-liquid-active bg-[#1E2631] text-white shadow-xs'
                    : 'btn-liquid-glass text-[#8E9AA8] hover:text-[#1E2631]'
                }`}
                title="Sort Price: Low to High"
              >
                Price ↑
              </button>

              <button
                type="button"
                onClick={() => setActiveSort('price-desc')}
                className={`btn-liquid px-2 py-1 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSort === 'price-desc'
                    ? 'btn-liquid-active bg-[#1E2631] text-white shadow-xs'
                    : 'btn-liquid-glass text-[#8E9AA8] hover:text-[#1E2631]'
                }`}
                title="Sort Price: High to Low"
              >
                Price ↓
              </button>

              <button
                type="button"
                onClick={() => setActiveSort('stock')}
                className={`btn-liquid px-2 py-1 rounded-[2px] text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSort === 'stock'
                    ? 'btn-liquid-active bg-[#1E2631] text-white shadow-xs'
                    : 'btn-liquid-glass text-[#8E9AA8] hover:text-[#1E2631]'
                }`}
                title="Sort by Stock Quantity"
              >
                Stock
              </button>
            </div>

            {/* Dynamic Total Items Indicator */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#5A6678]/15 text-[#8E9AA8] text-[11px] whitespace-nowrap hidden xl:flex">
              Page <strong className="text-[#1E2631]">{pagination.current_page}</strong> of <strong className="text-[#1E2631]">{pagination.total_pages}</strong>
            </div>

          </div>

        </div>

        {/* Product Grid / Loading / Empty States */}
        {isLoading || isCatalogLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: perPage || 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/70 border border-[#5A6678]/10 rounded-[2px] p-3 aspect-[4/6] animate-pulse flex flex-col justify-between"
              >
                <div className="w-full aspect-[4/5] bg-slate-200 rounded-[2px]" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="p-12 text-center liquid-glass bg-white/90 rounded-[2px] border border-[#5A6678]/15 flex flex-col items-center">
            <PackageX className="w-10 h-10 text-[#8E9AA8] mb-3" />
            <h3 className="text-base font-display font-bold text-[#1E2631]">
              No Pieces Match Your Criteria
            </h3>
            <p className="text-xs text-[#5A6678] mt-1 mb-4">
              {debouncedSearch ? `No results found for "${debouncedSearch}"` : 'Try adjusting your category or brand filters'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSelectedBrand('All');
                setSearchQuery('');
              }}
              className="btn-liquid btn-liquid-charcoal px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-[2px] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((p) => {
                const totalInCart = cartItems
                  .filter((item) => item.productId === p.id)
                  .reduce((acc, item) => acc + item.qty, 0);

                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    currency={currency}
                    cartQty={totalInCart}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                );
              })}
            </div>

            {/* Dynamic Catalog Pagination Component (All states driven by response.meta.pagination) */}
            <CatalogPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              isLoading={isCatalogLoading}
            />
          </>
        )}

      </main>

      {/* 4. Atelier Craft & Standards Editorial */}
      <AtelierCraftStory />

      {/* 5. Minimal Editorial Footer with Interactive Topics */}
      <ShopFooter onOpenTopic={(t) => setActiveGuideTopic(t)} />

      {/* 6. Modals & Slide-overs */}
      <ProductQuickViewModal
        product={quickViewProduct}
        currency={currency}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size, qty) => handleAddToCart(p, size, qty)}
      />

      <ShoppingBagDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutReceiptModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        onSuccessOrder={handleOrderSuccess}
      />

      <AtelierGuideModal
        topic={activeGuideTopic}
        onClose={() => setActiveGuideTopic(null)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
      />

    </div>
  );
}

