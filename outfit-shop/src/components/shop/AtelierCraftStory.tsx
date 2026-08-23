'use client';

import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  Copy,
  Crown,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

type CardTier = '100' | '50' | '250';

interface MemberCardSpec {
  id: CardTier;
  amount: string;
  khmerTitle: string;
  enSubTitle: string;
  editionName: string;
  badgeEn: string;
  memberPrefix: string;
  memberSecret: string;
  descriptionEn: string;
  bgGradient: string;
  dotColor: string;
  glowColor: string;
  accentColor: string;
  benefitsEn: string[];
}

const CARDS: MemberCardSpec[] = [
  {
    id: '100',
    amount: '$100',
    khmerTitle: 'កាតសមាជិក VIP',
    enSubTitle: 'Privilege Point & Metal Pass',
    editionName: 'Imperial Gold Edition',
    badgeEn: 'Priority Tier • Most Coveted',
    memberPrefix: 'VIP-',
    memberSecret: '884-291',
    descriptionEn: 'The flagship laser metal pass. Unlocks 24h early access on 1-of-100 archive drops, VIP point accumulation, and private concierge tailoring.',
    bgGradient: 'from-[#140F04] via-[#241B08] to-[#0A0702]',
    dotColor: '#E5C07B',
    glowColor: 'rgba(229, 192, 123, 0.35)',
    accentColor: 'text-amber-300',
    benefitsEn: [
      '24h Early booking on limited 1-of-100 archive drops',
      'Laser-etched stainless steel Gold Metal Card',
      'Free worldwide priority insured courier',
      'Direct WhatsApp master tailor concierge'
    ]
  },
  {
    id: '50',
    amount: '$50',
    khmerTitle: 'កាតសមាជិក',
    enSubTitle: 'Privilege Point & Gift Card',
    editionName: 'Emerald Matrix Edition',
    badgeEn: 'Archive Standard Pass',
    memberPrefix: 'VIP-',
    memberSecret: '502-184',
    descriptionEn: 'The signature emerald matrix digital pass. Redeemable across all ready-to-wear pieces, Normandy linen, and seasonal capsule items.',
    bgGradient: 'from-[#021309] via-[#072416] to-[#010B05]',
    dotColor: '#2EA043',
    glowColor: 'rgba(46, 160, 67, 0.35)',
    accentColor: 'text-emerald-400',
    benefitsEn: [
      'Instant digital checkout redemption with zero expiration',
      'VIP points accumulation on all purchases',
      '1-Tap Apple Wallet & Google Pay pass sync',
      'Seasonal lookbook & private drop notifications'
    ]
  },
  {
    id: '250',
    amount: '$250',
    khmerTitle: 'កាតសមាជិក DIAMOND',
    enSubTitle: 'Diamond Metal Privilege Pass',
    editionName: 'Diamond Edition',
    badgeEn: 'Diamond Patron Tier',
    memberPrefix: 'VIP-',
    memberSecret: '991-042',
    descriptionEn: 'Our premier luxury diamond pass for serious collectors. Grants private Paris/Milan showroom access, lifetime 10% archive credit, and custom bespoke fitting.',
    bgGradient: 'from-[#050C16] via-[#0B1A2F] to-[#03060B]',
    dotColor: '#7DD3FC',
    glowColor: 'rgba(56, 189, 248, 0.38)',
    accentColor: 'text-sky-300',
    benefitsEn: [
      'Guaranteed allocation on 1-of-50 numbered pieces',
      'Paris & Milan fashion showroom invitations',
      'Lifetime 10% archive collection credit',
      'Custom bespoke tailoring on all garments'
    ]
  }
];

