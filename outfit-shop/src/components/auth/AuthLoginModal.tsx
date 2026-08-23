'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Receipt, 
  Sliders, 
  UserCheck, 
  Package, 
  ArrowRight, 
  Lock, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { UserRole, UserSession } from '@/types';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { ApiService } from '@/services/api';

interface AuthLoginModalProps {
  onLoginSuccess: (session: UserSession) => void;
  currentRole: UserRole;
}

export function AuthLoginModal({ onLoginSuccess, currentRole }: AuthLoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [email, setEmail] = useState<string>('cashier@outfit.tech');
  const [password, setPassword] = useState<string>('••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roleConfigs = [
    {
      role: 'cashier' as UserRole,
      title: 'Staff / Cashier POS',
      email: 'cashier@outfit.tech',
      icon: Receipt,
      color: 'text-[#C84428]',
      desc: 'High-speed barcode scanner, active cart ticket, multi-tender payments, and thermal receipt printing.'
    },
    {
      role: 'admin' as UserRole,
      title: 'Super Admin Console',
      email: 'admin@outfit.tech',
      icon: Sliders,
      color: 'text-sky-600',
      desc: 'Multi-register telemetry, consolidated shift revenues, role permission matrix, and cryptographic keyrings.'
    },
    {
      role: 'manager' as UserRole,
      title: 'Store Floor Manager',
      email: 'manager@outfit.tech',
      icon: UserCheck,
      color: 'text-emerald-600',
      desc: 'Cash drawer float reconciliation ($450.00 base), VIP discount overrides, and shift sign-offs.'
    },
    {
      role: 'warehouse' as UserRole,
      title: 'Warehouse Logistics',
      email: 'warehouse@outfit.tech',
      icon: Package,
      color: 'text-amber-600',
      desc: 'Inbound SKU intake, stock movement tracking, bin allocations, and supplier purchase orders.'
    },
  ];

  const handleSelectRole = (role: UserRole, roleEmail: string) => {
    setSelectedRole(role);
    setEmail(roleEmail);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = await ApiService.login(email, selectedRole);
      onLoginSuccess(session);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#5A6678]/20 rounded-[9px] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[9px] bg-[#F8F7F4] border border-[#5A6678]/15 flex items-center justify-center shadow-xs">
              <img src="/OutFIT/OutFIT.svg" alt="OutFIT" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <BrandWordmark size="md" />
              <div className="text-[11px] text-[#5A6678] font-medium">RBAC Security Gateway &bull; SS-MIS PostgreSQL</div>
            </div>
          </div>

          <div className="badge-2px bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Secure Portal</span>
          </div>

        </div>

        {/* 1-Click Role Quick Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black text-[#1E2631] uppercase tracking-wider">
            Select Role to Access Console:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {roleConfigs.map((cfg) => {
              const Icon = cfg.icon;
              const isSelected = selectedRole === cfg.role;
              return (
                <button
                  type="button"
                  key={cfg.role}
                  onClick={() => handleSelectRole(cfg.role, cfg.email)}
                  className={`p-3.5 rounded-[9px] border text-left transition-all flex flex-col justify-between gap-2 ${
                    isSelected 
                      ? 'border-[#C84428] bg-orange-50/20 ring-1 ring-[#C84428]' 
                      : 'border-[#5A6678]/15 bg-white hover:border-[#5A6678]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      <span className="font-display font-bold text-xs text-[#1E2631]">{cfg.title}</span>
                    </div>
                    {isSelected && (
                      <span className="badge-2px bg-[#C84428] text-white px-1.5 py-0.2 text-[9px] font-extrabold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5A6678] leading-snug">{cfg.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3.5 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#5A6678]">Operator Email</label>
              <div className="flex items-center gap-2 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] px-3 py-2 text-xs">
                <Lock className="w-3.5 h-3.5 text-[#5A6678]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent font-medium text-[#1E2631] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#5A6678]">Security Passcode</label>
              <div className="flex items-center gap-2 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] px-3 py-2 text-xs">
                <KeyRound className="w-3.5 h-3.5 text-[#5A6678]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent font-medium text-[#1E2631] focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-9px w-full py-3 bg-[#C84428] hover:bg-[#B33920] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all mt-1"
          >
            <span>{isLoading ? 'Authenticating...' : `Enter ${selectedRole.toUpperCase()} Console`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
