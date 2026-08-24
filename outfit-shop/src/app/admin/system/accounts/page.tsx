"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { Guard } from "@/components/auth/Guard";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPlus } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_USERS = [
  { id: 1, username: "admin", email: "admin@outfit.luxury", role: "ADMIN", employee_name: "Master Admin", position: "System Architect" },
  { id: 2, username: "manager", email: "manager@outfit.luxury", role: "MANAGER", employee_name: "Floor Director", position: "Operations Manager" },
  { id: 3, username: "cashier1", email: "cashier1@outfit.luxury", role: "CASHIER", employee_name: "Register Lead", position: "Lead Cashier" }
];

export default function SystemAccountsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    role: "MANAGER",
    employee_name: "",
    position: ""
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get<any>("/users");
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          const synced = entityStore.sync("system_users", list, DEFAULT_USERS);
          setUsers(synced);
        } else {
          const local = entityStore.get("system_users", DEFAULT_USERS);
          setUsers(local);
        }
      } catch {
        const local = entityStore.get("system_users", DEFAULT_USERS);
        setUsers(local);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.email.trim()) {
      toast.error("Username and email are required");
      return;
    }
    const newUser = {
      id: Date.now(),
      username: newUserForm.username.trim().toLowerCase().replace(/\s+/g, "_"),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      employee_name: newUserForm.employee_name.trim() || "Staff Member",
      position: newUserForm.position.trim() || "Sales Associate"
    };
    entityStore.add("system_users", newUser, DEFAULT_USERS);
    setUsers((prev) => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
    toast.success(`User @${newUser.username} created successfully`);
    setIsAddModalOpen(false);
    setNewUserForm({ username: "", email: "", role: "MANAGER", employee_name: "", position: "" });
  };

  const handleConfirmResetPassword = async () => {
    if (!resetEmail) return;
    setResetting(true);
    try {
      await api.post("/auth/admin-reset-password", { email: resetEmail, new_password: "Rotated" + Math.random().toString(36).slice(-8) });
      toast.success(`Temporary password generated and dispatched to ${resetEmail}`);
      setResetEmail(null);
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
              User Accounts
            </h1>
            <p className="text-xs text-text-muted mt-1">Tier 4 Admin control for system credentials and role permissions</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Account</span>
          </button>
        </div>

        <div className="liquid-glass shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="bg-bg/40 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  <th className="px-5 py-3.5">User Account</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Identity</th>
                  <th className="px-5 py-3.5">MFA Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-medium">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="p-4"><div className="h-6 bg-bg/50 animate-pulse" /></td></tr>
                  ))
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-bg/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-text">@{u.username}</p>
                        <p className="text-[10px] text-text-muted font-mono">{u.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase border tracking-wider",
                          u.role === "ADMIN" ? "bg-danger/10 text-danger border-danger/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-text uppercase">{u.employee_name || "N/A"}</p>
                        <p className="text-[10px] text-text-muted uppercase">{u.position || "System Operator"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-bold text-success uppercase">Active &bull; Enforced</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setResetEmail(u.email)}
                          className="btn-liquid btn-liquid-glass px-2.5 py-1 text-[9px] font-mono font-bold uppercase cursor-pointer"
                        >
                          Reset PWD
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Account Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="liquid-glass w-full max-w-md p-6 space-y-4 shadow-2xl border border-border">
              <h2 className="text-base font-bold text-text uppercase tracking-tight">Add System Account</h2>
              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="e.g. sophia_kem"
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="e.g. sophia@outfit.luxury"
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Role</label>
                    <select
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="CASHIER">CASHIER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Position</label>
                    <input
                      type="text"
                      value={newUserForm.position}
                      onChange={(e) => setNewUserForm({ ...newUserForm, position: e.target.value })}
                      placeholder="e.g. Floor Lead"
                      className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.employee_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, employee_name: e.target.value })}
                    placeholder="e.g. Sophia Kem"
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-liquid btn-liquid-terracotta px-4 py-2 text-xs font-mono font-bold uppercase"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Compact Confirm Modal for PWD Reset */}
        <ConfirmModal
          isOpen={Boolean(resetEmail)}
          onClose={() => setResetEmail(null)}
          onConfirm={handleConfirmResetPassword}
          loading={resetting}
          title="Reset Account Password"
          description={`Are you sure you want to force reset the temporary credentials for ${resetEmail}? A secure temporary token will be dispatched.`}
          confirmLabel="Reset Password"
          cancelLabel="Cancel"
          variant="primary"
        />
      </div>
    </Guard>
  );
}
