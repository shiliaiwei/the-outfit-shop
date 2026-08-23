"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Guard } from "../auth/Guard";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <Guard allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="flex h-screen overflow-hidden bg-bg" data-role={user?.role?.toLowerCase() === "admin" ? "admin" : "staff"}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </Guard>
  );
}
