"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, Role } from "@/types/auth.types";
import { authService } from "@/services/auth";
import { getToken } from "@/lib/api/client";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = useMemo(() => pathname === "/login" || pathname === "/auth/login", [pathname]);

  useEffect(() => {
    async function initAuth() {
      // Don't call me() on login page to avoid potential redirect loops
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      // Guest / Public visitor without token -> finish loading immediately
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.me();
        setUser(userData as any);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [isLoginPage]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      // After login, fetch profile to get full user object or fallback to login user
      let userData: any = null;
      try {
        userData = await authService.me();
      } catch (e) {
        userData = data.user || data.employee || { role: data.role || "STAFF" };
      }
      setUser(userData);

      // Redirect based on role
      const userRole = userData?.role || data?.role || "STAFF";
      if (userRole === "ADMIN" || userRole === "MANAGER") {
        router.push("/admin/dashboard");
      } else {
        router.push("/pos");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (perm: string) => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return user.permissions?.includes(perm) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
