"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Guard } from "../auth/Guard";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Guard allowedRoles={["ADMIN", "MANAGER", "CASHIER", "STAFF"]}>
      <div className="flex h-screen overflow-hidden bg-bg" data-role={user?.role?.toLowerCase() === "admin" ? "admin" : "staff"}>
        {/* Desktop & Mobile Sidebar */}
        <Sidebar
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
          <Header onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </Guard>
  );
}
