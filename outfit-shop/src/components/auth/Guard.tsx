"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types/auth.types";

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function Guard({ children, allowedRoles }: GuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
