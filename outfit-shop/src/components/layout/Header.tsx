"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, User as UserIcon } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search resources..."
            className="h-9 w-64 rounded-md border border-border bg-bg pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-bg">
          <Bell size={20} className="text-text-muted" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-text">{user?.employee_name || user?.username}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role.toLowerCase()}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg border border-border">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <UserIcon size={20} className="text-text-muted" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
