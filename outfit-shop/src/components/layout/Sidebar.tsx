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
  faClock,
  faXmark,
  faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: faGaugeHigh, roles: ["ADMIN", "MANAGER"] },
  {
    group: "Customer CRM",
    items: [
      { name: "Customers", href: "/admin/customers", icon: faUsers, roles: ["ADMIN", "MANAGER", "CASHIER"] },
      { name: "Order Hub", href: "/admin/orders", icon: faBagShopping, roles: ["ADMIN", "MANAGER"], badge: "1" },
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
          "group flex items-center rounded-full px-4 py-2.5 text-[15px] font-bold transition-all relative",
          active
            ? "font-extrabold text-text"
            : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/10"
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <FontAwesomeIcon
            icon={iconDef}
            className={cn(
              "h-5 w-5 transition-transform group-hover:scale-110",
              collapsed ? "mr-0" : "mr-4",
              active ? "text-[var(--primary)]" : "text-inherit"
            )}
          />
          {item.badge && (
            <span className="absolute -top-1.5 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[9px] font-black text-white shadow-sm">
              {item.badge}
            </span>
          )}
        </div>
        {(!collapsed || mobileOpen) && (
          <span className={cn(active && "tracking-tight")}>{item.name}</span>
        )}
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
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-border bg-surface transition-all duration-300 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20 px-2" : "lg:w-68 px-3 sm:px-4"
        )}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-2 pt-2">
          {(!collapsed || mobileOpen) ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <img
                src="/OutFIT/OutFIT.svg"
                alt="OUTFIT"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="brand-wordmark-twotone text-xl tracking-tight">
                <span className="font-[900] text-text">OUT</span>
                <span className="font-[700] text-[#C84428]">FIT</span>
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="mx-auto flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
              <img
                src="/OutFIT/OutFIT.svg"
                alt="OUTFIT"
                className="h-8 w-auto object-contain shrink-0"
              />
            </Link>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-muted transition-colors cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-xs text-text" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text cursor-pointer"
            title="Close Menu"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base text-text" />
          </button>
        </div>

        {/* Navigation Items Feed */}
        <nav className="flex-1 space-y-3 py-3 overflow-y-auto overflow-x-hidden">
          {navItems.map((item: any) => {
            if (item.group) {
              const visibleItems = item.items.filter((sub: any) =>
                !sub.roles || (user && sub.roles.includes(user.role))
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={item.group} className="space-y-0.5">
                  {(!collapsed || mobileOpen) && (
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-text-muted/60 pt-2 pb-1">
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

        {/* X.com Signature Big Pill Action Button */}
        <div className="py-3 px-1">
          <Link
            href="/pos"
            className={cn(
              "w-full btn-liquid flex items-center justify-center bg-[var(--primary)] text-white font-black text-sm uppercase tracking-wider py-3.5 shadow-lg hover:opacity-95 active:scale-[0.98] transition-all",
              collapsed && !mobileOpen ? "px-0" : "px-4"
            )}
            title="Launch POS Terminal"
          >
            <FontAwesomeIcon icon={faCartShopping} className={cn("h-4 w-4", !collapsed || mobileOpen ? "mr-2" : "mr-0")} />
            {(!collapsed || mobileOpen) && <span>Launch POS</span>}
          </Link>
        </div>

        {/* Footer User Profile Capsule */}
        <div className="border-t border-border py-3">
          <div
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className={cn(
              "group flex items-center justify-between rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-left",
              collapsed && !mobileOpen ? "justify-center" : ""
            )}
            title="Click to Sign Out"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-[var(--surface-sub)] border border-border flex items-center justify-center shrink-0 font-bold text-text text-sm">
                {(user?.username || "A").slice(0, 1).toUpperCase()}
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-text truncate leading-tight">
                    {user?.name || user?.username || "Admin Operator"}
                  </p>
                  <p className="text-xs text-text-muted font-mono truncate">
                    @{user?.username || "admin"}
                  </p>
                </div>
              )}
            </div>

            {(!collapsed || mobileOpen) && (
              <FontAwesomeIcon icon={faRightFromBracket} className="h-3.5 w-3.5 text-text-muted group-hover:text-danger mr-2 transition-colors" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

