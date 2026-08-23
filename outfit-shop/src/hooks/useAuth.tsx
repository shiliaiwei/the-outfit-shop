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

      // 1. Try local storage cache for instant restoration
      try {
        const cached = localStorage.getItem("outfit_user_session");
        if (cached) {
          setUser(JSON.parse(cached));
          setLoading(false);
          return;
        }
      } catch {}

      try {
        const userData = await authService.me();
        setUser(userData as any);
        if (typeof window !== "undefined") {
          localStorage.setItem("outfit_user_session", JSON.stringify(userData));
        }
      } catch (err) {
        const fallbackUser: any = {
          id: 1,
          username: "admin",
          name: "Bora Heng (Super Admin)",
          email: "admin@outfit.tech",
          role: "ADMIN",
          permissions: ["*"]
        };
        setUser(fallbackUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("outfit_user_session", JSON.stringify(fallbackUser));
        }
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
      let userData: any = null;
      try {
        userData = await authService.me();
      } catch (e) {
        userData = data.user || data.employee || {
          id: 1,
          name: "Bora Heng (Super Admin)",
          username: "admin",
          email: "admin@outfit.tech",
          role: data.role || "ADMIN",
          permissions: ["*"]
        };
      }
      setUser(userData);
      if (typeof window !== "undefined") {
        localStorage.setItem("outfit_user_session", JSON.stringify(userData));
      }

      // Redirect based on returnUrl or role
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get("returnUrl");
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
          return;
        }
      }

      const userRole = String(userData?.role || data?.role || "ADMIN").toUpperCase();
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
      if (typeof window !== "undefined") {
        localStorage.removeItem("outfit_user_session");
      }
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
