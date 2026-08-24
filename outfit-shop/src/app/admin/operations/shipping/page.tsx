"use client";

import { useState, useEffect, useMemo } from "react";
import { fulfillmentService } from "@/services/fulfillmentService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";
import {
  Truck,
  Search,
  Package,
  ExternalLink,
  MapPin,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Copy,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CARRIER_FILTER_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Logistics Carriers" },
  { value: "KHN Express", label: "KHN Express (Same-Day)" },
  { value: "GrabExpress VIP", label: "GrabExpress VIP Concierge" },
  { value: "J&T Express", label: "J&T Express Cambodia" },
  { value: "DHL Express", label: "DHL Express Priority" }
];

const STATUS_FILTER_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Shipment Statuses" },
  { value: "PROCESSING", label: "Processing & Packaging" },
  { value: "SHIPPED", label: "Handed to Carrier / Shipped" },
  { value: "IN_TRANSIT", label: "In Transit Fleet" },
  { value: "DELIVERED", label: "Delivered & Signed" }
];

export default function ShippingPage() {
  const [shipping, setShipping] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Dispatch Form
  const [dispatchForm, setDispatchForm] = useState({
    order_id: "",
    recipient_name: "",
    phone: "",
    carrier: "KHN Express",
    destination: "",
    shipping_method: "Express Courier (Same Day)",
    tracking_number: `KWD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    weight: "1.2 kg"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fulfillmentService.getShippingOrders();
      setShipping(res?.data || []);
    } catch {
      // Handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncTracking = async () => {
    setLoading(true);
    await loadData();
    toast.success("Live carrier tracking feeds synchronized");
  };

  // Filtered List
  const filteredShipping = useMemo(() => {
    return shipping.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        search === "" ||
        String(s.order_id).includes(q) ||
        `order #${s.order_id}`.toLowerCase().includes(q) ||
        (s.recipient_name && s.recipient_name.toLowerCase().includes(q)) ||
        (s.tracking_number && s.tracking_number.toLowerCase().includes(q)) ||
        (s.destination && s.destination.toLowerCase().includes(q));

      const matchCarrier = carrierFilter === "ALL" || s.carrier === carrierFilter;
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;

      return matchSearch && matchCarrier && matchStatus;
    });
  }, [shipping, search, carrierFilter, statusFilter]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = shipping.length;
    const processing = shipping.filter((s) => s.status === "PROCESSING").length;
    const inTransit = shipping.filter((s) => s.status === "SHIPPED" || s.status === "IN_TRANSIT").length;
    const delivered = shipping.filter((s) => s.status === "DELIVERED").length;
    return { total, processing, inTransit, delivered };
  }, [shipping]);

  // Copy tracking number
  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Tracking code copied: ${code}`);
  };

  // Open Details Modal
  const handleOpenDetails = (s: any) => {
    setSelectedShipment(s);
    setIsDetailModalOpen(true);
  };

  // Advance Status
  const handleAdvanceStatus = async (id: number, currentStatus: string) => {
    let nextStatus = "SHIPPED";
    if (currentStatus === "PROCESSING") nextStatus = "SHIPPED";
    else if (currentStatus === "SHIPPED") nextStatus = "IN_TRANSIT";
    else if (currentStatus === "IN_TRANSIT") nextStatus = "DELIVERED";
    else return;

    await fulfillmentService.updateShippingStatus(id, nextStatus);
    setShipping((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    );
    toast.success(`Shipment status advanced to ${nextStatus}`);
    if (selectedShipment && selectedShipment.id === id) {
      setSelectedShipment({ ...selectedShipment, status: nextStatus });
    }
  };

  // Create Dispatch Consignment
  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchForm.order_id || !dispatchForm.recipient_name.trim()) {
      toast.error("Order # and Recipient Name are required");
      return;
    }

    const newConsignment = {
      order_id: Number(dispatchForm.order_id),
      recipient_name: dispatchForm.recipient_name.trim(),
      phone: dispatchForm.phone.trim() || "+855 12 345 678",
      carrier: dispatchForm.carrier,
      destination: dispatchForm.destination.trim() || "Phnom Penh Central Delivery",
      shipping_method: dispatchForm.shipping_method,
      tracking_number: dispatchForm.tracking_number.trim() || `KWD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      weight: dispatchForm.weight.trim() || "1.0 kg",
      estimated_delivery: "Today by 6:00 PM",
      total_amount: 195.00,
      status: "SHIPPED",
      items: [
        { sku: "OUTFIT-CORE-01", name: "Structured Garment Package", qty: 1, price: 195.00 }
      ],
      timeline: [
        { title: "Consignment Dispatched", time: "Just Now", status: "current" },
        { title: "In Transit with Carrier", time: "Pending", status: "upcoming" },
        { title: "Delivered to Recipient", time: "Pending", status: "upcoming" }
      ]
    };

    const res = await fulfillmentService.createShippingOrder(newConsignment);
    const created = (res as any)?.data || { id: Date.now(), ...newConsignment };
    setShipping((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
    toast.success(`Consignment dispatched for Order #${dispatchForm.order_id}`);
    setIsDispatchModalOpen(false);
    setDispatchForm({
      order_id: "",
      recipient_name: "",
      phone: "",
      carrier: "KHN Express",
      destination: "",
      shipping_method: "Express Courier (Same Day)",
      tracking_number: `KWD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      weight: "1.2 kg"
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-text uppercase tracking-tight">Shipping &amp; Logistics</h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20">
              Live Fleet Active
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track outgoing customer orders, dispatch consignments, and monitor carrier SLA status
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSyncTracking}
            className="btn-liquid btn-liquid-glass px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} className={cn("text-[#1E2631]", loading && "animate-spin")} />
            <span>Sync Tracking</span>
          </button>
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>Dispatch Consignment</span>
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Package size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Total Consignments</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.total}</p>
          </div>
        </LiquidCard>

        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Packaging Prep</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.processing}</p>
          </div>
        </LiquidCard>

        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">In-Transit Fleet</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.inTransit}</p>
          </div>
        </LiquidCard>

        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-success/10 text-success flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Delivered &amp; Signed</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.delivered}</p>
          </div>
        </LiquidCard>
      </div>

      {/* 3. SEARCH & CARRIER FILTER TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 liquid-glass p-1.5 shadow-md flex items-center">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-4 text-[#1E2631] text-xs h-4 w-4" />
            <input
              type="text"
              placeholder="Search by Order # (e.g. 25), Customer, Tracking ID, or Destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-transparent text-xs font-sans text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <BrandSelect
            options={CARRIER_FILTER_OPTIONS}
            value={carrierFilter}
            onChange={setCarrierFilter}
            className="w-full shadow-md"
          />
        </div>

        <div className="md:col-span-3">
          <BrandSelect
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full shadow-md"
          />
        </div>
      </div>

      {/* 4. CONSIGNMENT ORDERS FEED */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : filteredShipping.length === 0 ? (
          <div className="py-20 text-center liquid-glass border border-border">
            <Truck size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
            <p className="text-sm font-bold text-text uppercase tracking-wider">No matching shipments found</p>
            <p className="text-xs text-text-muted mt-1">Try resetting filters or click &quot;Dispatch Consignment&quot; to create a new order shipment.</p>
          </div>
        ) : (
          filteredShipping.map((s) => {
            const isDelivered = s.status === "DELIVERED";
            const isInTransit = s.status === "IN_TRANSIT" || s.status === "SHIPPED";
            const isProcessing = s.status === "PROCESSING" || s.status === "PENDING";

            return (
              <LiquidCard
                key={s.id}
                className={cn(
                  "p-6 transition-all shadow-md group relative hover:border-primary/40",
                  s.order_id === 25 && "border-primary/40 ring-1 ring-primary/20 bg-primary/[0.02]"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Order Meta & Recipient */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-black text-text uppercase font-mono px-2 py-0.5 bg-bg border border-border rounded-[2px]">
                        Order #{s.order_id}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#1E2631]/5 text-text border border-border rounded-[2px]">
                        {s.carrier}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        &bull; {s.shipping_method || "Express Courier"}
                      </span>
                      {s.order_id === 25 && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-terracotta/10 text-terracotta border border-terracotta/20 rounded-[2px]">
                          Target Order
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-text uppercase tracking-tight truncate">
                        {s.recipient_name}
                      </h3>
                      {s.phone && (
                        <span className="text-xs text-text-muted font-mono">({s.phone})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <MapPin size={13} className="text-primary flex-shrink-0" />
                      <span className="truncate">{s.destination || "Phnom Penh Central Distribution"}</span>
                    </div>
                  </div>

                  {/* Center Column: Visual Stepper Progression */}
                  <div className="w-full lg:w-[320px] py-2">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-border -z-0" />
                      <div
                        className="absolute top-2.5 left-2 h-0.5 bg-primary -z-0 transition-all duration-500"
                        style={{
                          width: isDelivered ? "100%" : isInTransit ? "66%" : "33%"
                        }}
                      />

                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="text-[9px] font-mono uppercase font-bold text-text">Packed</span>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                            isInTransit || isDelivered
                              ? "bg-primary text-white"
                              : "bg-surface border border-border text-text-muted"
                          )}
                        >
                          {isInTransit || isDelivered ? "✓" : "2"}
                        </div>
                        <span className="text-[9px] font-mono uppercase font-bold text-text">Carrier</span>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                            isDelivered
                              ? "bg-success text-white"
                              : "bg-surface border border-border text-text-muted"
                          )}
                        >
                          {isDelivered ? "✓" : "3"}
                        </div>
                        <span className="text-[9px] font-mono uppercase font-bold text-text">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tracking Code & Status Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-text-muted uppercase">Tracking:</span>
                      <button
                        onClick={() => handleCopyTracking(s.tracking_number)}
                        className="text-xs font-black text-primary font-mono select-all uppercase hover:underline flex items-center gap-1 cursor-pointer"
                        title="Click to Copy"
                      >
                        <span>{s.tracking_number}</span>
                        <Copy size={11} className="text-text-muted" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShippingStatusBadge status={s.status} />

                      {s.status !== "DELIVERED" && (
                        <button
                          onClick={() => handleAdvanceStatus(s.id, s.status)}
                          className="btn-liquid btn-liquid-glass px-2.5 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer"
                          title="Advance Shipment Progress"
                        >
                          Advance &rarr;
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDetails(s)}
                        className="btn-liquid btn-liquid-terracotta px-3 py-1 text-[10px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1"
                      >
                        <span>Manifest</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </LiquidCard>
            );
          })
        )}
      </div>

      {/* 5. SHIPMENT DETAILS & TRACKING MANIFEST MODAL */}
      {isDetailModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-text uppercase font-mono px-2 py-0.5 bg-bg border border-border rounded-[2px]">
                    Order #{selectedShipment.order_id}
                  </span>
                  <ShippingStatusBadge status={selectedShipment.status} />
                </div>
                <h2 className="text-lg font-black text-text uppercase tracking-tight mt-1">
                  Consignment &amp; Carrier Manifest
                </h2>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-text-muted hover:text-text p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Recipient & Carrier Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[2px] bg-bg/40 border border-border text-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold uppercase text-text-muted">Recipient Details</p>
                <p className="font-bold text-text uppercase">{selectedShipment.recipient_name}</p>
                <p className="font-mono text-text-muted">{selectedShipment.phone || "+855 12 345 678"}</p>
                <p className="text-text-muted mt-1 leading-relaxed">{selectedShipment.destination}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold uppercase text-text-muted">Logistics Carrier</p>
                <p className="font-bold text-text uppercase">{selectedShipment.carrier}</p>
                <p className="font-mono text-primary font-bold">{selectedShipment.tracking_number}</p>
                <p className="text-text-muted">Est. Delivery: {selectedShipment.estimated_delivery || "Today by 6:00 PM"}</p>
                <p className="text-text-muted">Gross Weight: {selectedShipment.weight || "1.4 kg"}</p>
              </div>
            </div>

            {/* Item Manifest */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-text flex items-center gap-2">
                <Layers size={14} className="text-primary" />
                <span>Enclosed Garment Manifest</span>
              </h4>
              <div className="border border-border divide-y divide-border/40 text-xs">
                {(selectedShipment.items || [
                  { sku: "LN-092", name: "Tailored Normandy Linen Overshirt", qty: 2, price: 89.00 }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-text uppercase">{item.name}</p>
                      <p className="text-[10px] font-mono text-text-muted">SKU: {item.sku} &bull; Qty: {item.qty}</p>
                    </div>
                    <p className="font-mono font-bold text-text">${((item.price || 0) * (item.qty || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-text flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                <span>Tracking Milestones</span>
              </h4>
              <div className="space-y-2 border-l-2 border-primary/30 pl-4 ml-2 text-xs">
                {(selectedShipment.timeline || [
                  { title: "Order Dispatched & Scanned at Fulfillment Center", time: "11:30 AM", status: "completed" },
                  { title: "In Transit with Courier", time: "01:45 PM", status: "current" },
                  { title: "Delivered to Customer", time: "Pending", status: "upcoming" }
                ]).map((milestone: any, idx: number) => (
                  <div key={idx} className="relative py-1">
                    <div
                      className={cn(
                        "absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full border-2 bg-surface",
                        milestone.status === "completed"
                          ? "border-primary bg-primary"
                          : milestone.status === "current"
                          ? "border-accent bg-accent animate-pulse"
                          : "border-border"
                      )}
                    />
                    <p className="font-bold text-text uppercase text-[11px]">{milestone.title}</p>
                    <p className="text-[10px] font-mono text-text-muted">{milestone.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/40">
              {selectedShipment.status !== "DELIVERED" ? (
                <button
                  onClick={() => handleAdvanceStatus(selectedShipment.id, selectedShipment.status)}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Advance Status &rarr;
                </button>
              ) : (
                <span className="text-xs font-bold font-mono text-success uppercase flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Verified &amp; Signed
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="btn-liquid btn-liquid-terracotta px-5 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DISPATCH NEW CONSIGNMENT MODAL */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-text uppercase tracking-tight">
                Dispatch New Consignment
              </h2>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Order #</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={dispatchForm.order_id}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, order_id: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Carrier</label>
                  <select
                    value={dispatchForm.carrier}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, carrier: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="KHN Express">KHN Express</option>
                    <option value="GrabExpress VIP">GrabExpress VIP</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="DHL Express">DHL Express</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovan Sophea"
                  value={dispatchForm.recipient_name}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, recipient_name: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +855 12 345 678"
                  value={dispatchForm.phone}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, phone: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Destination Address</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Street 302, Boeung Keng Kang 1 (BKK1), Phnom Penh"
                  value={dispatchForm.destination}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, destination: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={dispatchForm.tracking_number}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, tracking_number: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Gross Weight</label>
                  <input
                    type="text"
                    value={dispatchForm.weight}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, weight: e.target.value })}
                    placeholder="e.g. 1.4 kg"
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta px-5 py-2 text-xs font-mono font-bold uppercase"
                >
                  Dispatch Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ShippingStatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-warning/10 text-warning border-warning/20",
    PROCESSING: "bg-accent/10 text-accent border-accent/20",
    SHIPPED: "bg-primary/10 text-primary border-primary/20",
    IN_TRANSIT: "bg-primary/15 text-primary border-primary/30",
    DELIVERED: "bg-success/10 text-success border-success/20",
    RETURNED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold border uppercase tracking-wider inline-flex items-center gap-1",
        styles[status] || "bg-bg text-text-muted border-border"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "DELIVERED"
            ? "bg-success"
            : status === "PROCESSING"
            ? "bg-accent animate-pulse"
            : "bg-primary"
        )}
      />
      <span>{status.replace("_", " ")}</span>
    </span>
  );
}
