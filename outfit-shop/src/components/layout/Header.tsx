"use client";

import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1E2631]" />
          <input
            type="text"
            placeholder="Search resources..."
            className="h-9 w-64 rounded-md border border-border bg-bg pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-1.5 hover:opacity-80 cursor-pointer" title="Notifications">
          <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-[#1E2631]" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-text">{user?.employee_name || user?.username}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-[#1E2631]" />
          )}
        </div>
      </div>
    </header>
  );
}
