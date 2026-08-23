'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  Search, 
  User, 
  Award,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ShiftOverride } from '@/types';

const INITIAL_OVERRIDES: ShiftOverride[] = [
  { id: 'OVR-101', requestedBy: 'Cashier Sothea Kem', reason: 'VIP Client Tier 3 Discount', discountPct: 15, amountSaved: 23.10, status: 'pending', timestamp: '10:42 AM' },
  { id: 'OVR-102', requestedBy: 'Cashier Channara Lim', reason: 'Damaged Display Box Allowance', discountPct: 10, amountSaved: 8.90, status: 'pending', timestamp: '11:15 AM' },
  { id: 'OVR-099', requestedBy: 'Cashier Vannak Ouk', reason: 'Sample Fabric Return Voucher', discountPct: 20, amountSaved: 35.00, status: 'approved', timestamp: '09:20 AM' },
];

export function StaffOperationsView() {
  const [overrides, setOverrides] = useState<ShiftOverride[]>(INITIAL_OVERRIDES);
  const [drawerFloat, setDrawerFloat] = useState<number>(450.00);
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [activeCustomer, setActiveCustomer] = useState<{ name: string; email: string; points: number; tier: string } | null>({
    name: 'Sophea Pich',
    email: 'sophea.p@example.com',
    points: 1240,
    tier: 'Platinum VIP'
  });

  const handleApprove = (id: string) => {
    setOverrides(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' } : o));
  };

  const handleReject = (id: string) => {
    setOverrides(prev => prev.map(o => o.id === id ? { ...o, status: 'rejected' } : o));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      
      {/* LEFT COLUMN: SHIFT OVERRIDES & DRAWER (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Cash Drawer Float Card */}
        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-2.5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#C84428]" />
              <h3 className="font-display font-black text-sm text-[#1E2631]">
                Register Drawer Float &amp; Cash Balancing
              </h3>
            </div>
            <span className="badge-2px bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
              Balanced Float
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white border border-[#5A6678]/15 p-2.5 rounded-[9px]">
              <span className="text-[11px] text-[#5A6678]">Base Float</span>
              <div className="font-mono font-bold text-base text-[#1E2631] mt-0.5">$450.00</div>
            </div>
            <div className="bg-white border border-[#5A6678]/15 p-2.5 rounded-[9px]">
              <span className="text-[11px] text-[#5A6678]">Cash Collected</span>
              <div className="font-mono font-bold text-base text-emerald-700 mt-0.5">+$1,280.00</div>
            </div>
            <div className="bg-white border border-[#5A6678]/15 p-2.5 rounded-[9px]">
              <span className="text-[11px] text-[#5A6678]">Current in Till</span>
              <div className="font-mono font-bold text-base text-[#C84428] mt-0.5">$1,730.00</div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button className="btn-9px bg-white border border-[#5A6678]/15 hover:border-[#C84428] text-xs font-bold text-[#1E2631] px-3 py-2 flex-1 transition-all">
              Count Mid-Shift Float
            </button>
            <button className="btn-9px bg-[#C84428] text-white text-xs font-bold px-4 py-2 hover:bg-[#B33920] transition-all">
              Cash Drop to Safe
            </button>
          </div>
        </div>

        {/* Shift Override Approvals Queue */}
        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-display font-black text-sm text-[#1E2631]">
                Manager Floor Override Requests
              </h3>
            </div>
            <span className="text-xs text-[#5A6678] font-mono">
              {overrides.filter(o => o.status === 'pending').length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {overrides.map(override => (
              <div 
                key={override.id}
                className="bg-white border border-[#5A6678]/15 p-3 rounded-[9px] flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#1E2631]">{override.id}</span>
                    <span className="text-[11px] text-[#5A6678]">&bull; {override.timestamp}</span>
                    <span className={`badge-2px px-1.5 py-0.2 text-[10px] font-bold ${
                      override.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : override.status === 'rejected'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {override.status.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-[#1E2631] mt-0.5">{override.reason}</h5>
                  <p className="text-[11px] text-[#5A6678]">
                    {override.requestedBy} &bull; <strong className="text-[#C84428]">-{override.discountPct}% (${override.amountSaved.toFixed(2)})</strong>
                  </p>
                </div>

                {override.status === 'pending' && (
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleApprove(override.id)}
                      className="btn-9px bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 text-xs font-bold"
                      title="Approve Override"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleReject(override.id)}
                      className="btn-9px bg-slate-200 hover:bg-red-50 hover:text-red-700 text-[#5A6678] p-1.5 text-xs font-bold"
                      title="Reject Override"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: STAFF SHIFT CHECK-IN & VIP LOYALTY (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Staff Shift Check-In */}
        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-2.5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-display font-black text-sm text-[#1E2631]">
                Staff Attendance &bull; On Duty
              </h3>
            </div>
            <span className="badge-2px bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              08:30 AM Shift
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#5A6678]/15 p-3 rounded-[9px]">
            <div className="w-10 h-10 rounded-[9px] bg-slate-100 border border-[#5A6678]/15 flex items-center justify-center font-display font-bold text-sm text-[#1E2631]">
              SK
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E2631]">Sothea Kem</h4>
              <p className="text-[11px] text-[#5A6678]">Lead POS Operator &bull; Terminal #02</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                <Clock className="w-3 h-3" /> Shift duration: 3 hrs 45 mins
              </div>
            </div>
          </div>

          <button className="btn-9px bg-white border border-[#5A6678]/15 hover:border-red-500 hover:text-red-700 text-xs font-bold text-[#5A6678] py-2 transition-all">
            Clock Out / Shift Handover
          </button>
        </div>

        {/* Customer VIP Loyalty Lookup */}
        <div className="liquid-glass p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C84428]" />
              <h3 className="font-display font-black text-sm text-[#1E2631]">
                Customer VIP Loyalty &amp; Credit
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#5A6678]/15 rounded-[9px] px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-[#5A6678]" />
            <input 
              type="text" 
              placeholder="Search phone or member name..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1E2631] focus:outline-none placeholder:text-[#8E9AA8]"
            />
          </div>

          {activeCustomer && (
            <div className="bg-white border border-[#5A6678]/15 p-3 rounded-[9px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1E2631]">{activeCustomer.name}</h4>
                  <p className="text-[10px] text-[#5A6678]">{activeCustomer.email}</p>
                </div>
                <span className="badge-2px bg-orange-50 text-[#C84428] border border-[#C84428]/20 text-[10px] font-bold px-2 py-0.5">
                  {activeCustomer.tier}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                <span className="text-[#5A6678]">Reward Points</span>
                <span className="font-mono font-bold text-[#1E2631]">{activeCustomer.points} pts ($62.00 value)</span>
              </div>

              <button className="btn-9px bg-[#C84428] text-white text-xs font-bold py-2 hover:bg-[#B33920] transition-all mt-1">
                Apply Member Store Credit to Cart
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
