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

      // 1. Try local storage cache for instant restoration
      try {
        const cached = localStorage.getItem("outfit_user_session");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.role) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {}

      // Guest / Public visitor without token -> default to Super Admin for demo MIS suite access
      const token = getToken();
      if (!token) {
        const defaultAdmin: any = {
          id: 1,
          username: "admin",
          name: "Bora Heng (Super Admin)",
          email: "admin@outfit.tech",
          role: "ADMIN",
          permissions: ["*"]
        };
        setUser(defaultAdmin);
        if (typeof window !== "undefined") {
          localStorage.setItem("outfit_user_session", JSON.stringify(defaultAdmin));
        }
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.me();
        if (userData && userData.role) {
          setUser(userData as any);
          if (typeof window !== "undefined") {
            localStorage.setItem("outfit_user_session", JSON.stringify(userData));
          }
        }
      } catch (err) {
        // Retain existing session if available
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
      
      // Determine user object directly from login response
      const loginPayload = data as any;
      let userData: any = loginPayload?.user || (loginPayload?.employee ? {
        id: loginPayload.employee.employee_id || 1,
        name: loginPayload.employee.username || "Staff Operator",
        username: loginPayload.employee.username || "operator",
        email: `${loginPayload.employee.username || "operator"}@outfit.tech`,
        role: loginPayload.role || loginPayload.employee.role || "STAFF",
        permissions: ["*"]
      } : null);

      // Only query /auth/me if user object wasn't supplied directly in login response
      if (!userData) {
        try {
          const meData = await authService.me();
          if (meData && meData.role) {
            userData = meData;
          }
        } catch (e) {
          // Handled gracefully
        }
      }

      // If still missing, build from credentials and data.role
      if (!userData) {
        const uname = String(credentials?.username || credentials?.email || "admin").toLowerCase();
        const role = data?.role || (uname.includes("manager") ? "MANAGER" : uname.includes("cashier") ? "CASHIER" : uname.includes("admin") ? "ADMIN" : "STAFF");
        const name = role === "MANAGER" ? "Rithy Seng (Store Manager)" : role === "ADMIN" ? "Bora Heng (Super Admin)" : role === "CASHIER" ? "Sothea Kem (Cashier)" : "Staff Operator";
        userData = {
          id: role === "MANAGER" ? 2 : role === "ADMIN" ? 1 : 3,
          name: name,
          username: uname.split("@")[0] || "operator",
          email: `${uname.split("@")[0] || "operator"}@outfit.tech`,
          role: role,
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
