"use client";

import { useState, useEffect, useMemo } from "react";
import { CatalogService } from "@/services/catalogService";
import { ShopProduct, ApiPagination } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faFilter,
  faBox,
  faEye,
  faPenToSquare,
  faTrashCan,
  faRotate,
  faXmark,
  faImage,
  faTag,
  faBarcode,
  faDollarSign,
  faBoxesStacked,
  faArrowRight,
  faLayerGroup,
  faShieldHalved,
  faCircleCheck,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";
import { CloudinaryAssetPicker } from "@/components/admin/CloudinaryAssetPicker";
import { SizeSelector } from "@/components/admin/SizeSelector";
import { entityStore } from "@/lib/storage/entityStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORY_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Categories" },
  { value: "Overshirts", label: "Overshirts" },
  { value: "Ready-to-Wear", label: "Ready-to-Wear" },
  { value: "Knits", label: "Supima Knits" },
  { value: "Trousers", label: "Tailored Trousers" },
  { value: "Outerwear", label: "Outerwear" },
  { value: "Accessories", label: "Accessories" }
];

const BRAND_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Brands" },
  { value: "OUTFIT", label: "OUTFIT Haute Atelier" },
  { value: "Gucci", label: "Gucci" },
  { value: "Prada", label: "Prada" },
  { value: "Loro Piana", label: "Loro Piana" },
  { value: "Brunello Cucinelli", label: "Brunello Cucinelli" }
];

const STOCK_STATUS_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Stock Levels" },
  { value: "IN_STOCK", label: "In Stock (> 5 units)" },
  { value: "LOW_STOCK", label: "Low Stock (<= 5 units)" },
  { value: "OUT_OF_STOCK", label: "Out of Stock (0 units)" }
];

