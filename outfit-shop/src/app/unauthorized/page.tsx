"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center">
      <div className="rounded-full bg-danger/10 p-6 text-danger mb-6 border border-danger/20">
        <ShieldAlert size={64} />
      </div>
      <h1 className="text-3xl font-bold text-text mb-2">Access Denied</h1>
      <p className="text-text-muted max-w-md mb-8">
        Your current role does not have permission to access this resource.
        Please contact your system administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Link
          href="/admin/dashboard"
          className="rounded-btn bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/login"
          className="rounded-btn border border-border bg-surface px-6 py-2 font-semibold text-text hover:bg-bg transition-colors"
        >
          Sign in as another user
        </Link>
      </div>
    </div>
  );
}
