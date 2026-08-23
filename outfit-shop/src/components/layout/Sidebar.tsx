"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Package,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Truck,
  History,
  Store,
  FolderTree,
  Award,
  Sliders,
  BrainCircuit,
  Activity,
  ShieldCheck,
  Tag,
  Layout,
  FileText,
  Building2,
  Image as ImageIcon,
  Ticket,
  Zap,
  Box,
  Key,
  LineChart,
  ShoppingBag,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER"] },
  {
    group: "Customer CRM",
    items: [
      { name: "Customers", href: "/admin/customers", icon: Users, roles: ["ADMIN", "MANAGER", "CASHIER"] },
      { name: "Order Hub", href: "/admin/orders", icon: ShoppingBag, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Inventory",
    items: [
      { name: "Products", href: "/admin/inventory", icon: Package, roles: ["ADMIN", "MANAGER", "STAFF"] },
      { name: "Purchases", href: "/admin/inventory/purchases", icon: FileText, roles: ["ADMIN", "MANAGER"] },
      { name: "Stock Ledger", href: "/admin/inventory/movements", icon: History, roles: ["ADMIN", "MANAGER"] },
      { name: "Transfers", href: "/admin/inventory/transfers", icon: Truck, roles: ["ADMIN", "MANAGER"] },
      { name: "FIFO Batches", href: "/admin/inventory/batches", icon: Box, roles: ["ADMIN", "MANAGER"] },
      { name: "Suppliers", href: "/admin/inventory/suppliers", icon: Store, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Catalog",
    items: [
      { name: "Categories", href: "/admin/catalog/categories", icon: FolderTree, roles: ["ADMIN", "MANAGER"] },
      { name: "Brands", href: "/admin/catalog/brands", icon: Award, roles: ["ADMIN", "MANAGER"] },
      { name: "Promotions", href: "/admin/catalog/promotions", icon: Tag, roles: ["ADMIN", "MANAGER"] },
      { name: "Attributes", href: "/admin/catalog/attributes", icon: Sliders, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Intelligence",
    items: [
      { name: "AI Insights", href: "/admin/intelligence", icon: BrainCircuit, roles: ["ADMIN", "MANAGER"] },
      { name: "MIS Reports", href: "/admin/reports", icon: TrendingUp, roles: ["ADMIN", "MANAGER"] },
      { name: "AI Forecast", href: "/admin/reports/ai-forecast", icon: LineChart, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Operations",
    items: [
      { name: "POS Terminal", href: "/pos", icon: ShoppingCart, roles: ["ADMIN", "MANAGER", "CASHIER"] },
      { name: "Shipping", href: "/admin/operations/shipping", icon: Truck, roles: ["ADMIN", "MANAGER"] },
      { name: "Branches", href: "/admin/operations/branches", icon: Building2, roles: ["ADMIN", "MANAGER"] },
      { name: "Media Assets", href: "/admin/operations/images", icon: ImageIcon, roles: ["ADMIN", "MANAGER"] },
      { name: "Gift Cards", href: "/admin/operations/gift-cards", icon: Ticket, roles: ["ADMIN", "MANAGER"] },
      { name: "Banner CMS", href: "/admin/operations/banners", icon: Layout, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  { name: "Employees", href: "/admin/employees", icon: Users, roles: ["ADMIN"] },
  {
    group: "System",
    items: [
      { name: "Infrastructure", href: "/admin/system/monitor", icon: Activity, roles: ["ADMIN"] },
      { name: "User Accounts", href: "/admin/system/accounts", icon: Key, roles: ["ADMIN"] },
      { name: "Security & Logs", href: "/admin/system/security", icon: History, roles: ["ADMIN"] },
      { name: "Shift Audit", href: "/admin/system/shifts", icon: Clock, roles: ["ADMIN", "MANAGER"] },
      { name: "Developer Webhooks", href: "/admin/system/webhooks", icon: Zap, roles: ["ADMIN"] },
      { name: "Compliance", href: "/admin/system/gdpr", icon: ShieldCheck, roles: ["ADMIN", "MANAGER"] },
      { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["ADMIN", "MANAGER"] },
    ]
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const renderLink = (item: any) => {
    const Icon = item.icon;
    const active = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-white shadow-sm"
            : "text-text-muted hover:bg-bg hover:text-text"
        )}
      >
        <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
        {!collapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-surface transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="brand-wordmark-twotone text-xl">
            <span className="font-[900] text-[#1E2631]">OUT</span>
            <span className="font-[700] text-[#C84428]">FIT</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-bg text-text-muted"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-4 p-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item: any, idx) => {
          if (item.group) {
            const visibleItems = item.items.filter((sub: any) =>
              !sub.roles || (user && sub.roles.includes(user.role))
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={item.group} className="space-y-1">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-2">
                    {item.group}
                  </p>
                )}
                {visibleItems.map(renderLink)}
              </div>
            );
          }

          if (item.roles && user && !item.roles.includes(user.role)) return null;
          return renderLink(item);
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