export default function InventoryPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    name: "",
    brand: "OUTFIT",
    category: "Overshirts",
    sku: "",
    barcode: "",
    price: 120,
    costPrice: 65,
    stock: 25,
    imageUrl: "",
    material: "100% Normandy Flax Linen • 280 GSM",
    description: "",
    sizes: "S, M, L, XL"
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    brand: "OUTFIT",
    category: "Overshirts",
    sku: "",
    barcode: "",
    price: 120,
    costPrice: 65,
    stock: 25,
    imageUrl: "",
    material: "",
    description: "",
    sizes: "S, M, L, XL"
  });

  const { user } = useAuth();
  const userRole = user?.role || "ADMIN";
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  const canDelete = isAdminOrManager;
  const canViewCostMargin = isAdminOrManager;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await CatalogService.getLiveProducts({
        page: 1,
        per_page: 50
      });
      const synced = entityStore.sync("inventory_products", res.products);
      setProducts(synced);
      setPagination(res.pagination);
    } catch {
      const local = entityStore.get("inventory_products", []);
      if (local.length > 0) {
        setProducts(local);
      } else {
        toast.error("Failed to sync inventory catalog");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
      const matchBrand = brandFilter === "ALL" || p.brand === brandFilter;
      const matchStock =
        stockFilter === "ALL" ||
        (stockFilter === "IN_STOCK" && p.stock > 5) ||
        (stockFilter === "LOW_STOCK" && p.stock <= 5 && p.stock > 0) ||
        (stockFilter === "OUT_OF_STOCK" && p.stock <= 0);

      return matchSearch && matchCategory && matchBrand && matchStock;
    });
  }, [products, search, categoryFilter, brandFilter, stockFilter]);

  // 1. OPEN DETAILS MODAL
  const handleOpenDetails = (product: ShopProduct) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // 2. OPEN EDIT MODAL
  const handleOpenEdit = (product: ShopProduct) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      brand: product.brand || "OUTFIT",
      category: product.category || "Overshirts",
      sku: product.sku || `SKU-${product.id}`,
      barcode: product.barcode || `BAR-${product.id}`,
      price: product.price || 0,
      costPrice: (product as any).costPrice || Math.round((product.price || 0) * 0.55),
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "",
      material: product.material || "",
      description: product.description || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "S, M, L, XL"
    });
    setIsEditModalOpen(true);
  };

  // 3. OPEN DELETE MODAL
  const handleOpenDelete = (product: ShopProduct) => {
    if (!canDelete) {
      toast.error("Permission Denied: Only Admin/Manager can delete products");
      return;
    }
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // CREATE PRODUCT HANDLER
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    setSubmitting(true);
    const newId = String(Date.now());
    const newProduct: ShopProduct = {
      id: newId,
      name: addFormData.name.trim(),
      brand: addFormData.brand,
      category: addFormData.category,
      sku: addFormData.sku.trim() || `SKU-${newId.slice(-4)}`,
      barcode: addFormData.barcode.trim() || `BAR-${newId.slice(-4)}`,
      price: Number(addFormData.price) || 0,
      stock: Number(addFormData.stock) || 0,
      imageUrl:
        addFormData.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        addFormData.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
      ],
      season: "Core Collection 2026",
      material: addFormData.material.trim() || "100% European Sourced Fabric",
      description: addFormData.description.trim() || "Contemporary silhouette crafted with premium craftsmanship.",
      sizes: addFormData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: [{ name: "Neutral", hex: "#1E2631" }]
    };

    entityStore.add("inventory_products", newProduct);
    setProducts((prev) => [newProduct, ...prev]);
    toast.success(`Product added: ${addFormData.name}`);
    setIsAddModalOpen(false);
    setAddFormData({
      name: "",
      brand: "OUTFIT",
      category: "Overshirts",
      sku: "",
      barcode: "",
      price: 120,
      costPrice: 65,
      stock: 25,
      imageUrl: "",
      material: "100% Normandy Flax Linen • 280 GSM",
      description: "",
      sizes: "S, M, L, XL"
    });
    setSubmitting(false);
  };

  // UPDATE PRODUCT HANDLER
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    const updatedFields = {
      name: editFormData.name.trim(),
      brand: editFormData.brand,
      category: editFormData.category,
      sku: editFormData.sku.trim(),
      barcode: editFormData.barcode.trim(),
      price: Number(editFormData.price) || 0,
      stock: Number(editFormData.stock) || 0,
      imageUrl: editFormData.imageUrl.trim() || selectedProduct.imageUrl,
      material: editFormData.material.trim(),
      description: editFormData.description.trim(),
      sizes: editFormData.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    };

    entityStore.update("inventory_products", selectedProduct.id, updatedFields);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              ...updatedFields
            }
          : p
      )
    );

    toast.success(`Product updated: ${editFormData.name}`);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    setSubmitting(false);
  };

  // DELETE PRODUCT HANDLER
  const handleConfirmDelete = () => {
    if (!selectedProduct) return;
    setSubmitting(true);
    entityStore.delete("inventory_products", selectedProduct.id);
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    toast.success(`Product decommissioned: ${selectedProduct.name}`);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
    setSubmitting(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-text uppercase tracking-tight">Inventory</h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#1E2631]/5 text-text border border-border">
              Role: {userRole}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Product catalog, warehouse stock balances, and item details ({products.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm hover:border-border transition-all cursor-pointer"
            title="Refresh Catalog"
          >
            <FontAwesomeIcon icon={faRotate} className={cn("text-[#1E2631] text-sm h-4 w-4", loading && "animate-spin")} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & BRAND SELECT FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Text Search (2 cols on large screen) */}
        <div className="md:col-span-1 liquid-glass p-1.5 shadow-md flex items-center">
          <div className="relative w-full flex items-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 text-[#1E2631] text-xs h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search by name, SKU, or brand..."
              className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none focus:ring-0 text-xs font-mono text-text placeholder:text-text-muted focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <BrandSelect
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            size="md"
          />
        </div>

        {/* Brand Dropdown */}
        <div>
          <BrandSelect
            options={BRAND_OPTIONS}
            value={brandFilter}
            onChange={(val) => setBrandFilter(val)}
            size="md"
          />
        </div>

        {/* Stock Level Dropdown */}
        <div>
          <BrandSelect
            options={STOCK_STATUS_OPTIONS}
            value={stockFilter}
            onChange={(val) => setStockFilter(val)}
            size="md"
          />
        </div>
      </div>

      {/* 3. FULL IMAGE PRODUCT GRID (Clean Presentation, No Cluttered Price) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && products.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse liquid-glass" />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full py-24 text-center liquid-glass">
            <FontAwesomeIcon icon={faBox} className="text-3xl text-text-muted/30 mb-3" />
            <p className="text-xs font-mono text-text-muted">No products match your filter criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("ALL");
                setBrandFilter("ALL");
                setStockFilter("ALL");
              }}
              className="mt-3 text-[11px] font-bold text-primary uppercase underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isLowStock = p.stock <= 5 && p.stock > 0;
            const isOutOfStock = p.stock <= 0;

            return (
              <div
                key={p.id}
                className="liquid-glass p-0 overflow-hidden group hover:border-border transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* FULL IMAGE SHOWCASE (Portrait Aspect Ratio) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-bg">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-text-muted">
                      <FontAwesomeIcon icon={faImage} className="text-4xl text-[#1E2631]/20" />
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2 py-1 bg-white/95 backdrop-blur-md rounded-[2px] text-[9px] font-bold uppercase tracking-wider text-text shadow-sm border border-border">
                      {p.brand}
                    </span>
                    {isLowStock && (
                      <span className="px-2 py-0.5 bg-warning text-white rounded-[2px] text-[8px] font-black uppercase tracking-wider shadow-sm">
                        Low Stock ({p.stock})
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="px-2 py-0.5 bg-danger text-white rounded-[2px] text-[8px] font-black uppercase tracking-wider shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-[2px] text-[9px] font-mono text-white">
                      {p.category}
                    </span>
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-[2px] text-[9px] font-mono text-white">
                      {p.stock} Units
                    </span>
                  </div>
                </div>

                {/* PRODUCT TITLE & QUICK ACTIONS */}
                <div className="p-4 space-y-3 bg-surface">
                  <div>
                    <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest truncate">
                      {p.sku || `SKU-${p.id}`}
                    </p>
                    <h3 className="text-xs font-black text-text uppercase tracking-tight truncate group-hover:text-primary transition-colors mt-0.5">
                      {p.name}
                    </h3>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/20">
                    <button
                      onClick={() => handleOpenDetails(p)}
                      className="btn-liquid btn-liquid-glass flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEye} className="text-xs text-[#1E2631]" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 border border-border rounded-[2px] text-text hover:text-primary hover:border-primary transition-all cursor-pointer"
                      title="Edit Product"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className="text-xs text-[#1E2631]" />
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => handleOpenDelete(p)}
                        className="p-2 border border-border rounded-[2px] text-text hover:text-danger hover:border-danger transition-all cursor-pointer"
                        title="Delete Product (Admin/Manager)"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs text-[#1E2631]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL 1: VIEW FULL PRODUCT DETAILS */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-2xl w-full shadow-2xl border border-border space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faBox} className="text-[#1E2631] text-base h-4 w-4" />
                <div>
                  <h3 className="text-base font-black text-text uppercase tracking-widest">
                    Product Specification
                  </h3>
                  <p className="text-[10px] font-mono text-text-muted uppercase">
                    SKU: {selectedProduct.sku || `SKU-${selectedProduct.id}`} &bull; Brand: {selectedProduct.brand}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            {/* Layout: Image on Left, Metadata on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Image */}
              <div className="aspect-[3/4] rounded-[2px] overflow-hidden bg-bg border border-border">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-text-muted">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-[#1E2631]/20" />
                  </div>
                )}
              </div>

              {/* Specs & Pricing */}
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[9px] uppercase font-bold text-primary tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-lg font-black text-text uppercase tracking-tight mt-0.5">
                    {selectedProduct.name}
                  </h2>
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-bg border border-border rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted uppercase text-[10px]">Selling Retail Price</span>
                    <span className="text-base font-black text-text font-mono">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  {canViewCostMargin && (
                    <>
                      <div className="flex items-center justify-between border-t border-border/20 pt-2">
                        <span className="text-text-muted uppercase text-[10px]">Estimated Cost Price</span>
                        <span className="text-xs font-bold text-text font-mono">
                          ${((selectedProduct as any).costPrice || (selectedProduct.price * 0.55)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-success">
                        <span className="uppercase text-[10px]">Gross Margin</span>
                        <span className="text-xs font-bold font-mono">
                          {Math.round((1 - (0.55)) * 100)}% Profit
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Inventory Status */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-bg border border-border rounded-[2px]">
                    <p className="text-[8px] uppercase text-text-muted font-bold">On-Hand Stock</p>
                    <p className="text-sm font-black text-text mt-0.5">{selectedProduct.stock} Units</p>
                  </div>
                  <div className="p-3 bg-bg border border-border rounded-[2px]">
                    <p className="text-[8px] uppercase text-text-muted font-bold">Barcode</p>
                    <p className="text-xs font-bold text-text mt-0.5 truncate">{selectedProduct.barcode || "N/A"}</p>
                  </div>
                </div>

                {/* Available Sizes */}
                <div>
                  <p className="text-[10px] uppercase text-text font-bold mb-1">Available Sizes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedProduct.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                      <span key={sz} className="px-2.5 py-1 bg-surface border border-border rounded-[2px] text-[10px] font-bold">
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Textile & Description */}
                <div>
                  <p className="text-[10px] uppercase text-text font-bold mb-1">Fabric &amp; Provenance</p>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {selectedProduct.material || "100% Normandy Flax Linen • 280 GSM"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-text font-bold mb-1">Description</p>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {selectedProduct.description || "Contemporary tailored silhouette with organic European textiles."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEdit(selectedProduct);
                }}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Edit Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="btn-liquid btn-liquid-terracotta flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer shadow-md"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-lg w-full shadow-2xl border border-border space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPlus} className="text-[#1E2631] text-base h-4 w-4" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Add New Product Record
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structured Normandy Overshirt"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Category
                  </label>
                  <BrandSelect
                    options={CATEGORY_OPTIONS.filter((o) => o.value !== "ALL")}
                    value={addFormData.category}
                    onChange={(val) => setAddFormData({ ...addFormData, category: val })}
                    size="md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Brand
                  </label>
                  <BrandSelect
                    options={BRAND_OPTIONS.filter((o) => o.value !== "ALL")}
                    value={addFormData.brand}
                    onChange={(val) => setAddFormData({ ...addFormData, brand: val })}
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    SKU Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OUTFIT-LN-092"
                    value={addFormData.sku}
                    onChange={(e) => setAddFormData({ ...addFormData, sku: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={addFormData.stock}
                    onChange={(e) => setAddFormData({ ...addFormData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Retail Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={addFormData.price}
                    onChange={(e) => setAddFormData({ ...addFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Cost Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addFormData.costPrice}
                    onChange={(e) => setAddFormData({ ...addFormData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Asset Browser & URL Picker */}
              <CloudinaryAssetPicker
                value={addFormData.imageUrl}
                onChange={(url) => setAddFormData({ ...addFormData, imageUrl: url })}
              />

              {/* Interactive Size Chips Multi-Selector */}
              <SizeSelector
                value={addFormData.sizes}
                onChange={(val) => setAddFormData({ ...addFormData, sizes: val })}
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Textile Description &amp; Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Material specs, tailoring origin, fit guidelines..."
                  value={addFormData.description}
                  onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: EDIT PRODUCT */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-lg w-full shadow-2xl border border-border space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPenToSquare} className="text-[#1E2631] text-base h-4 w-4" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Edit Product Information
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Category
                  </label>
                  <BrandSelect
                    options={CATEGORY_OPTIONS.filter((o) => o.value !== "ALL")}
                    value={editFormData.category}
                    onChange={(val) => setEditFormData({ ...editFormData, category: val })}
                    size="md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Brand
                  </label>
                  <BrandSelect
                    options={BRAND_OPTIONS.filter((o) => o.value !== "ALL")}
                    value={editFormData.brand}
                    onChange={(val) => setEditFormData({ ...editFormData, brand: val })}
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Retail Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Stock Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Asset Browser & URL Picker */}
              <CloudinaryAssetPicker
                value={editFormData.imageUrl}
                onChange={(url) => setEditFormData({ ...editFormData, imageUrl: url })}
              />

              {/* Interactive Size Chips Multi-Selector */}
              <SizeSelector
                value={editFormData.sizes}
                onChange={(val) => setEditFormData({ ...editFormData, sizes: val })}
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 4: DELETE CONFIRMATION */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-sm w-full shadow-2xl border border-danger/40 space-y-5 relative">
            <div className="flex items-center gap-3 text-danger">
              <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
              <h3 className="text-base font-black text-text uppercase tracking-widest">
                Delete Product
              </h3>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to decommission <strong className="text-text font-bold">{selectedProduct.name}</strong> from the inventory catalog? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="btn-liquid bg-danger text-white hover:bg-danger/90 flex-1 py-2.5 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
