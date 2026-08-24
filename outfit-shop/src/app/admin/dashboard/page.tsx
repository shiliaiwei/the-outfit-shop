"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faDollarSign,
  faBagShopping,
  faBox,
  faUsers,
  faBolt,
  faTriangleExclamation,
  faCircleCheck,
  faArrowTrendUp,
  faArrowTrendDown,
  faCartShopping,
  faPlus,
  faBoxesStacked,
  faClock,
  faShieldHalved,
  faWaveSquare,
  faStore,
  faKey,
  faFileLines,
  faBarcode,
  faMoneyBillWave,
  faTruck
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { reportService } from "@/services/reportService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { XDisplaySettingsCard } from "@/components/admin/XDisplaySettingsCard";
import { Role } from "@/types/rbac.types";

interface RegisterStatus {
  id: string;
  name: string;
  operator: string;
  shiftSales: number;
  transactionCount: number;
  status: "online" | "idle";
  lastActivity: string;
  drawerBalance: number;
}

const REGISTERS: RegisterStatus[] = [
  { id: "REG-01", name: "Register #01 (Flagship Main)", operator: "Channara Lim", shiftSales: 2450.00, transactionCount: 28, status: "online", lastActivity: "Just now", drawerBalance: 1450.00 },
  { id: "REG-02", name: "Register #02 (Express POS)", operator: "Sothea Kem", shiftSales: 2890.50, transactionCount: 34, status: "online", lastActivity: "2 mins ago", drawerBalance: 1730.00 },
  { id: "REG-03", name: "Register #03 (VIP Fitting)", operator: "Vannak Ouk", shiftSales: 1120.00, transactionCount: 12, status: "idle", lastActivity: "18 mins ago", drawerBalance: 820.00 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Active Role Simulation state (defaults to authenticated role, user can switch to test any role)
  const initialRole = (user?.role as Role) || Role.ADMIN;
  const [activeRoleView, setActiveRoleView] = useState<Role>(initialRole);

  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [allocated, setAllocated] = useState(false);
  const [revenueTotal, setRevenueTotal] = useState(168450);
  const [orderTotal, setOrderTotal] = useState(638);
  const [drawerTotal, setDrawerTotal] = useState(4000);
  const [shiftOpen, setShiftOpen] = useState(true);

  const [alerts, setAlerts] = useState<any[]>([
    { id: 1, type: "danger", title: "Stock Threshold Alert", desc: "Tailored Linen Overshirt (4 units remaining in Flagship Hub)" },
    { id: 2, type: "success", title: "Data Mesh Synchronized", desc: "PostgreSQL read-replica latency verified at 12ms" },
    { id: 3, type: "warning", title: "Margin Deviation", desc: "Category Overshirts margin > 2% variance detected" },
  ]);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const salesRes = await reportService.getSalesPerformance({ timeframe: "30d" });
      if (salesRes?.data?.chart) {
        const sumRev = salesRes.data.chart.reduce((acc: number, curr: any) => acc + Number(curr.revenue || 0), 0);
        const sumOrders = salesRes.data.chart.reduce((acc: number, curr: any) => acc + Number(curr.orders || 0), 0);
        if (sumRev > 0) setRevenueTotal(sumRev);
        if (sumOrders > 0) setOrderTotal(sumOrders);
      }
      toast.success("Intelligence Metrics Synchronized");
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      setActiveRoleView(user.role as Role);
    }
    loadMasterData();
  }, [user?.role]);

  const handleAllocateAssets = () => {
    if (allocated) {
      toast.info("Buffer allocation is already active for this cycle.");
      return;
    }
    setAllocating(true);
    setTimeout(() => {
      setAllocating(false);
      setAllocated(true);
      toast.success("Auto-allocation complete: +35 units routed to Flagship Hub.");
    }, 900);
  };

  const handleDismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Audit alert marked as resolved");
  };

  const handleToggleShift = () => {
    if (shiftOpen) {
      setShiftOpen(false);
      toast.success("Shift closed. Z-Report generated successfully.");
    } else {
      setShiftOpen(true);
      toast.success("Shift opened. Cash drawer initialized ($500.00 float).");
    }
  };

  const handleDropCash = () => {
    toast.success("Cash drop executed: $500.00 transferred to secure safe.");
    setDrawerTotal((prev) => Math.max(500, prev - 500));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">

      {/* 1. X.COM ROLE SELECTOR & GREETING BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-[var(--surface-sub)] border border-border flex items-center justify-center font-bold text-text text-base shrink-0 shadow-sm">
            {(user?.username || activeRoleView || "A").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-text tracking-tight">
                {activeRoleView === Role.ADMIN
                  ? "Command Hub"
                  : activeRoleView === Role.MANAGER
                  ? "Operations Console"
                  : activeRoleView === Role.CASHIER
                  ? "POS Terminal Desk"
                  : "Stock & Floor Desk"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 text-[10px] font-bold uppercase tracking-wider">
                {activeRoleView}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5 font-mono">
              Operator <span className="text-text font-bold">@{user?.username || "admin"}</span> &bull; {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher Pill Bar (Test All 4 Roles) */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="p-1 rounded-full bg-[var(--surface-sub)] border border-border flex items-center gap-1">
            {[Role.ADMIN, Role.MANAGER, Role.CASHIER, Role.STAFF].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setActiveRoleView(r);
                  toast.info(`Switched Dashboard View to ${r}`);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                  activeRoleView === r
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={loadMasterData}
            className="h-9 w-9 rounded-full flex items-center justify-center border border-border bg-[var(--surface-sub)] hover:bg-black/5 dark:hover:bg-white/10 text-text transition-all cursor-pointer shrink-0 shadow-xs"
            title="Refresh Real-time Data"
          >
            <FontAwesomeIcon icon={faRotate} className={cn("h-3.5 w-3.5 text-text transition-transform", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* 2. ROLE-ADAPTIVE 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {activeRoleView === Role.ADMIN && (
          <>
            <Link href="/admin/reports/sales" className="block group">
              <MetricCard title="Gross Consolidated" value={`$${revenueTotal.toLocaleString()}`} change="+12.5%" trend="up" icon={faDollarSign} loading={loading} />
            </Link>
            <Link href="/admin/orders" className="block group">
              <MetricCard title="Total Volume" value={orderTotal.toLocaleString()} change="+8.2%" trend="up" icon={faBagShopping} loading={loading} />
            </Link>
            <Link href="/admin/inventory" className="block group">
              <MetricCard title="Inventory Velocity" value="2.4x" change="-0.1%" trend="down" icon={faBox} loading={loading} />
            </Link>
            <Link href="/admin/employees" className="block group">
              <MetricCard title="Active Staff" value="18 Operators" change="+3" trend="up" icon={faUsers} loading={loading} />
            </Link>
          </>
        )}

        {activeRoleView === Role.MANAGER && (
          <>
            <Link href="/admin/reports/sales" className="block group">
              <MetricCard title="Store GMV" value={`$${(revenueTotal * 0.65).toFixed(0)}`} change="+14.2%" trend="up" icon={faDollarSign} loading={loading} />
            </Link>
            <Link href="/admin/catalog/categories" className="block group">
              <MetricCard title="Category Margin" value="68.4%" change="+1.8%" trend="up" icon={faArrowTrendUp} loading={loading} />
            </Link>
            <Link href="/admin/inventory/transfers" className="block group">
              <MetricCard title="Active Transfers" value="5 En-Route" change="3 Pending" trend="up" icon={faTruck} loading={loading} />
            </Link>
            <Link href="/admin/inventory/suppliers" className="block group">
              <MetricCard title="Supplier Lead" value="3.2 Days" change="-0.5d" trend="up" icon={faStore} loading={loading} />
            </Link>
          </>
        )}

        {activeRoleView === Role.CASHIER && (
          <>
            <div className="block">
              <MetricCard title="Shift Sales (REG-02)" value={`$${(2890.5).toFixed(2)}`} change="+34 Txns" trend="up" icon={faDollarSign} loading={loading} />
            </div>
            <div className="block">
              <MetricCard title="Cash Drawer" value={`$${drawerTotal.toFixed(2)}`} change="Reconciled" trend="up" icon={faMoneyBillWave} loading={loading} />
            </div>
            <div className="block">
              <MetricCard title="Shift Status" value={shiftOpen ? "OPEN & ACTIVE" : "CLOSED"} change={shiftOpen ? "09:00 AM" : "Z-Report Done"} trend={shiftOpen ? "up" : "down"} icon={faClock} loading={loading} />
            </div>
            <Link href="/admin/customers" className="block group">
              <MetricCard title="Loyalty Issued" value="480 Pts" change="8 Patrons" trend="up" icon={faUsers} loading={loading} />
            </Link>
          </>
        )}

        {activeRoleView === Role.STAFF && (
          <>
            <Link href="/admin/inventory" className="block group">
              <MetricCard title="Total Catalog Units" value="1,843 Items" change="24 Brands" trend="up" icon={faBox} loading={loading} />
            </Link>
            <Link href="/admin/inventory/movements" className="block group">
              <MetricCard title="Inbound Intakes" value="14 Shipments" change="Today" trend="up" icon={faTruck} loading={loading} />
            </Link>
            <div className="block">
              <MetricCard title="Low Stock Alerts" value="4 SKUs" change="Needs Reorder" trend="down" icon={faTriangleExclamation} loading={loading} />
            </div>
            <Link href="/admin/catalog/attributes" className="block group">
              <MetricCard title="Active Colorways" value="28 Hues" change="6 Sizes" trend="up" icon={faBox} loading={loading} />
            </Link>
          </>
        )}
      </div>

      {/* 3. MAIN DASHBOARD ROLE-SPECIFIC WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">

          {/* A. Dynamic Multi-Register Feed for Admin/Manager */}
          {(activeRoleView === Role.ADMIN || activeRoleView === Role.MANAGER) && (
            <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faWaveSquare} className="text-[var(--primary)] h-4 w-4" />
                  <h3 className="font-bold text-sm sm:text-base text-text">
                    Active POS Registers &amp; Shift Telemetry
                  </h3>
                </div>
                <span className="text-xs font-mono text-text-muted font-bold">3 Registers Online</span>
              </div>

              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                <table className="w-full text-left text-xs min-w-[520px]">
                  <thead>
                    <tr className="border-b border-border text-text-muted font-bold text-[11px]">
                      <th className="pb-3">Terminal ID</th>
                      <th className="pb-3">Operator</th>
                      <th className="pb-3">Shift Volume</th>
                      <th className="pb-3">Drawer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Heartbeat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {REGISTERS.map((reg) => (
                      <tr key={reg.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3.5 font-bold text-text flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[var(--surface-sub)] border border-border flex items-center justify-center font-bold text-[11px] text-text">
                            {reg.id.split("-")[1]}
                          </div>
                          <span>{reg.name}</span>
                        </td>
                        <td className="py-3.5 text-text-muted">{reg.operator}</td>
                        <td className="py-3.5 font-mono font-bold text-text">${reg.shiftSales.toFixed(2)}</td>
                        <td className="py-3.5 font-mono text-text-muted">${reg.drawerBalance.toFixed(2)}</td>
                        <td className="py-3.5">
                          <span className={cn(
                            "px-2.5 py-0.5 text-[10px] font-bold rounded-full border font-mono",
                            reg.status === "online" 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-warning/10 text-warning border-warning/20"
                          )}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono text-text-muted text-[11px]">{reg.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* B. Cashier Dedicated Action Station */}
          {activeRoleView === Role.CASHIER && (
            <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCartShopping} className="text-[var(--primary)] h-4 w-4" />
                  <h3 className="font-bold text-sm sm:text-base text-text">
                    Cashier POS Terminal Quick Station
                  </h3>
                </div>
                <button
                  onClick={handleToggleShift}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-sub)] hover:bg-black/5 dark:hover:bg-white/10 text-text border border-border transition-colors cursor-pointer"
                >
                  {shiftOpen ? "Close Shift (Z-Report)" : "Open Shift"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Link
                  href="/pos"
                  className="p-5 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-between shadow-lg hover:opacity-95 transition-all group"
                >
                  <div>
                    <h4 className="font-black text-base">Launch POS Register</h4>
                    <p className="text-xs text-white/80 mt-0.5">Start scanning items &amp; tender KHQR</p>
                  </div>
                  <FontAwesomeIcon icon={faBarcode} className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                </Link>

                <div className="p-5 rounded-2xl bg-[var(--surface-sub)] border border-border flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted">Drawer Balance</span>
                    <button
                      onClick={handleDropCash}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 cursor-pointer"
                    >
                      Safe Drop Cash ($500)
                    </button>
                  </div>
                  <div className="mt-2 font-mono font-black text-2xl text-text">${drawerTotal.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* C. Staff Inventory Floor Station */}
          {activeRoleView === Role.STAFF && (
            <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} className="text-[var(--primary)] h-4 w-4" />
                  <h3 className="font-bold text-sm sm:text-base text-text">
                    Floor Inventory &amp; Stock Verification
                  </h3>
                </div>
                <span className="text-xs font-mono text-success font-bold">RFID Mesh Connected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link href="/admin/inventory" className="p-4 rounded-2xl bg-[var(--surface-sub)] border border-border hover:border-[var(--primary)] transition-all">
                  <FontAwesomeIcon icon={faBox} className="h-5 w-5 text-[var(--primary)] mb-2" />
                  <h4 className="font-bold text-xs text-text">Product Catalog</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Browse 1,843 products</p>
                </Link>

                <Link href="/admin/inventory/movements" className="p-4 rounded-2xl bg-[var(--surface-sub)] border border-border hover:border-[var(--primary)] transition-all">
                  <FontAwesomeIcon icon={faTruck} className="h-5 w-5 text-[var(--primary)] mb-2" />
                  <h4 className="font-bold text-xs text-text">Stock Ledger</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">View real-time intakes</p>
                </Link>

                <Link href="/pos" className="p-4 rounded-2xl bg-[var(--surface-sub)] border border-border hover:border-[var(--primary)] transition-all">
                  <FontAwesomeIcon icon={faBarcode} className="h-5 w-5 text-[var(--primary)] mb-2" />
                  <h4 className="font-bold text-xs text-text">Barcode Lookup</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Instant price check</p>
                </Link>
              </div>
            </div>
          )}

          {/* Quick Operations Launchpad (Universal) */}
          <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-text">
              Quick Launchpad
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickActionButton href="/pos" label="Launch POS" icon={faCartShopping} />
              <QuickActionButton href="/admin/inventory" label="Add Product" icon={faPlus} />
              <QuickActionButton href="/admin/inventory/transfers" label="Transfer Stock" icon={faBoxesStacked} />
              <QuickActionButton href="/admin/system/shifts" label="Shift Audit" icon={faClock} />
            </div>
          </div>

          {/* Interactive X Display Settings Card */}
          <XDisplaySettingsCard />

        </div>

        {/* Right 1 Column */}
        <div className="space-y-6 sm:space-y-8">

          {/* Predictive Intelligence Portal */}
          <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-[var(--primary)] h-4 w-4" />
              <h3 className="text-sm sm:text-base font-bold text-text">Predictive Intelligence</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
              Neural demand patterns predict a <span className="text-text font-bold underline underline-offset-4 decoration-[var(--primary)]">22% surge</span> in <strong className="text-text">Overshirts</strong> across Flagship Hub.
            </p>
            <div className="pt-1">
              <button
                onClick={handleAllocateAssets}
                disabled={allocating}
                className="w-full btn-liquid py-3 text-xs font-black uppercase tracking-wider bg-[var(--primary)] text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {allocating ? (
                  <>
                    <FontAwesomeIcon icon={faRotate} className="animate-spin text-white text-xs" /> Allocating Buffer...
                  </>
                ) : allocated ? (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="text-white text-xs" /> Buffer Allocated
                  </>
                ) : (
                  "Authorize Auto-Allocation"
                )}
              </button>
            </div>
          </div>

          {/* Live Audit Alerts Feed */}
          <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning h-4 w-4" />
                <h3 className="font-bold text-sm text-text">Audit Alerts</h3>
              </div>
              <span className="text-xs font-mono text-[var(--primary)] font-bold">{alerts.length} Active</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-6">All systems nominal &bull; 0 alerts</p>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => handleDismissAlert(a.id)}
                    className="group flex gap-3 items-center p-3 rounded-2xl border border-border bg-[var(--surface-sub)]/50 hover:bg-[var(--surface-sub)] cursor-pointer transition-all"
                    title="Click to resolve alert"
                  >
                    <div className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      a.type === "danger" ? "bg-danger" : a.type === "warning" ? "bg-warning" : "bg-success"
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-text truncate">{a.title}</p>
                      <p className="text-[11px] text-text-muted truncate">{a.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-text-muted group-hover:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      Resolve
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security & Database Sync Capsule */}
          <div className="liquid-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <FontAwesomeIcon icon={faShieldHalved} className="text-success h-4 w-4" />
              <span>Security &amp; Edge Mesh</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              PostgreSQL 16 master node with zero-latency read replication across POS terminals.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-text-muted border-t border-border/50">
              <span>Database Sync</span>
              <span className="text-success font-bold">12ms &bull; Optimal</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon, loading }: any) {
  return (
    <div className="liquid-glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-border shadow-xl group hover:border-[var(--primary)] transition-all duration-200 relative cursor-pointer flex flex-col justify-between min-h-[110px] sm:min-h-[130px]">
      <div className="flex items-center justify-between mb-2">
        <div className="h-9 w-9 rounded-full bg-[var(--surface-sub)] flex items-center justify-center text-text group-hover:scale-105 transition-transform">
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
            trend === "up" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
          )}>
            <span>{change}</span>
            <FontAwesomeIcon icon={trend === "up" ? faArrowTrendUp : faArrowTrendDown} className="h-2.5 w-2.5 text-current" />
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-text-muted truncate">{title}</p>
        <div className="pt-0.5">
          {loading ? (
            <div className="h-7 w-24 bg-[var(--surface-sub)] animate-pulse rounded-full" />
          ) : (
            <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight font-mono">{value}</h3>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ href, label, icon }: { href: string; label: string; icon: any }) {
  return (
    <Link
      href={href}
      className="p-3.5 bg-[var(--surface-sub)]/60 hover:bg-[var(--surface-sub)] border border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all group shadow-sm hover:border-[var(--primary)]"
    >
      <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
        <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-text group-hover:text-[var(--primary)] transition-colors" />
      </div>
      <span className="text-xs font-bold text-text truncate w-full">{label}</span>
    </Link>
  );
}
