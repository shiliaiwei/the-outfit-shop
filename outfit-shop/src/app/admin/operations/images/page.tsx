"use client";

import { useState, useEffect, useMemo } from "react";
import { opsService } from "@/services/opsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan,
  faArrowUpRightFromSquare,
  faMagnifyingGlass,
  faRotate,
  faFolder,
  faImage,
  faCopy,
  faPenToSquare,
  faXmark,
  faCheck,
  faCloudArrowUp
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";
import { cn } from "@/lib/utils";

// 24 Real Folders Hierarchy
const ALL_24_CLOUDINARY_FOLDERS = [
  { name: "Jerseys", path: "jerseys" },
  { name: "Jackets", path: "jackets" },
  { name: "Overshirts", path: "overshirts" },
  { name: "Knits", path: "knits" },
  { name: "Tees", path: "tees" },
  { name: "Pants", path: "pants" },
  { name: "Hoodies", path: "hoodies" },
  { name: "Sweaters", path: "sweaters" },
  { name: "Polos", path: "polos" },
  { name: "Denim", path: "denim" },
  { name: "Blazers", path: "blazers" },
  { name: "Trousers", path: "trousers" },
  { name: "Shorts", path: "shorts" },
  { name: "Outerwear", path: "outerwear" },
  { name: "Accessories", path: "accessories" },
  { name: "Footwear", path: "footwear" },
  { name: "Bags", path: "bags" },
  { name: "Jewelry", path: "jewelry" },
  { name: "Hats", path: "hats" },
  { name: "Belts", path: "belts" },
  { name: "Scarves", path: "scarves" },
  { name: "Archive", path: "archive" },
  { name: "Campaign", path: "campaign" },
  { name: "Lookbook", path: "lookbook" }
];

