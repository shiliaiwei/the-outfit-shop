"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBox,
  faUsers,
  faArrowTrendUp,
  faGear,
  faRightFromBracket,
  faChevronLeft,
  faChevronRight,
  faCartShopping,
  faTruck,
  faClockRotateLeft,
  faStore,
  faFolderTree,
  faAward,
  faSliders,
  faMicrochip,
  faWaveSquare,
  faShieldHalved,
  faTag,
  faTableColumns,
  faFileLines,
  faBuilding,
  faImage,
  faTicket,
  faBolt,
  faBoxesStacked,
  faKey,
  faChartLine,
  faBagShopping,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: faGaugeHigh, roles: ["ADMIN", "MANAGER"] },
  {
    group: "Customer CRM",
    items: [
      { name: "Customers", href: "/admin/customers", icon: faUsers, roles: ["ADMIN", "MANAGER", "CASHIER"] },
      { name: "Order Hub", href: "/admin/orders", icon: faBagShopping, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Inventory",
    items: [
      { name: "Products", href: "/admin/inventory", icon: faBox, roles: ["ADMIN", "MANAGER", "STAFF"] },
      { name: "Purchases", href: "/admin/inventory/purchases", icon: faFileLines, roles: ["ADMIN", "MANAGER"] },
      { name: "Stock Ledger", href: "/admin/inventory/movements", icon: faClockRotateLeft, roles: ["ADMIN", "MANAGER"] },
      { name: "Transfers", href: "/admin/inventory/transfers", icon: faTruck, roles: ["ADMIN", "MANAGER"] },
      { name: "FIFO Batches", href: "/admin/inventory/batches", icon: faBoxesStacked, roles: ["ADMIN", "MANAGER"] },
      { name: "Suppliers", href: "/admin/inventory/suppliers", icon: faStore, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Catalog",
    items: [
      { name: "Categories", href: "/admin/catalog/categories", icon: faFolderTree, roles: ["ADMIN", "MANAGER"] },
      { name: "Brands", href: "/admin/catalog/brands", icon: faAward, roles: ["ADMIN", "MANAGER"] },
      { name: "Promotions", href: "/admin/catalog/promotions", icon: faTag, roles: ["ADMIN", "MANAGER"] },
      { name: "Attributes", href: "/admin/catalog/attributes", icon: faSliders, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Intelligence",
    items: [
      { name: "AI Insights", href: "/admin/intelligence", icon: faMicrochip, roles: ["ADMIN", "MANAGER"] },
      { name: "MIS Reports", href: "/admin/reports", icon: faArrowTrendUp, roles: ["ADMIN", "MANAGER"] },
      { name: "AI Forecast", href: "/admin/reports/ai-forecast", icon: faChartLine, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  {
    group: "Operations",
    items: [
      { name: "POS Terminal", href: "/pos", icon: faCartShopping, roles: ["ADMIN", "MANAGER", "CASHIER"] },
      { name: "Shipping", href: "/admin/operations/shipping", icon: faTruck, roles: ["ADMIN", "MANAGER"] },
      { name: "Branches", href: "/admin/operations/branches", icon: faBuilding, roles: ["ADMIN", "MANAGER"] },
      { name: "Media Assets", href: "/admin/operations/images", icon: faImage, roles: ["ADMIN", "MANAGER"] },
      { name: "Gift Cards", href: "/admin/operations/gift-cards", icon: faTicket, roles: ["ADMIN", "MANAGER"] },
      { name: "Banner CMS", href: "/admin/operations/banners", icon: faTableColumns, roles: ["ADMIN", "MANAGER"] },
    ]
  },
  { name: "Employees", href: "/admin/employees", icon: faUsers, roles: ["ADMIN"] },
  {
    group: "System",
    items: [
      { name: "Infrastructure", href: "/admin/system/monitor", icon: faWaveSquare, roles: ["ADMIN"] },
      { name: "User Accounts", href: "/admin/system/accounts", icon: faKey, roles: ["ADMIN"] },
      { name: "Security & Logs", href: "/admin/system/security", icon: faClockRotateLeft, roles: ["ADMIN"] },
      { name: "Shift Audit", href: "/admin/system/shifts", icon: faClock, roles: ["ADMIN", "MANAGER"] },
      { name: "Developer Webhooks", href: "/admin/system/webhooks", icon: faBolt, roles: ["ADMIN"] },
      { name: "Compliance", href: "/admin/system/gdpr", icon: faShieldHalved, roles: ["ADMIN", "MANAGER"] },
      { name: "Settings", href: "/admin/settings", icon: faGear, roles: ["ADMIN", "MANAGER"] },
    ]
  },
];

import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const renderLink = (item: any) => {
    const iconDef = item.icon;
    const active = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => {
          if (onClose) onClose();
        }}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-white shadow-sm"
            : "text-text-muted hover:bg-bg hover:text-text"
        )}
      >
        <FontAwesomeIcon icon={iconDef} className={cn("h-4 w-4 shrink-0", collapsed ? "mr-0" : "mr-3", active ? "text-white" : "text-[#1E2631]")} />
        {(!collapsed || mobileOpen) && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border bg-surface shadow-2xl transition-all duration-300 lg:static lg:z-auto lg:shadow-none",
          mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {(!collapsed || mobileOpen) && (
            <div className="brand-wordmark-twotone text-xl">
              <span className="font-[900] text-[#1E2631]">OUT</span>
              <span className="font-[700] text-[#C84428]">FIT</span>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex rounded-md p-1 hover:bg-bg text-text-muted cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-[#1E2631] text-sm" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-2 hover:bg-bg text-text cursor-pointer"
            title="Close Menu"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[#1E2631] text-base" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-4 p-3 overflow-y-auto overflow-x-hidden">
          {navItems.map((item: any) => {
            if (item.group) {
              const visibleItems = item.items.filter((sub: any) =>
                !sub.roles || (user && sub.roles.includes(user.role))
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={item.group} className="space-y-1">
                  {(!collapsed || mobileOpen) && (
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

        {/* Footer Logout */}
        <div className="border-t border-border p-2">
          <button
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className={cn(
              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
            )}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className={cn("h-4 w-4 text-[#1E2631] shrink-0", collapsed && !mobileOpen ? "mr-0" : "mr-3")} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
