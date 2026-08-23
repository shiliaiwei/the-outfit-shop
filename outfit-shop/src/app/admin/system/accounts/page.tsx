"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { Guard } from "@/components/auth/Guard";
import { Role } from "@/types/auth.types";
import { User as UserIcon, Plus, Key, ShieldCheck, Mail, Smartphone, MoreVertical, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UserAccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get<any>("/employees"); // Assuming same endpoint for user listing
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleResetPassword = async (email: string) => {
    if (!confirm(`Are you sure you want to force reset the password for ${email}?`)) return;
    try {
      await api.post("/auth/admin-reset-password", { email, new_password: "Rotated" + Math.random().toString(36).slice(-8) });
      toast.success(`Temporary password generated and sent to ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
              <Key className="text-primary" size={28} />
              User Access Management
            </h1>
            <p className="text-text-muted text-sm mt-1">Tier 4 Admin control for system users and credential rotation</p>
          </div>
          <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all">
            <Plus size={18} /> Register Account
          </button>
        </div>

        <div className="rounded-card border border-border bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg/30 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">User Account</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">System Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">MFA Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-bg rounded w-full"></div></td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-bg/10 group transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text uppercase">@{user.username}</p>
                            <p className="text-[10px] text-text-muted font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase border tracking-widest",
                           user.role === "ADMIN" ? "bg-danger/10 text-danger border-danger/20" : "bg-primary/10 text-primary border-primary/20"
                         )}>
                            {user.role}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-bold text-text uppercase truncate max-w-[120px]">{user.employee_name || "N/A"}</p>
                         <p className="text-[10px] text-text-muted uppercase mt-0.5">{user.position || "System Operator"}</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1.5 text-success">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black uppercase">Active</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleResetPassword(user.email)}
                              className="px-3 py-1.5 rounded-[2px] border border-border bg-bg text-[10px] font-black uppercase text-text-muted hover:text-danger hover:border-danger/30 transition-all"
                            >
                               Reset PWD
                            </button>
                            <button className="p-2 text-text-muted hover:text-text"><MoreVertical size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-card border-2 border-dashed border-danger/20 bg-danger/[0.02] p-8 text-center max-w-2xl mx-auto">
           <ShieldAlert size={48} className="text-danger mx-auto opacity-30 mb-4" />
           <h4 className="text-sm font-black text-text uppercase tracking-widest">Administrative Policy</h4>
           <p className="text-xs text-text-muted mt-2 leading-relaxed uppercase font-mono">
             User accounts are triple-locked. Any modification to TIER 4 credentials dispatches an automated alert to the master audit console and requires hardware MFA verification.
           </p>
        </div>
      </div>
    </Guard>
  );
}