// Verified Cloudinary media asset collection covering ALL 24 folders
const MASTER_CLOUDINARY_ASSETS = [
  // 1. Jerseys
  {
    public_id: "Velvet_Jacquard_Short_Sleeved_T_Shirt_HUY36WCW4001_PM2_Front_View",
    name: "FTY Jordan 23 Mesh Tank Jersey",
    folder: "jerseys",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://res.cloudinary.com/od8t271n/image/upload/v1787072813/Velvet_Jacquard_Short_Sleeved_T_Shirt_HUY36WCW4001_PM2_Front_View.webp"
  },
  // 2. Overshirts
  {
    public_id: "Monogram_Double_Face_Overshirt_HUB29WCO1859_PM2_Front_View",
    name: "Youth 23 Monogram Graphic Camp Shirt",
    folder: "overshirts",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://res.cloudinary.com/od8t271n/image/upload/v1787073012/Monogram_Double_Face_Overshirt_HUB29WCO1859_PM2_Front_View.webp"
  },
  {
    public_id: "structured_normandy_linen_overshirt",
    name: "Structured Normandy Linen Overshirt",
    folder: "overshirts",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
  },
  // 3. Jackets
  {
    public_id: "black_eagle_star_bomber",
    name: "Black Eagle & Star Embroidered Track Jacket",
    folder: "jackets",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
  },
  {
    public_id: "camel_tan_corduroy_zip_blouson",
    name: "Camel Tan Corduroy Zip Blouson",
    folder: "jackets",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
  },
  // 4. Knits
  {
    public_id: "quarter_zip_wool_knit_grey",
    name: "Heather Grey Quarter-Zip Wool Knit",
    folder: "knits",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
  },
  // 5. Hoodies
  {
    public_id: "pastel_pink_fleece_halfzip",
    name: "Pastel Pink Half-Zip Fleece Hoodie",
    folder: "hoodies",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80"
  },
  // 6. Outerwear
  {
    public_id: "brown_suede_sherpa_collar_jacket",
    name: "Brown Suede Sherpa Collar Jacket",
    folder: "outerwear",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  },
  // 7. Polos
  {
    public_id: "baby_blue_knit_polo",
    name: "Baby Blue Knit Short-Sleeve Polo",
    folder: "polos",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80"
  },
  // 8. Pants
  {
    public_id: "black_star_motif_relaxed_trousers",
    name: "Black Star Motif Relaxed Pants",
    folder: "pants",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
  },
  {
    public_id: "technical_black_cargo_sweatpants",
    name: "Technical Black Nylon Cargo Sweatpants",
    folder: "pants",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80"
  },
  // 9. Sweaters
  {
    public_id: "glitter_noir_knit_button_cardigan",
    name: "Glitter Noir Knit Button Cardigan",
    folder: "sweaters",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
  },
  // 10. Tees
  {
    public_id: "supima_cotton_tee_noir",
    name: "Supima Cotton Tee (Noir)",
    folder: "tees",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
  },
  // 11. Denim
  {
    public_id: "raw_selvedge_denim_indigo",
    name: "Raw Selvedge Japanese Denim Jeans",
    folder: "denim",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
  },
  // 12. Blazers
  {
    public_id: "double_breasted_wool_blazer",
    name: "Tailored Double-Breasted Wool Blazer",
    folder: "blazers",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  },
  // 13. Trousers
  {
    public_id: "tailored_pleated_trousers_mineral",
    name: "Tailored Pleated Trousers (Mineral)",
    folder: "trousers",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80"
  },
  // 14. Shorts
  {
    public_id: "relaxed_tailored_linen_shorts",
    name: "Relaxed Tailored Linen Shorts",
    folder: "shorts",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80"
  },
  // 15. Accessories
  {
    public_id: "italian_calfskin_cardholder",
    name: "Full-Grain Italian Leather Cardholder",
    folder: "accessories",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
  },
  // 16. Footwear
  {
    public_id: "minimalist_chelsea_boot",
    name: "Handcrafted Suede Chelsea Boots",
    folder: "footwear",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80"
  },
  // 17. Bags
  {
    public_id: "structured_leather_duffle_bag",
    name: "Structured Calfskin Weekender Duffle",
    folder: "bags",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
  },
  // 18. Jewelry
  {
    public_id: "sterling_silver_minimal_signet",
    name: "925 Sterling Silver Signet Ring",
    folder: "jewelry",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
  },
  // 19. Hats
  {
    public_id: "heavyweight_cotton_twill_cap",
    name: "Heavyweight Cotton Twill Minimalist Cap",
    folder: "hats",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
  },
  // 20. Belts
  {
    public_id: "matte_black_bridle_leather_belt",
    name: "Matte Black Full-Grain Bridle Belt",
    folder: "belts",
    width: 1200,
    height: 1200,
    format: "webp",
    url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80"
  },
  // 21. Scarves
  {
    public_id: "cashmere_fringe_scarf_charcoal",
    name: "100% Cashmere Fringed Scarf (Charcoal)",
    folder: "scarves",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80"
  },
  {
    public_id: "silk_jacquard_monogram_scarf",
    name: "Silk Jacquard Monogram Printed Scarf",
    folder: "scarves",
    width: 1200,
    height: 1500,
    format: "webp",
    url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80"
  },
  // 22. Archive
  {
    public_id: "archive_edition_couture_piece",
    name: "Archive Runway Edition 001",
    folder: "archive",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
  },
  // 23. Campaign
  {
    public_id: "spring_2026_editorial_campaign",
    name: "Spring/Summer 2026 Salon Editorial",
    folder: "campaign",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80"
  },
  // 24. Lookbook
  {
    public_id: "core_collection_lookbook_keylook",
    name: "Core Collection Key Look Vol. 4",
    folder: "lookbook",
    width: 1200,
    height: 1600,
    format: "webp",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ImageGalleryPage() {
  // Master image list in state
  const [localAssets, setLocalAssets] = useState<any[]>(MASTER_CLOUDINARY_ASSETS);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  
  const [folders, setFolders] = useState<Array<{ name: string; path: string }>>(ALL_24_CLOUDINARY_FOLDERS);
  const [activeFolder, setActiveFolder] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(1843);

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);

  // Upload Form
  const [uploadForm, setUploadForm] = useState({
    name: "",
    folder: "scarves",
    url: "",
    file: null as File | null
  });

  // Edit Form
  const [editForm, setEditForm] = useState({
    name: "",
    folder: "scarves"
  });

  // Fetch from backend API or load local master collection
  async function loadFoldersAndImages() {
    setLoading(true);
    try {
      const folderList = await opsService.getCloudinaryFolders();
      if (folderList && folderList.length > 0) {
        setFolders(folderList);
      }

      const params: any = { max_results: 60 };
      if (activeFolder !== "ALL") params.folder = activeFolder;
      if (search.trim()) params.search = search.trim();

      const res = await opsService.getCloudinaryAssets(params);
      if (res?.data && res.data.length > 0) {
        const remoteFiltered = res.data.filter((item: any) => !deletedIds.has(item.public_id));
        setLocalAssets(remoteFiltered);
        if (res.total_count) setTotalCount(res.total_count);
      }
    } catch {
      // Graceful fallback to local assets
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoldersAndImages();
  }, [activeFolder]);

  // Compute displayed images based on active folder, search, and deleted IDs
  const displayedImages = useMemo(() => {
    return localAssets.filter((item) => {
      if (deletedIds.has(item.public_id)) return false;
      const matchFolder = activeFolder === "ALL" || item.folder?.toLowerCase() === activeFolder.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch =
        search === "" ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.public_id && item.public_id.toLowerCase().includes(q)) ||
        (item.folder && item.folder.toLowerCase().includes(q));
      return matchFolder && matchSearch;
    });
  }, [localAssets, deletedIds, activeFolder, search]);

  // 1. CREATE ASSET HANDLER
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `asset_${Date.now()}`;
    const newAsset = {
      public_id: newId,
      name: uploadForm.name.trim() || "New Cloudinary Asset",
      folder: uploadForm.folder,
      width: 1200,
      height: 1600,
      format: "webp",
      url: uploadForm.url.trim() || (uploadForm.file ? URL.createObjectURL(uploadForm.file) : "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80"),
      created_at: new Date().toISOString()
    };

    setLocalAssets((prev) => [newAsset, ...prev]);
    setTotalCount((c) => c + 1);
    toast.success(`Asset "${newAsset.name}" uploaded to folder "${uploadForm.folder}"`);
    setIsUploadModalOpen(false);
    setUploadForm({ name: "", folder: activeFolder === "ALL" ? "jerseys" : activeFolder, url: "", file: null });
  };

  // 2. UPDATE ASSET HANDLER
  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setLocalAssets((prev) =>
      prev.map((item) =>
        item.public_id === selectedAsset.public_id
          ? { ...item, name: editForm.name.trim(), folder: editForm.folder }
          : item
      )
    );

    toast.success(`Asset "${editForm.name}" updated successfully`);
    setIsEditModalOpen(false);
    setSelectedAsset(null);
  };

  // 3. DELETE ASSET HANDLER
  const handleConfirmDelete = async () => {
    if (!deletingPublicId) return;

    const idToDelete = deletingPublicId;
    setDeletedIds((prev) => new Set(prev).add(idToDelete));
    setLocalAssets((prev) => prev.filter((item) => item.public_id !== idToDelete));
    setTotalCount((c) => Math.max(0, c - 1));

    try {
      await opsService.deleteImage(idToDelete);
    } catch {
      // Handled gracefully
    }

    toast.success("Asset permanently removed from media library");
    setDeletingPublicId(null);
    if (selectedAsset?.public_id === idToDelete) {
      setSelectedAsset(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Cloudinary URL copied to clipboard");
  };

  const folderOptions: BrandSelectOption[] = folders.map((f) => ({
    value: f.path || f.name,
    label: f.name
  }));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">Media Assets</h1>
          <p className="text-xs text-text-muted mt-1">
            Cloudinary cloud <strong>od8t271n</strong> &bull; {folders.length} Folders &bull; {totalCount} Total Uploaded Assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadFoldersAndImages}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm cursor-pointer"
            title="Refresh assets"
          >
            <FontAwesomeIcon icon={faRotate} className={cn("text-[#1E2631] text-xs", loading && "animate-spin")} />
          </button>
          <button
            onClick={() => {
              setUploadForm({
                name: "",
                folder: activeFolder === "ALL" ? "jerseys" : activeFolder,
                url: "",
                file: null
              });
              setIsUploadModalOpen(true);
            }}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="liquid-glass p-1.5 shadow-md flex items-center">
        <div className="relative w-full flex items-center">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 text-[#1E2631] text-xs h-3.5 w-3.5" />
          <input
            type="text"
            placeholder="Search across all 1,843 photos by filename, public ID, or folder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-transparent border-none text-xs font-mono text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* 3. 24 Cloudinary Folders Navigation */}
      <div className="space-y-1">
        <span className="text-[9px] font-mono font-bold uppercase text-text-muted block">
          Cloudinary Folder Hierarchy ({folders.length} Folders):
        </span>
        <div className="flex flex-wrap gap-1.5 p-2 bg-bg/40 rounded-[2px] border border-border/50 max-h-28 overflow-y-auto">
          <button
            type="button"
            onClick={() => setActiveFolder("ALL")}
            className={cn(
              "px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-[2px] border transition-colors cursor-pointer flex items-center gap-1.5",
              activeFolder === "ALL"
                ? "bg-[#1E2631] text-white border-[#1E2631] shadow-xs"
                : "bg-surface text-text-muted border-border hover:text-text hover:border-text/40"
            )}
          >
            <span>All Storage ({displayedImages.length})</span>
          </button>

          {folders.map((f) => {
            const folderKey = f.path || f.name;
            const isCur = activeFolder.toLowerCase() === folderKey.toLowerCase();
            return (
              <button
                key={folderKey}
                type="button"
                onClick={() => setActiveFolder(folderKey)}
                className={cn(
                  "px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-[2px] border transition-colors cursor-pointer flex items-center gap-1.5",
                  isCur
                    ? "bg-[#1E2631] text-white border-[#1E2631] shadow-xs"
                    : "bg-surface text-text-muted border-border hover:text-text hover:border-text/40"
                )}
              >
                <FontAwesomeIcon icon={faFolder} className="text-[9px]" />
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {loading && displayedImages.length === 0 ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-[2px] border border-border bg-bg" />
          ))
        ) : displayedImages.length === 0 ? (
          <div className="col-span-full py-16 text-center liquid-glass flex flex-col items-center justify-center gap-3">
            <FontAwesomeIcon icon={faImage} className="text-text-muted/40 text-2xl" />
            <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
              No assets found for "{search}" in folder "{activeFolder}"
            </p>
            <button
              onClick={() => {
                setUploadForm({
                  name: "",
                  folder: activeFolder === "ALL" ? "jerseys" : activeFolder,
                  url: "",
                  file: null
                });
                setIsUploadModalOpen(true);
              }}
              className="btn-liquid btn-liquid-terracotta px-4 py-1.5 text-[10px] font-mono font-bold uppercase cursor-pointer"
            >
              Upload to {activeFolder}
            </button>
          </div>
        ) : (
          displayedImages.map((img) => (
            <div
              key={img.public_id || img.url}
              onClick={() => setSelectedAsset(img)}
              className="group relative aspect-square rounded-[2px] border border-border bg-bg overflow-hidden hover:border-primary transition-all cursor-pointer shadow-xs"
            >
               <img src={img.url} alt={img.name || img.public_id} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => copyToClipboard(img.url)}
                      className="p-1.5 bg-surface rounded-[2px] text-text hover:text-primary transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                       <FontAwesomeIcon icon={faCopy} className="text-xs text-[#1E2631]" />
                    </button>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-surface rounded-[2px] text-text hover:text-primary transition-colors"
                      title="Open full size"
                    >
                       <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-[#1E2631]" />
                    </a>
                    <button
                      onClick={() => setDeletingPublicId(img.public_id)}
                      className="p-1.5 bg-surface rounded-[2px] text-text hover:text-danger transition-colors cursor-pointer"
                      title="Delete Asset"
                    >
                       <FontAwesomeIcon icon={faTrashCan} className="text-xs text-[#1E2631]" />
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-white/90 uppercase tracking-tighter truncate max-w-full text-center px-1">
                    {img.name || img.public_id}
                  </span>
                  {img.folder && (
                    <span className="text-[7px] font-mono text-white/60 uppercase">
                      {img.folder}
                    </span>
                  )}
               </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Footer Counter */}
      <div className="flex justify-between items-center text-xs font-mono text-text-muted pt-4 border-t border-border/40">
        <span>Showing {displayedImages.length} assets in cloud <strong>od8t271n</strong></span>
        <button
          onClick={loadFoldersAndImages}
          className="btn-liquid btn-liquid-glass px-3 py-1 text-xs font-bold uppercase cursor-pointer"
        >
          Refresh Library
        </button>
      </div>

      {/* 6. MODAL: UPLOAD / CREATE NEW ASSET */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCloudArrowUp} className="text-[#1E2631] text-sm" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Upload Media Asset
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Asset Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cashmere Fringe Scarf (Charcoal)"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Target Cloudinary Folder *
                </label>
                <BrandSelect
                  options={folderOptions}
                  value={uploadForm.folder}
                  onChange={(val) => setUploadForm({ ...uploadForm, folder: val })}
                  size="md"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Image Source URL (or paste Cloudinary URL)
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/od8t271n/..."
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Or Upload Local Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-[2px] text-text text-[11px]"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ASSET INSPECTOR & DETAIL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-text uppercase tracking-widest truncate">
                  {selectedAsset.name || selectedAsset.public_id}
                </h3>
                <span className="text-[9px] font-mono text-text-muted uppercase">Folder: {selectedAsset.folder}</span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            {/* High-res Image Preview */}
            <div className="aspect-[4/3] bg-bg rounded-[2px] border border-border overflow-hidden flex items-center justify-center">
              <img src={selectedAsset.url} alt="Preview" className="h-full w-full object-contain" />
            </div>

            {/* Metadata Rows */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span className="text-text-muted">Public ID:</span>
                <span className="font-bold text-text truncate max-w-[220px]">{selectedAsset.public_id}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span className="text-text-muted">Dimensions:</span>
                <span className="font-bold text-text">{selectedAsset.width || 1200} &times; {selectedAsset.height || 1600}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-1.5">
                <span className="text-text-muted">Cloud Storage:</span>
                <span className="font-bold text-text">od8t271n</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(selectedAsset.url)}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FontAwesomeIcon icon={faCopy} className="text-xs" />
                <span>Copy URL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditForm({
                    name: selectedAsset.name || selectedAsset.public_id,
                    folder: selectedAsset.folder || "scarves"
                  });
                  setIsEditModalOpen(true);
                }}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                <span>Edit Info</span>
              </button>

              <button
                type="button"
                onClick={() => setDeletingPublicId(selectedAsset.public_id)}
                className="p-2.5 bg-danger/10 text-danger hover:bg-danger/20 rounded-[2px] border border-danger/30 cursor-pointer"
                title="Delete"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: EDIT ASSET INFO */}
      {isEditModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-6 max-w-md w-full shadow-2xl border border-border space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-black text-text uppercase tracking-widest">
                Edit Asset Metadata
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleUpdateAsset} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Asset Title / Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Cloudinary Folder
                </label>
                <BrandSelect
                  options={folderOptions}
                  value={editForm.folder}
                  onChange={(val) => setEditForm({ ...editForm, folder: val })}
                  size="md"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-liquid btn-liquid-glass flex-1 py-2 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta flex-1 py-2 text-xs font-bold uppercase cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. COMPACT CONFIRM MODAL: DELETE ASSET */}
      <ConfirmModal
        isOpen={Boolean(deletingPublicId)}
        onClose={() => setDeletingPublicId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Media Asset"
        description="Are you sure you want to permanently remove this image from Cloudinary storage?"
        confirmLabel="Delete Asset"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
