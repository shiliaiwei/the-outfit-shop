'use client';

import React, { useState } from 'react';
import { CartItem, CurrencyCode } from '@/types';
import { CatalogService } from '@/services/catalogService';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Receipt, 
  CheckCircle, 
  Copy, 
  Check, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface CheckoutReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onSuccessOrder: () => void;
}

export function CheckoutReceiptModal({
  isOpen,
  onClose,
  items,
  currency,
  onSuccessOrder
}: CheckoutReceiptModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'ABA_KHQR' | 'CARD' | 'CASH'>('ABA_KHQR');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTxnId, setCompletedTxnId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 120 || items.length === 0 ? 0 : 15.00;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // Ultra-fast 1-Tap Pay flow (reduced to 350ms instant response)
  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txnId = `OUTFIT-${Math.floor(100000 + Math.random() * 900000)}`;
      setCompletedTxnId(txnId);
      setIsProcessing(false);
      onSuccessOrder();
    }, 350);
  };

  const handleCopyReceipt = () => {
    if (!completedTxnId) return;
    const txt = `OUTFIT SHOP Receipt #${completedTxnId}\nTotal: ${CatalogService.formatPrice(total, currency)}\nItems: ${items.length}\nDate: ${new Date().toLocaleString()}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E2631]/60 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-[#5A6678]/20 rounded-[2px] shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-[#1E2631]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Row: Clean Wordmark on Left, High-Visibility Close Button on Far Right */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5A6678]/15 mb-4">
          <div className="flex items-center gap-2">
            <BrandWordmark size="sm" />
            <span className="text-xs font-mono font-bold text-[#8E9AA8]">/ Checkout</span>
          </div>
          
          <button
            onClick={onClose}
            className="btn-liquid btn-liquid-glass p-1.5 rounded-[2px] cursor-pointer hover:border-[#C84428] text-[#5A6678] hover:text-[#1E2631] transition-colors"
            title="Close Checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!completedTxnId ? (
          /* Fast Checkout Step */
          <div className="flex flex-col gap-4">

            {/* Payment Method Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono font-bold text-[#1E2631] uppercase">
                  Select Payment Tender:
                </label>
                <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                  <Zap className="w-3 h-3" /> 1-Tap Instant Auth
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('ABA_KHQR')}
                  className={`btn-liquid p-2.5 rounded-[2px] text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'ABA_KHQR'
                      ? 'btn-liquid-active bg-[#C84428] text-white border-white/40 shadow-sm'
                      : 'btn-liquid-glass text-[#5A6678]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>ABA KHQR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`btn-liquid p-2.5 rounded-[2px] text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'btn-liquid-active bg-[#C84428] text-white border-white/40 shadow-sm'
                      : 'btn-liquid-glass text-[#5A6678]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`btn-liquid p-2.5 rounded-[2px] text-xs font-mono font-bold flex flex-col items-center gap-1 cursor-pointer ${
                    paymentMethod === 'CASH'
                      ? 'btn-liquid-active bg-[#C84428] text-white border-white/40 shadow-sm'
                      : 'btn-liquid-glass text-[#5A6678]'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>Cash</span>
                </button>
              </div>
            </div>

            {/* ABA KHQR Code Showcase if selected */}
            {paymentMethod === 'ABA_KHQR' && (
              <div className="p-3.5 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[2px] flex flex-col items-center text-center gap-2 animate-in fade-in">
                <div className="w-28 h-28 bg-white border border-[#5A6678]/20 rounded-[2px] p-1.5 flex items-center justify-center shadow-xs">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bakong%3A%2F%2Fkhqr%3Famount%3D125%26currency%3DUSD"
                    alt="ABA KHQR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#1E2631]">
                  Scan with Bakong or Any Mobile Banking App
                </span>
                <span className="text-[10px] font-mono text-[#8E9AA8]">
                  Instant webhook authorization
                </span>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-3 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[2px] flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#5A6678]">
                <span>Items ({items.length}):</span>
                <span>{CatalogService.formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-[#5A6678]">
                <span>Delivery:</span>
                <span className="text-emerald-700 font-semibold">{shipping === 0 ? 'FREE' : CatalogService.formatPrice(shipping, currency)}</span>
              </div>
              <div className="flex justify-between text-[#5A6678]">
                <span>Store Tax (5%):</span>
                <span>{CatalogService.formatPrice(tax, currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1E2631] pt-1.5 border-t border-[#5A6678]/15 mt-1 font-display">
                <span>Total Amount:</span>
                <span>{CatalogService.formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Quick 1-Tap Pay Action Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="btn-liquid btn-liquid-terracotta w-full py-3.5 text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span>Authorizing Instant Payment...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-white" />
                  <span>Confirm &amp; Authorize {CatalogService.formatPrice(total, currency)}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Receipt Success Step */
          <div className="flex flex-col items-center text-center gap-4 py-2 animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 rounded-[2px] flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9AA8]">
                Order Confirmed &amp; Invoiced
              </span>
              <h3 className="text-xl font-display font-black text-[#1E2631]">
                Receipt #{completedTxnId}
              </h3>
            </div>

            {/* Thermal Slip View */}
            <div className="w-full max-w-sm bg-[#F8F7F4] border border-dashed border-[#5A6678]/30 rounded-[2px] p-4 text-left font-mono text-[11px] flex flex-col gap-2">
              <div className="text-center pb-2 border-b border-[#5A6678]/15 font-bold">
                <div>OUTFIT SHOP</div>
                <div className="text-[10px] font-normal text-[#5A6678]">theoufit.kesararamwithdigital.tech</div>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8E9AA8]">Ref:</span>
                <span className="font-bold">{completedTxnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9AA8]">Tender:</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-[#5A6678]/15 pt-1 text-xs text-[#1E2631]">
                <span>Total Paid:</span>
                <span>{CatalogService.formatPrice(total, currency)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full max-w-sm">
              <button
                onClick={handleCopyReceipt}
                className="btn-liquid btn-liquid-glass flex-1 py-2 rounded-[2px] text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5A6678]" />}
                <span>{copied ? 'Copied' : 'Copy Slip'}</span>
              </button>

              <button
                onClick={onClose}
                className="btn-liquid btn-liquid-charcoal flex-1 py-2 rounded-[2px] text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
