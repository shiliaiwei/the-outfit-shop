'use client';

import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  ArrowUpRight,
  Server,
  Lock
} from 'lucide-react';
import { RegisterTelemetry } from '@/types';

const REGISTERS: RegisterTelemetry[] = [
  { id: 'REG-01', name: 'Register #01 (Front Counter)', operator: 'Channara Lim', shiftSales: 2450.00, transactionCount: 28, status: 'online', lastActivity: '2 mins ago', drawerBalance: 1450.00 },
  { id: 'REG-02', name: 'Register #02 (Express POS)', operator: 'Sothea Kem', shiftSales: 2890.50, transactionCount: 34, status: 'online', lastActivity: 'Just now', drawerBalance: 1730.00 },
  { id: 'REG-03', name: 'Register #03 (VIP Fitting)', operator: 'Vannak Ouk', shiftSales: 1120.00, transactionCount: 12, status: 'idle', lastActivity: '18 mins ago', drawerBalance: 820.00 },
];

export function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="liquid-glass p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6678]">Daily Consolidated Sales</span>
            <span className="badge-2px px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              +24.5%
            </span>
          </div>
          <div>
            <div className="font-display font-black text-2xl text-[#1E2631]">
              $6,460.50
            </div>
            <p className="text-[11px] text-[#5A6678] mt-0.5">74 completed transactions today</p>
          </div>
        </div>

        <div className="liquid-glass p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6678]">Active Registers</span>
            <span className="badge-2px px-1.5 py-0.5 bg-sky-50 text-sky-700 font-mono text-[10px] font-bold">
              3 Online
            </span>
          </div>
          <div>
            <div className="font-display font-black text-2xl text-[#1E2631]">
              3 Terminals
            </div>
            <p className="text-[11px] text-[#5A6678] mt-0.5">Zero sync latency &bull; SS-MIS PostgreSQL</p>
          </div>
        </div>

        <div className="liquid-glass p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6678]">Inventory Velocity</span>
            <span className="badge-2px px-1.5 py-0.5 bg-amber-50 text-amber-700 font-mono text-[10px] font-bold">
              48 SKUs
            </span>
          </div>
          <div>
            <div className="font-display font-black text-2xl text-[#1E2631]">
              98.2% In Stock
            </div>
            <p className="text-[11px] text-[#5A6678] mt-0.5">Top mover: Tailored Linen Overshirt</p>
          </div>
        </div>

        <div className="liquid-glass p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6678]">System Status</span>
            <span className="badge-2px px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              Operational
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-base text-[#1E2631] truncate">
              99.98% Uptime
            </div>
            <p className="text-[11px] text-[#5A6678] mt-0.5">PostgreSQL Master Sync &bull; POS Online</p>
          </div>
        </div>


      </div>

      {/* MULTI-REGISTER TELEMETRY TABLE */}
      <div className="liquid-glass p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C84428]" />
            <h3 className="font-display font-black text-base text-[#1E2631]">
              Live Register Telemetry &amp; Operator Stream
            </h3>
          </div>
          <span className="badge-2px bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold">
            Live Edge Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#5A6678]/15 text-[#5A6678] font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-2">Terminal ID</th>
                <th className="pb-2">Assigned Operator</th>
                <th className="pb-2">Shift Volume</th>
                <th className="pb-2">Orders</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Last Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {REGISTERS.map(reg => (
                <tr key={reg.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-3 font-bold text-[#1E2631]">{reg.name}</td>
                  <td className="py-3 text-[#5A6678]">{reg.operator}</td>
                  <td className="py-3 font-mono font-bold text-[#1E2631]">
                    ${reg.shiftSales.toFixed(2)}
                  </td>
                  <td className="py-3 text-[#5A6678]">{reg.transactionCount}</td>
                  <td className="py-3">
                    <span className={`badge-2px px-2 py-0.5 text-[10px] font-bold ${
                      reg.status === 'online' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {reg.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono text-[#8E9AA8]">{reg.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC PERMISSION CONTROLS & SECURITY AUDIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E2631]">
            <Sliders className="w-4 h-4 text-[#C84428]" />
            <span>Store Level Policy &amp; Floor Overrides</span>
          </div>
          <p className="text-xs text-[#5A6678] leading-relaxed">
            Configure register transaction caps, manager authorization thresholds, and drawer reconciliation rules for shift closings.
          </p>
          <div className="flex gap-2 mt-auto pt-2">
            <button className="btn-9px bg-white border border-[#5A6678]/15 hover:border-[#C84428] text-xs font-bold text-[#1E2631] px-3 py-2 flex-1 transition-all">
              Manage Role Permissions
            </button>
            <button className="btn-9px bg-[#C84428] text-white text-xs font-bold px-4 py-2 hover:bg-[#B33920] transition-all">
              Audit Shift Logs
            </button>
          </div>
        </div>

        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E2631]">
            <Lock className="w-4 h-4 text-sky-600" />
            <span>Cryptographic Keyrings &amp; API Gateways</span>
          </div>
          <p className="text-xs text-[#5A6678] leading-relaxed">
            API Endpoints synchronized with SS-MIS backend at <code>https://api.kesararamwithdigital.tech/api/v1</code>.
          </p>
          <div className="flex items-center justify-between p-2.5 bg-white border border-[#5A6678]/15 rounded-[9px] text-xs font-mono mt-auto">
            <span className="text-[#5A6678]">PostgreSQL Health</span>
            <span className="text-emerald-700 font-bold">14ms latency &bull; Connected</span>
          </div>
        </div>

      </div>

    </div>
  );
}
