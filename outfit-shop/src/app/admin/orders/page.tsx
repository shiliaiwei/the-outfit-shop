"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { OrderDetailsSheet } from "@/components/admin/OrderDetailsSheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faEye,
  faRotate,
  faUser,
  faClock,
  faReceipt,
  faMagnifyingGlass,
  faBan,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";

const STATUS_FILTER_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Transactions" },
  { value: "VERIFIED", label: "Verified & Paid" },
  { value: "VOIDED", label: "Voided Transactions" }
];

const FALLBACK_ORDERS = [
  {
    id: 1042,
    customer_name: "Sovan Sophea",
    cashier_name: "Sothea Kem",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    total: 232.00,
    subtotal: 220.95,
    tax: 11.05,
    is_void: false,
    items: [
      { id: 1, product_name: "Tailored Linen Overshirt", sku: "LN-092", quantity: 2, price: 89.00 },
      { id: 2, product_name: "Heavyweight Supima Tee", sku: "TW-502", quantity: 1, price: 45.00 }
    ]
  },
  {
    id: 1041,
    customer_name: "Bopha Pich",
    cashier_name: "Channara Lim",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    total: 160.00,
    subtotal: 152.38,
    tax: 7.62,
    is_void: false,
    items: [
      { id: 3, product_name: "Minimalist Knit Polo", sku: "KP-041", quantity: 1, price: 65.00 },
      { id: 4, product_name: "Pleated Relaxed Trouser", sku: "TR-304", quantity: 1, price: 95.00 }
    ]
  },
  {
    id: 1040,
    customer_name: "Vannak Ouk",
    cashier_name: "Sothea Kem",
    created_at: new Date(Date.now() - 3600000 * 9).toISOString(),
    total: 218.00,
    subtotal: 207.62,
    tax: 10.38,
    is_void: false,
    items: [
      { id: 5, product_name: "Structured Work Jacket", sku: "JK-881", quantity: 1, price: 140.00 },
      { id: 6, product_name: "Structured Oxford Shirt", sku: "OX-118", quantity: 1, price: 78.00 }
    ]
  },
  {
    id: 1039,
    customer_name: "Guest Patron",
    cashier_name: "Channara Lim",
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    total: 72.00,
    subtotal: 68.57,
    tax: 3.43,
    is_void: true,
    items: [
      { id: 7, product_name: "French Terry Crewneck", sku: "CR-104", quantity: 1, price: 72.00 }
    ]
  }
];

import { entityStore } from "@/lib/storage/entityStore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<any>("/orders");
      const rawList = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.orders) ? res.data.orders : (Array.isArray(res?.orders) ? res.orders : []));
      
      if (rawList.length > 0) {
        const normalized = rawList.map((o: any) => ({
          id: o.id ?? o.order_id ?? o.sale_id ?? Math.floor(Math.random() * 10000),
          customer_name: o.customer_name ?? o.customer?.customer_name ?? o.customer?.name ?? "Guest Patron",
          cashier_name: o.cashier_name ?? o.employee?.employee_name ?? o.employee?.username ?? o.cashier?.name ?? "System",
          created_at: o.created_at ?? o.sale_date ?? new Date().toISOString(),
          total: Number(o.total ?? o.grand_total ?? o.total_amount ?? 0),
          subtotal: Number(o.subtotal ?? o.sub_total ?? 0),
          tax: Number(o.tax ?? o.tax_amount ?? 0),
          is_void: Boolean(o.is_void || o.status === "VOID" || o.status === "CANCELLED"),
          items: (o.items ?? o.order_details ?? o.sale_details ?? []).map((item: any) => ({
            id: item.id ?? item.detail_id ?? Math.floor(Math.random() * 1000),
            product_name: item.product_name ?? item.variant?.product?.product_name ?? item.variant?.product_name ?? item.variant?.name ?? "Product Item",
            sku: item.sku ?? item.variant?.sku ?? "SKU-N/A",
            quantity: Number(item.quantity ?? item.qty ?? 1),
            price: Number(item.price ?? item.unit_price ?? 0)
          }))
        }));
        const synced = entityStore.sync("orders_list", normalized, FALLBACK_ORDERS);
        setOrders(synced);
      } else {
        const local = entityStore.get("orders_list", FALLBACK_ORDERS);
        setOrders(local);
      }
    } catch {
      const local = entityStore.get("orders_list", FALLBACK_ORDERS);
      setOrders(local);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleOpenOrder = (order: any) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      String(o.id).includes(search) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.cashier_name && o.cashier_name.toLowerCase().includes(search.toLowerCase()));

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "VERIFIED" && !o.is_void) ||
      (statusFilter === "VOIDED" && o.is_void);

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-border pb-6 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">Orders</h1>
          <p className="text-xs text-text-muted mt-1">
             Sales transactions and order fulfillment ({orders.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => load()}
            className="btn-liquid btn-liquid-glass px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faRotate} className={cn("text-xs text-[#1E2631]", loading && "animate-spin")} />
            <span>Refresh Orders</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 liquid-glass p-1.5 shadow-md flex items-center">
          <div className="relative w-full flex items-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 text-[#1E2631] text-xs h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or operator..."
              className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none focus:ring-0 text-xs font-mono text-text placeholder:text-text-muted focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <BrandSelect
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="md"
          />
        </div>
      </div>

      {/* 3. ORDER LEDGER LIST (Responsive Cards) */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse liquid-glass" />
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center liquid-glass">
            <p className="text-xs font-mono text-text-muted">No orders match your filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => handleOpenOrder(o)}
              className={cn(
                "liquid-glass p-4 sm:p-5 group cursor-pointer transition-all duration-300 hover:border-primary/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md",
                o.is_void && "bg-danger/[0.03] border-danger/20"
              )}
            >
              {/* Order Header / Customer Info */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <FontAwesomeIcon icon={faReceipt} className="text-[#1E2631] text-lg shrink-0" />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-[10px] font-mono text-primary font-black uppercase tracking-wider">
                    OUTFIT-{o.id}
                  </p>
                  <h3 className="text-sm font-black text-text uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                    {o.customer_name || "Guest Patron"}
                  </h3>
                </div>
                {/* Status Pill on mobile */}
                <div className="md:hidden">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[8px] font-black uppercase rounded-[2px] border tracking-wider",
                      o.is_void ? "bg-danger text-white border-danger" : "bg-success/10 text-success border-success/20"
                    )}
                  >
                    {o.is_void ? "VOIDED" : "VERIFIED"}
                  </span>
                </div>
              </div>

              {/* Middle Metrics: Cashier, Timestamp, Total */}
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto md:flex md:items-center md:gap-8 border-y md:border-y-0 border-border/20 py-2.5 md:py-0">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Operator</p>
                  <p className="text-[10px] font-mono font-bold text-text truncate">@{o.cashier_name || "System"}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Time</p>
                  <p className="text-[10px] font-mono font-bold text-text-muted truncate">
                    {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="space-y-0.5 text-right md:text-left">
                  <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider">Total</p>
                  <p className="text-sm sm:text-base font-black text-text font-mono leading-none">
                    ${Number(o.total || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Actions & Status on Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-[2px] text-[9px] font-black uppercase border tracking-wider",
                    o.is_void ? "bg-danger text-white border-danger" : "bg-success/10 text-success border-success/20"
                  )}
                >
                  {o.is_void ? "VOIDED" : "VERIFIED"}
                </span>
                <FontAwesomeIcon icon={faEye} className="text-xs text-[#1E2631] group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onVoidSuccess={load}
      />
    </div>
  );
}
