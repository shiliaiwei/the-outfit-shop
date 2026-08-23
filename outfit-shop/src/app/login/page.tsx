"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner"; // Assuming sonner will be installed
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password, device_name: "Web Browser" });
      toast.success("Welcome back to OUTFIT.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Authentication failed. Please verify credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4" data-role="public">
      <div className="w-full max-w-md space-y-8 rounded-card bg-surface p-8 shadow-md border border-border">
        <div className="text-center">
          <div className="brand-wordmark-twotone text-4xl mb-2">
            <span className="font-[900] text-[#1E2631]">OUT</span>
            <span className="font-[700] text-[#C84428]">FIT</span>
          </div>
          <p className="text-text-muted">Enter your credentials to access the management system</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">Username</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
