"use client";

import { useState, useEffect } from "react";
import { staffService } from "@/services/staff";
import { Guard } from "@/components/auth/Guard";
import { Role } from "@/types/rbac.types";
import { User as UserIcon, Plus, Shield, Mail, Phone, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await staffService.getEmployees();
        setEmployees(data.data as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Guard allowedRoles={[Role.ADMIN as any]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Employee Registry</h1>
            <p className="text-text-muted text-sm mt-1">Manage staff accounts, roles and system permissions</p>
          </div>
          <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            <Plus size={18} /> New Employee
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-card border border-border bg-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-bg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-bg rounded"></div>
                    <div className="h-3 w-1/3 bg-bg rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : employees.length === 0 ? (
            <div className="col-span-full py-12 text-center text-text-muted bg-surface rounded-card border border-border">
              No employees registered.
            </div>
          ) : (
            employees.map((emp) => (
              <div key={emp.id} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg border border-border overflow-hidden">
                      {emp.avatar_url ? (
                        <img src={emp.avatar_url} alt={emp.username} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="text-text-muted" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{emp.employee_name}</h3>
                      <p className="text-xs text-text-muted">@{emp.username}</p>
                    </div>
                  </div>
                  <RoleBadge role={emp.role} />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <Mail size={16} />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <Shield size={16} />
                    <span>{emp.position || "Staff Member"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-text-muted">Last login: 2 hours ago</span>
                  <button className="text-text-muted hover:text-primary">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Guard>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: any = {
    admin: "bg-danger/10 text-danger border-danger/20",
    manager: "bg-primary/10 text-primary border-primary/20",
    cashier: "bg-accent/10 text-accent border-accent/20",
    staff: "bg-text-muted/10 text-text-muted border-text-muted/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-[2px] text-[10px] font-bold border uppercase tracking-wider",
      styles[role.toLowerCase()] || styles.staff
    )}>
      {role}
    </span>
  );
}
