"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogIn, Lock, User } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password, device_name: "Web Browser" });
      toast.success("Authentication successful. Welcome to OUTFIT.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4" data-role="public">
      <div className="w-full max-w-md space-y-8 rounded-card bg-surface p-10 shadow-2xl border border-border">
        <div className="text-center space-y-3">
          <div className="brand-wordmark-twotone text-4xl">
            <span className="font-[900] text-[#1E2631]">OUT</span>
            <span className="font-[700] text-[#C84428]">FIT</span>
          </div>
          <h2 className="text-sm font-black text-text uppercase tracking-widest">
            Enterprise Management System
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Enter your authorized username or email address and password to access the platform.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-text tracking-wider">
                Username or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Username or email"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-text tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-btn bg-primary py-3.5 text-xs font-black uppercase tracking-[0.15em] text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Authenticating Operator..." : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Authenticate and Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
