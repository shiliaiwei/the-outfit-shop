'use client';

import React, { useState } from 'react';
import { BrandWordmark } from '@/components/brand/BrandWordmark';
import { Globe, Copy, Check, ArrowRight, ShieldCheck, Mail, Sparkles, Feather, Ruler, Truck, RotateCcw, Package, Layers } from 'lucide-react';
import { CustomerGuideTopic } from './CustomerGuideModal';

interface ShopFooterProps {
  onOpenTopic?: (topic: CustomerGuideTopic) => void;
}

export function ShopFooter({ onOpenTopic }: ShopFooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const copyDomain = () => {
    navigator.clipboard.writeText('theoufit.kesararamwithdigital.tech');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-[#1E2631] text-[#F8F7F4] pt-12 pb-8 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand & Newsletter Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-white border border-white/20 flex items-center justify-center">
                <img src="/OutFIT/OutFIT.svg" alt="OUTFIT" className="w-5 h-5 object-contain" />
              </div>
              <BrandWordmark size="md" invert={true} />
            </div>

            <p className="text-xs text-[#8E9AA8] max-w-sm leading-relaxed">
              Curated contemporary tailoring, traceable Normandy linen, and premium archival streetwear essentials.
            </p>

            {/* Newsletter Input Form */}
            <form onSubmit={handleSubscribe} className="flex max-w-sm mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for private drops..."
                className="flex-1 px-3 py-2 bg-white/10 border border-white/15 rounded-l-[2px] text-xs text-white placeholder-[#8E9AA8] focus:outline-none focus:border-[#C84428] font-sans"
              />
              <button
                type="submit"
                className="btn-liquid btn-liquid-terracotta px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-r-[2px] cursor-pointer"
              >
                {subscribed ? 'Joined' : 'Join'}
              </button>
            </form>
          </div>

          {/* Catalog Navigation (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-2.5 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
              Catalog
            </span>
            <button 
              onClick={() => onOpenTopic?.('all-pieces')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              All Pieces
            </button>
            <button 
              onClick={() => onOpenTopic?.('overshirts')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Overshirts
            </button>
            <button 
              onClick={() => onOpenTopic?.('supima-knits')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Supima Knits
            </button>
            <button 
              onClick={() => onOpenTopic?.('tailored-trousers')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Tailored Trousers
            </button>
            <button 
              onClick={() => onOpenTopic?.('capsule-drops')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Capsule Drops
            </button>
          </div>

          {/* Customer Services (2 cols) */}
          <div className="md:col-span-2 flex flex-col gap-2.5 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
              Services
            </span>
            <button 
              onClick={() => onOpenTopic?.('normandy-linen')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Normandy Linen
            </button>
            <button 
              onClick={() => onOpenTopic?.('fit-guide')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Fit Guide
            </button>
            <button 
              onClick={() => onOpenTopic?.('care-guide')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Care Guide
            </button>
            <button 
              onClick={() => onOpenTopic?.('shipping-duties')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Shipping &amp; Duties
            </button>
            <button 
              onClick={() => onOpenTopic?.('returns-exchange')}
              className="text-left text-[#8E9AA8] hover:text-[#C84428] cursor-pointer transition-colors"
            >
              Returns &amp; Exchange
            </button>
          </div>

          {/* Social Channels & Communities (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-3 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Social &amp; Channels
            </span>

            {/* Icon-Only Platform Grid */}
            <div className="flex flex-wrap gap-2">
              {/* TikTok */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="TikTok"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.48c1.33.95 2.95 1.52 4.7 1.57v-3.36h-.93z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="Instagram"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="Facebook"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="YouTube"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#1E2631"/>
                </svg>
              </a>

              {/* Shopify */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="Shopify"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="M19.5 4.5h-3.8A4.7 4.7 0 0 0 11 1.2a4.7 4.7 0 0 0-4.7 3.3H2.5L1 21.8a1 1 0 0 0 1 1.2h18a1 1 0 0 0 1-1.2L19.5 4.5zm-8.5-1.5a2.7 2.7 0 0 1 2.7 1.5H8.3a2.7 2.7 0 0 1 2.7-1.5z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="Telegram"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .66-.21.916-.458l2.199-2.138 4.573 3.378c.843.464 1.448.225 1.658-.783l2.997-14.133c.307-1.231-.469-1.787-1.506-1.507z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                title="X (Twitter)"
                className="w-8 h-8 rounded-[2px] bg-white/5 border border-white/10 hover:border-[#C84428] hover:bg-white/15 flex items-center justify-center text-[#8E9AA8] hover:text-white transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C84428] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>



        </div>

        {/* Grand Centerpiece Signature Logo Pop-up in Footer */}
        <div className="py-10 sm:py-14 flex flex-col items-center justify-center text-center select-none border-b border-white/10 overflow-hidden">
          <div className="flex items-center justify-center gap-2 sm:gap-6 tracking-tighter leading-none animate-in fade-in zoom-in-95 duration-500">
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black text-white/95 drop-shadow-lg">
              OUT
            </span>
            <span className="text-[19vw] sm:text-[15vw] lg:text-[13vw] font-display font-black text-[#C84428] drop-shadow-lg">
              FIT
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#8E9AA8] mt-3">
            Contemporary Fashion &amp; Archival Collection
          </span>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8E9AA8] gap-4">
          <p>© {new Date().getFullYear()} OUTFIT. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onOpenTopic?.('care-guide')} className="hover:text-white cursor-pointer transition-colors">Privacy Policy</button>
            <button onClick={() => onOpenTopic?.('returns-exchange')} className="hover:text-white cursor-pointer transition-colors">Terms of Service</button>
            <button onClick={() => onOpenTopic?.('shipping-duties')} className="hover:text-white cursor-pointer transition-colors">Security Audit</button>
          </div>
        </div>


      </div>
    </footer>
  );
}
