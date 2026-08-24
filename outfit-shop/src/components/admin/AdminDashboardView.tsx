'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWaveSquare, faSliders, faLock, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { RegisterTelemetry } from '@/types';
import Link from 'next/link';

const REGISTERS: RegisterTelemetry[] = [
  { id: 'REG-01', name: 'Register #01 (Front Counter)', operator: 'Channara Lim', shiftSales: 2450.00, transactionCount: 28, status: 'online', lastActivity: '2 mins ago', drawerBalance: 1450.00 },
  { id: 'REG-02', name: 'Register #02 (Express POS)', operator: 'Sothea Kem', shiftSales: 2890.50, transactionCount: 34, status: 'online', lastActivity: 'Just now', drawerBalance: 1730.00 },
  { id: 'REG-03', name: 'Register #03 (VIP Fitting)', operator: 'Vannak Ouk', shiftSales: 1120.00, transactionCount: 12, status: 'idle', lastActivity: '18 mins ago', drawerBalance: 820.00 },
];

export function AdminDashboardView() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      
      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col justify-between gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Daily Consolidated Sales</span>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-mono text-[10px] font-bold">
              +24.5%
            </span>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-text">
              $6,460.50
            </div>
            <p className="text-xs text-text-muted mt-0.5">74 completed transactions today</p>
          </div>
        </div>

        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col justify-between gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Active Registers</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-mono text-[10px] font-bold">
              3 Online
            </span>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-text">
              3 Terminals
            </div>
            <p className="text-xs text-text-muted mt-0.5">Zero sync latency &bull; SS-MIS PostgreSQL</p>
          </div>
        </div>

        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col justify-between gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">Inventory Velocity</span>
            <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 font-mono text-[10px] font-bold">
              48 SKUs
            </span>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-text">
              98.2% In Stock
            </div>
            <p className="text-xs text-text-muted mt-0.5">Top mover: Tailored Linen Overshirt</p>
          </div>
        </div>

        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col justify-between gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted">System Status</span>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-mono text-[10px] font-bold">
              Operational
            </span>
          </div>
          <div>
            <div className="font-mono font-bold text-lg text-text truncate">
              99.98% Uptime
            </div>
            <p className="text-xs text-text-muted mt-0.5">PostgreSQL Master Sync &bull; POS Online</p>
          </div>
        </div>

      </div>

      {/* MULTI-REGISTER TELEMETRY TABLE */}
      <div className="liquid-glass p-6 rounded-2xl sm:rounded-3xl border border-border shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWaveSquare} className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-bold text-base text-text">
              Live Register Telemetry &amp; Operator Stream
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20 text-xs font-bold">
            Live Edge Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-muted font-bold text-[11px]">
                <th className="pb-3">Terminal ID</th>
                <th className="pb-3">Assigned Operator</th>
                <th className="pb-3">Shift Volume</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Last Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {REGISTERS.map(reg => (
                <tr key={reg.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 font-bold text-text">{reg.name}</td>
                  <td className="py-3.5 text-text-muted">{reg.operator}</td>
                  <td className="py-3.5 font-mono font-bold text-text">
                    ${reg.shiftSales.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-text-muted">{reg.transactionCount}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      reg.status === 'online' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {reg.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono text-text-muted text-[11px]">{reg.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC PERMISSION CONTROLS & SECURITY AUDIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <FontAwesomeIcon icon={faSliders} className="w-4 h-4 text-[var(--primary)]" />
            <span>Store Level Policy &amp; Floor Overrides</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Configure register transaction caps, manager authorization thresholds, and drawer reconciliation rules for shift closings.
          </p>
          <div className="flex gap-2 mt-auto pt-2">
            <Link href="/admin/system/shifts" className="btn-liquid px-4 py-2.5 rounded-full text-xs font-bold text-text bg-[var(--surface-sub)] hover:bg-black/5 dark:hover:bg-white/10 border border-border flex-1 text-center transition-all">
              Manage Roles
            </Link>
            <Link href="/admin/reports/audit" className="btn-liquid px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[var(--primary)] hover:opacity-90 transition-all text-center">
              Audit Logs
            </Link>
          </div>
        </div>

        <div className="liquid-glass p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[var(--primary)]" />
            <span>Cryptographic Keyrings &amp; API Gateways</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-mono">
            API Endpoints synchronized with SS-MIS backend at <code>https://api.kesararamwithdigital.tech/api/v1</code>.
          </p>
          <div className="flex items-center justify-between p-3 bg-[var(--surface-sub)] border border-border rounded-2xl text-xs font-mono mt-auto">
            <span className="text-text-muted">PostgreSQL Mesh</span>
            <span className="text-success font-bold">12ms latency &bull; Optimal</span>
          </div>
        </div>

      </div>

    </div>
  );
}