export function AtelierCraftStory() {
  // $100 Gold Card is default priority active
  const [activeTier, setActiveTier] = useState<CardTier>('100');
  const [copied, setCopied] = useState(false);
  const activeCard = CARDS.find((c) => c.id === activeTier) || CARDS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`OUTFIT-VIP-${activeCard.amount.replace('$', '')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
      <div className="liquid-glass-elevated bg-white/95 border border-[#5A6678]/15 rounded-[2px] p-6 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Subtle Ambient Background Watermark */}
        <div className="absolute -right-12 -bottom-10 text-[220px] font-display font-black text-slate-100/60 select-none pointer-events-none leading-none z-0">
          VIP
        </div>

        {/* Section Header (English Outside Card - Short, High-Impact Detail) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="btn-liquid btn-liquid-glass text-[10px] font-mono font-bold uppercase tracking-widest text-[#C84428] px-3.5 py-1 rounded-[2px] mb-2.5 shadow-2xs flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#C84428]" />
            <span>VIP Archive Pass</span>
          </span>
          
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[#1E2631] tracking-tight leading-tight">
            Member Privileges
          </h2>
          
          <p className="text-xs sm:text-sm text-[#5A6678] mt-2 leading-relaxed font-sans max-w-lg">
            Early archive access, member points, and private tailoring concierge.
          </p>

          {/* Interactive Tier Switcher Pills ($100 first, English Outside) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 font-mono">
            {CARDS.map((card) => {
              const isSelected = card.id === activeTier;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveTier(card.id)}
                  className={`btn-liquid px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? card.id === '100'
                        ? 'bg-[#140F04] text-amber-300 border border-amber-500/70 shadow-md scale-105'
                        : card.id === '50'
                        ? 'bg-[#021309] text-emerald-400 border border-emerald-500/70 shadow-md scale-105'
                        : 'bg-[#050C16] text-sky-300 border border-sky-400/70 shadow-md scale-105'
                      : 'bg-[#F8F7F4] text-[#5A6678] hover:text-[#1E2631] border border-[#5A6678]/15'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    card.id === '100' ? 'bg-amber-300' : card.id === '50' ? 'bg-emerald-400' : 'bg-sky-400'
                  }`} />
                  <span>{card.amount} — {card.editionName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Card Showcase Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* LEFT: Clean Luxury Member Card with Smooth Elevation (No Flash) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div 
              className="w-full max-w-[490px] aspect-[1.586/1] rounded-[22px] relative shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden p-7 sm:p-8 flex flex-col justify-between select-none group border border-white/15"
            >
              {/* 1. Deep Dark Base Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activeCard.bgGradient} z-0`} />

              {/* 2. Exact GitHub-Style Concentric Dot Matrix Contour Grid */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
                
                {/* Ambient Center Glow */}
                <div 
                  className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-60"
                  style={{ backgroundColor: activeCard.glowColor }}
                />

                {/* High-Precision SVG Dot Matrix Contour Map */}
                <svg
                  viewBox="0 0 490 310"
                  className="w-full h-full object-cover opacity-90"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id={`matrix-grad-${activeCard.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={activeCard.dotColor} stopOpacity="1" />
                      <stop offset="65%" stopColor={activeCard.dotColor} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={activeCard.dotColor} stopOpacity="0.1" />
                    </radialGradient>
                    <pattern id={`dot-pattern-${activeCard.id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="4" cy="4" r="1.15" fill={`url(#matrix-grad-${activeCard.id})`} />
                    </pattern>
                  </defs>

                  {/* Concentric Spherical Contour Lines */}
                  <g fill="none" stroke={activeCard.dotColor} strokeWidth="1.2" opacity="0.5">
                    <ellipse cx="260" cy="150" rx="180" ry="125" strokeDasharray="3 4" />
                    <ellipse cx="260" cy="150" rx="155" ry="106" strokeDasharray="4 3" />
                    <ellipse cx="260" cy="150" rx="130" ry="88" strokeDasharray="3 5" />
                    <ellipse cx="260" cy="150" rx="105" ry="70" strokeDasharray="2 3" />
                    <ellipse cx="260" cy="150" rx="80" ry="53" strokeDasharray="4 4" />
                    <ellipse cx="260" cy="150" rx="55" ry="36" strokeDasharray="2 2" />
                  </g>

                  {/* Micro-Dot Grid Layer */}
                  <rect width="490" height="310" fill={`url(#dot-pattern-${activeCard.id})`} opacity="0.65" />

                  {/* Diagonal Matrix ASCII Pattern */}
                  <g fill={activeCard.dotColor} opacity="0.3" fontSize="6" fontFamily="monospace">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <text key={i} x={70 + i * 18} y={40 + (i % 8) * 28}>
                        +++###@@@%%%***:::...
                      </text>
                    ))}
                  </g>
                </svg>
              </div>

              {/* CARD TOP ROW: Logo & Twotone Mark on Left */}
              <div className="relative z-10 flex items-center justify-between">
                
                {/* Brand Logo & Wordmark (Clean & Transparent) */}
                <div className="flex items-center gap-3">
                  <img 
                    src="/brand/logo.png" 
                    alt="OutFIT Logo" 
                    className="w-12 h-12 sm:w-13 sm:h-13 object-contain filter drop-shadow-md"
                  />
                  <div className="flex flex-col">
                    <div className="brand-wordmark-twotone font-display text-xl sm:text-2xl leading-none">
                      <span className="font-black text-white">OUT</span>
                      <span className="font-bold text-[#C84428] ml-[1px]">FIT</span>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-white/75 uppercase mt-0.5">
                      PRIVILEGE PASS
                    </span>
                  </div>
                </div>

                {/* Top-Right Pill Badge */}
                <div className="px-2.5 py-1 rounded-[2px] bg-white/10 border border-white/20 text-[10px] font-mono uppercase font-bold text-white/90 backdrop-blur-xs">
                  {activeCard.editionName}
                </div>
              </div>

              {/* CARD CENTER: Centered Large Amount ($100 / $50 / $250) + Big Khmer Title below */}
              <div className="relative z-10 my-auto text-left py-2 flex flex-col justify-center">
                
                {/* Big Khmer Title */}
                <h3 className="font-khmer text-2xl sm:text-3xl font-black text-white tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {activeCard.khmerTitle}
                </h3>
                <p className="text-xs font-mono text-white/80 tracking-wide mt-0.5 font-semibold">
                  {activeCard.enSubTitle}
                </p>

                {/* Centered Large Crisp Value */}
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight leading-none drop-shadow-md">
                    {activeCard.amount}
                  </span>
                  <span className="text-xs font-mono font-bold text-white/60 uppercase">
                    USD / Pass
                  </span>
                </div>
              </div>

              {/* CARD BOTTOM ROW: Blurred Security Member ID Number */}
              <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/80 tracking-wider">
                  <Lock className="w-3 h-3 text-amber-400 opacity-90" />
                  <span>ID: {activeCard.memberPrefix}</span>
                  <span className="blur-[4px] select-none opacity-85 font-mono font-black text-white bg-white/20 px-1 py-0.2 rounded-xs">
                    {activeCard.memberSecret}
                  </span>
                  <span className="text-[9px] text-white/50 ml-1">(ENCRYPTED)</span>
                </div>

                <div className="text-[10px] font-mono text-white/60 tracking-wider">
                  2028 VALID
                </div>
              </div>

            </div>
          </div>


          {/* RIGHT: Tier Privileges & Instant Action (Clean Short English Details) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[2px] p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C84428] bg-white border border-[#5A6678]/15 px-2.5 py-0.5 rounded-[2px]">
                  {activeCard.badgeEn}
                </span>
                <span className="text-sm font-mono font-black text-[#1E2631]">
                  {activeCard.amount} USD
                </span>
              </div>

              <h3 className="text-xl font-display font-black text-[#1E2631] mb-1">
                {activeCard.editionName}
              </h3>
              <p className="text-xs text-[#5A6678] font-sans leading-relaxed mb-5">
                {activeCard.descriptionEn}
              </p>

              {/* Short, Punchy Privileges List */}
              <div className="flex flex-col gap-2.5 mb-6">
                {activeCard.benefitsEn.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E2631]">
                    <div className="w-4 h-4 rounded-full bg-white border border-[#5A6678]/20 flex items-center justify-center text-[#C84428] shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-snug font-sans font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#5A6678]/15 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => alert(`Requested VIP Pass for ${activeCard.editionName} (${activeCard.amount})!`)}
                className="btn-liquid btn-liquid-terracotta w-full py-3 rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Claim {activeCard.amount} VIP Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                className="btn-liquid btn-liquid-glass w-full py-2.5 rounded-[2px] text-xs font-mono font-bold text-[#1E2631] flex items-center justify-center gap-2 cursor-pointer border border-[#5A6678]/20 bg-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5A6678]" />}
                <span>{copied ? 'Promo Code Copied!' : 'Copy Instant Promo Code'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
