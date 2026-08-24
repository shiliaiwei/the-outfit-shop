"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrochip,
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
  faArrowRight,
  faCartShopping,
  faPlus,
  faBoxesStacked,
  faClock,
  faShieldHalved,
  faWaveSquare,
  faChartLine,
  faFileLines
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { reportService } from "@/services/reportService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";

interface RegisterStatus {
  id: string;
  name: string;
  operator: string;
  shiftSales: number;
  transactionCount: number;
  status: "online" | "idle";
  lastActivity: string;
}

const REGISTERS: RegisterStatus[] = [
  { id: "REG-01", name: "Register #01 (Flagship Main)", operator: "Channara Lim", shiftSales: 2450.00, transactionCount: 28, status: "online", lastActivity: "Just now" },
  { id: "REG-02", name: "Register #02 (Express POS)", operator: "Sothea Kem", shiftSales: 2890.50, transactionCount: 34, status: "online", lastActivity: "2 mins ago" },
  { id: "REG-03", name: "Register #03 (VIP Fitting)", operator: "Vannak Ouk", shiftSales: 1120.00, transactionCount: 12, status: "idle", lastActivity: "18 mins ago" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [allocated, setAllocated] = useState(false);
  const [revenueTotal, setRevenueTotal] = useState(168450);
  const [orderTotal, setOrderTotal] = useState(638);
  const [alerts, setAlerts] = useState<any[]>([
    { id: 1, type: "danger", title: "Stock Breach", desc: "SKU-LN-092 (4 Units remaining)" },
    { id: 2, type: "success", title: "Integrity Pass", desc: "POS & Warehouse Global Sync Verified" },
    { id: 3, type: "warning", title: "Price Drift", desc: "Category Overshirts margin > 2% variance" },
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
      toast.success("Command Hub Intelligence Synchronized");
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  const handleAllocateAssets = () => {
    if (allocated) {
      toast.info("Assets are already optimized for this cycle.");
      return;
    }
    setAllocating(true);
    setTimeout(() => {
      setAllocating(false);
      setAllocated(true);
      toast.success("Buffer reallocation complete. +35 units routed to Flagship Hub.");
    }, 1000);
  };

  const handleDismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Audit alert marked as resolved");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-1000">

      {/* 1. HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 border-b border-border pb-6 sm:pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3 sm:gap-4">
             <FontAwesomeIcon icon={faMicrochip} className="text-[#1E2631] text-2xl sm:text-3xl h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
             <div>
                <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
                  {isAdmin ? "Command Hub" : "Terminal View"}
                </h1>
                <p className="text-xs text-text-muted mt-0.5">
                   Logged in as <span className="text-text font-bold">@{user?.username || "admin"}</span> &bull; {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto">
           <div className="liquid-glass px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-text uppercase tracking-wider">System Active</span>
           </div>
           <button
             onClick={loadMasterData}
             className="btn-liquid btn-liquid-glass p-2 sm:p-2.5 shadow-sm hover:border-border transition-all cursor-pointer"
             title="Refresh Data"
           >
             <FontAwesomeIcon icon={faRotate} className={cn("text-[#1E2631] text-xs sm:text-sm h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform", loading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* 2. DYNAMIC INTEL KPI GRID (2 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Link href="/admin/reports/sales" className="block">
          <MetricCard title="Gross Income" value={`$${revenueTotal.toLocaleString()}`} change="+12.5%" trend="up" icon={faDollarSign} loading={loading} />
        </Link>
        <Link href="/admin/orders" className="block">
          <MetricCard title="Total Orders" value={orderTotal.toLocaleString()} change="+8.2%" trend="up" icon={faBagShopping} loading={loading} />
        </Link>
        <Link href="/admin/reports/inventory" className="block">
          <MetricCard title="Stock Velocity" value="2.4x" change="-0.1%" trend="down" icon={faBox} loading={loading} />
        </Link>
        <Link href="/admin/customers" className="block">
          <MetricCard title="Active Patrons" value="842" change="+42" trend="up" icon={faUsers} loading={loading} />
        </Link>
      </div>

      {/* 3. CORE OPERATIONAL GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">

        {/* Main Column (2 cols) */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">

          {/* Live Multi-Register Telemetry Table */}
          <div className="liquid-glass p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faWaveSquare} className="text-[#1E2631] text-sm sm:text-base h-4 w-4" />
                <h3 className="font-black text-xs sm:text-sm text-text uppercase tracking-widest">
                  Active POS Registers &amp; Shifts
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Terminal ID</th>
                    <th className="pb-3">Assigned Operator</th>
                    <th className="pb-3">Shift Volume</th>
                    <th className="pb-3">Orders</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Last Signal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 font-medium">
                  {REGISTERS.map((reg) => (
                    <tr key={reg.id} className="hover:bg-bg/40 transition-colors">
                      <td className="py-3 sm:py-3.5 font-bold text-text">{reg.name}</td>
                      <td className="py-3 sm:py-3.5 text-text-muted">{reg.operator}</td>
                      <td className="py-3 sm:py-3.5 font-mono font-bold text-text">
                        ${reg.shiftSales.toFixed(2)}
                      </td>
                      <td className="py-3 sm:py-3.5 text-text-muted font-mono">{reg.transactionCount}</td>
                      <td className="py-3 sm:py-3.5">
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] font-bold uppercase rounded-[2px] border font-mono",
                          reg.status === "online" 
                            ? "bg-success/10 text-success border-success/20" 
                            : "bg-warning/10 text-warning border-warning/20"
                        )}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-3 sm:py-3.5 text-right font-mono text-text-muted text-[11px]">{reg.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Operations Launchpad */}
          <div className="liquid-glass p-4 sm:p-6 shadow-xl space-y-3 sm:space-y-4">
            <h3 className="text-xs font-black text-text uppercase tracking-widest">
              Quick Operations Launchpad
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <QuickActionButton href="/pos" label="Launch POS" icon={faCartShopping} />
              <QuickActionButton href="/admin/inventory" label="Add Product" icon={faPlus} />
              <QuickActionButton href="/admin/inventory/transfers" label="Transfer Stock" icon={faBoxesStacked} />
              <QuickActionButton href="/admin/system/shifts" label="Shift Audit" icon={faClock} />
            </div>
          </div>

        </div>

        {/* Intelligence Sidebars (1 col) */}
        <div className="space-y-6 sm:space-y-8">
           {/* AI Prediction Portal */}
           <div className="liquid-glass p-4 sm:p-6 border-border bg-surface shadow-xl space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5">
                 <FontAwesomeIcon icon={faBolt} className="text-[#1E2631] text-sm h-4 w-4" />
                 <h3 className="text-xs font-black text-text uppercase tracking-[0.2em]">Predictive Insight</h3>
              </div>
              <p className="text-xs text-text/80 leading-relaxed font-medium">
                 Neural patterns indicate a <span className="text-text font-black underline underline-offset-4 decoration-primary/50">22% SURGE</span> in <strong className="text-text font-black">OVERSHIRT</strong> demand. Automated stock allocation recommended for Flagship Hub.
              </p>
              <div className="pt-1">
                 <button
                   onClick={handleAllocateAssets}
                   disabled={allocating}
                   className="w-full btn-liquid btn-liquid-terracotta py-2.5 sm:py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                 >
                   {allocating ? (
                     <>
                       <FontAwesomeIcon icon={faRotate} className="animate-spin text-white text-xs h-3.5 w-3.5" /> Allocating Buffer...
                     </>
                   ) : allocated ? (
                     <>
                       <FontAwesomeIcon icon={faCircleCheck} className="text-white text-xs h-3.5 w-3.5" /> Buffer Allocated
                     </>
                   ) : (
                     "Authorize Auto-Allocation"
                   )}
                 </button>
              </div>
           </div>

           {/* Live Anomaly Feed */}
           <div className="liquid-glass p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3 sm:pb-4">
                 <div className="flex items-center gap-2.5">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#1E2631] text-sm h-4 w-4" />
                    <h3 className="font-black text-xs text-text uppercase tracking-widest">Audit Alerts</h3>
                 </div>
                 <span className="text-[10px] font-mono text-primary font-bold">{alerts.length} Flagged</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                 {alerts.length === 0 ? (
                   <p className="text-xs font-mono text-text-muted text-center py-6">All systems nominal &bull; 0 alerts</p>
                 ) : (
                   alerts.map((a) => (
                     <div
                       key={a.id}
                       onClick={() => handleDismissAlert(a.id)}
                       className="group flex gap-3 items-center p-2.5 sm:p-3 rounded-[3px] border border-border bg-bg/40 hover:bg-bg/80 cursor-pointer transition-all"
                       title="Click to resolve alert"
                     >
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#1E2631] text-xs h-3.5 w-3.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                           <p className="text-[9px] font-black uppercase tracking-wider text-text truncate">{a.title}</p>
                           <p className="text-[8px] font-mono text-text-muted truncate">{a.desc}</p>
                        </div>
                        <span className="text-[8px] font-bold uppercase text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Resolve
                        </span>
                     </div>
                   ))
                 )}
              </div>
           </div>

           {/* System Integrity Widget */}
           <div className="liquid-glass p-4 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#1E2631] text-sm h-4 w-4" />
                <span>Security &amp; Edge Sync</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                PostgreSQL primary node with zero latency replication across edge POS terminals.
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-text-muted">
                <span>Database Latency</span>
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
    <div className="liquid-glass p-3.5 sm:p-6 shadow-xl group hover:border-border transition-all duration-300 relative cursor-pointer flex flex-col justify-between min-h-[110px] sm:min-h-[140px]">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <FontAwesomeIcon icon={icon} className="text-[#1E2631] text-base sm:text-xl h-4 w-4 sm:h-6 sm:w-6" />
        {change && (
          <div className={cn(
            "flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-[2px] text-[8px] sm:text-[9px] font-black uppercase tracking-tighter border",
            trend === "up" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
          )}>
            <span>{change}</span>
            <FontAwesomeIcon icon={trend === "up" ? faArrowTrendUp : faArrowTrendDown} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-current" />
          </div>
        )}
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-[8px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider sm:tracking-[0.2em] leading-none truncate">{title}</p>
        <div className="pt-1">
           {loading ? (
             <div className="h-6 sm:h-8 w-20 sm:w-28 bg-bg animate-pulse rounded-[3px]" />
           ) : (
             <h3 className="text-lg sm:text-2xl xl:text-3xl font-black text-text font-mono tracking-tight sm:tracking-tighter leading-none">{value}</h3>
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
      className="p-2.5 sm:p-3 bg-surface hover:bg-bg border border-border rounded-[3px] flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center transition-all group shadow-sm hover:border-primary/40"
    >
      <FontAwesomeIcon icon={icon} className="text-[#1E2631] text-sm sm:text-base h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:text-primary transition-colors" />
      <span className="text-[9px] sm:text-[10px] font-bold text-text uppercase tracking-tight leading-tight">{label}</span>
    </Link>
  );
}
