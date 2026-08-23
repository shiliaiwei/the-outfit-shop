'use client';

import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  Crown, 
  Copy, 
  Lock,
  Sparkles
} from 'lucide-react';

type CardTier = '50' | '100' | '250';

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
  cardTheme: {
    bg: string;
    textColor: string;
    subtextColor: string;
    cornerStripeLight: string;
    cornerStripeDark: string;
    dividerColor: string;
    borderColor: string;
  };
  benefitsEn: string[];
}

const CARDS: MemberCardSpec[] = [
  {
    id: '50',
    amount: '$50',
    khmerTitle: 'កាតសមាជិក',
    enSubTitle: 'Emerald Matrix Pass',
    editionName: 'Emerald Matrix Edition',
    badgeEn: 'Archive Standard Pass',
    memberPrefix: 'VIP-',
    memberSecret: '502-184',
    descriptionEn: 'The signature emerald matrix digital pass. Redeemable across all ready-to-wear pieces, Normandy linen, and seasonal capsule items.',
    cardTheme: {
      bg: 'from-[#0A291C] via-[#165039] to-[#092217]',
      textColor: 'text-white',
      subtextColor: 'text-emerald-100/80',
      cornerStripeLight: 'rgba(52, 211, 153, 0.35)',
      cornerStripeDark: 'rgba(6, 78, 59, 0.65)',
      dividerColor: 'border-emerald-300',
      borderColor: 'border-emerald-500/50'
    },
    benefitsEn: [
      'Instant digital checkout redemption with zero expiration',
      'VIP points accumulation on all purchases',
      '1-Tap Apple Wallet & Google Pay pass sync',
      'Seasonal lookbook & private drop notifications'
    ]
  },
  {
    id: '100',
    amount: '$100',
    khmerTitle: 'កាតសមាជិក VIP',
    enSubTitle: 'Imperial Gold Pass',
    editionName: 'Imperial Gold Edition',
    badgeEn: 'Priority Tier • Most Coveted',
    memberPrefix: 'VIP-',
    memberSecret: '884-291',
    descriptionEn: 'The flagship laser metal pass. Unlocks 24h early access on 1-of-100 archive drops, VIP point accumulation, and private concierge tailoring.',
    cardTheme: {
      bg: 'from-[#C59B48] via-[#EADB9B] to-[#A37326]',
      textColor: 'text-[#1A1408]',
      subtextColor: 'text-[#4A3B18]',
      cornerStripeLight: 'rgba(255, 245, 204, 0.70)',
      cornerStripeDark: 'rgba(128, 86, 18, 0.60)',
      dividerColor: 'border-[#1A1408]',
      borderColor: 'border-[#AA771C]/50'
    },
    benefitsEn: [
      '24h Early booking on limited 1-of-100 archive drops',
      'Laser-etched stainless steel Gold Metal Card',
      'Free worldwide priority insured courier',
      'Direct WhatsApp master tailor concierge'
    ]
  },
  {
    id: '250',
    amount: '$250',
    khmerTitle: 'កាតសមាជិក DIAMOND',
    enSubTitle: 'Diamond Patron Pass',
    editionName: 'Diamond Edition',
    badgeEn: 'Diamond Patron Tier',
    memberPrefix: 'VIP-',
    memberSecret: '991-042',
    descriptionEn: 'Our premier luxury diamond pass for serious collectors. Grants private Paris/Milan showroom access, lifetime 10% archive credit, and custom bespoke fitting.',
    cardTheme: {
      bg: 'from-[#8E9EAF] via-[#D6E3EF] to-[#6E8094]',
      textColor: 'text-[#0F172A]',
      subtextColor: 'text-[#334155]',
      cornerStripeLight: 'rgba(255, 255, 255, 0.75)',
      cornerStripeDark: 'rgba(51, 65, 85, 0.50)',
      dividerColor: 'border-[#0F172A]',
      borderColor: 'border-slate-400/60'
    },
    benefitsEn: [
      'Guaranteed allocation on 1-of-50 numbered pieces',
      'Paris & Milan fashion showroom invitations',
      'Lifetime 10% archive collection credit',
      'Custom bespoke tailoring on all garments'
    ]
  }
];

export function VipMembershipStory() {
  const [activeTier, setActiveTier] = useState<CardTier>('50');
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeCard = CARDS.find((c) => c.id === activeTier) || CARDS[0];

  const promoCode = `OUTFIT-VIP-${activeCard.amount.replace('$', '')}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = activeCard.cardTheme;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-12 sm:py-20">
      <div className="liquid-glass-elevated bg-white/95 border border-[#5A6678]/15 rounded-[2px] p-6 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Section Header */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="btn-liquid btn-liquid-glass text-[10px] font-mono font-bold uppercase tracking-widest text-[#C84428] px-3.5 py-1 rounded-[2px] mb-2.5 shadow-2xs flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#C84428]" />
            <span>VIP Membership Pass</span>
          </span>
          
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[#1E2631] tracking-tight leading-tight">
            Member Privileges
          </h2>
          
          <p className="text-xs sm:text-sm text-[#5A6678] mt-2 leading-relaxed font-sans max-w-lg">
            Where bespoke craftsmanship meets timeless rarity. Exclusive early archive access, member reward privileges, and private master tailor concierge.
          </p>

          {/* Interactive Tier Switcher (Order: $50, $100, $250) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 font-mono">
            {CARDS.map((card) => {
              const isSelected = card.id === activeTier;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveTier(card.id);
                    setIsFlipped(false);
                  }}
                  className={`btn-liquid px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? card.id === '50'
                        ? 'bg-[#021309] text-emerald-400 border border-emerald-500/70 shadow-md scale-105 ring-1 ring-emerald-500/40'
                        : card.id === '100'
                        ? 'bg-[#140F04] text-amber-300 border border-amber-500/70 shadow-md scale-105 ring-1 ring-amber-500/40'
                        : 'bg-[#050C16] text-sky-300 border border-sky-400/70 shadow-md scale-105 ring-1 ring-sky-400/40'
                      : 'bg-[#F8F7F4] text-[#5A6678] hover:text-[#1E2631] border border-[#5A6678]/15'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    card.id === '50' ? 'bg-emerald-400' : card.id === '100' ? 'bg-amber-300' : 'bg-sky-400'
                  }`} />
                  <span>{card.amount} — {card.editionName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Card Showcase Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* LEFT: 3D Flip VIP Membership Card (Grid Texture & Corner Bands, 10px Rounded Corners) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
            
            {/* 3D Perspective Viewport */}
            <div 
              className="w-full max-w-[480px] aspect-[1.586/1] min-h-[220px] sm:min-h-[270px] select-none cursor-pointer relative"
              style={{ perspective: '1200px' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* 3D Card Flipper Object */}
              <div 
                className="w-full h-full relative transition-transform duration-700 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                
                {/* ═══ FRONT SIDE OF CARD (Grid Style with Diagonal Corner Bands) ═══ */}
                <div 
                  className={`vip-member-card absolute inset-0 w-full h-full p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.borderColor}`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: '10px'
                  }}
                >
                  {/* 1. Base Metallic Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} z-0`} />

                  {/* 2. Fine Diagonal Grid Texture */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-0 opacity-20"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0px, rgba(255, 255, 255, 0.20) 1px, transparent 1px, transparent 10px),
                        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.10) 0px, rgba(0, 0, 0, 0.10) 1px, transparent 1px, transparent 10px)
                      `
                    }}
                  />

                  {/* 3. Top-Left Luxury Diagonal Corner Stripes */}
                  <div className="absolute -top-10 -left-10 w-28 h-28 pointer-events-none z-0 overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.cornerStripeDark} 0%, ${theme.cornerStripeDark} 25%, transparent 25%, transparent 35%, ${theme.cornerStripeLight} 35%, ${theme.cornerStripeLight} 55%, transparent 55%)`
                      }}
                    />
                  </div>

                  {/* 4. Bottom-Right Luxury Diagonal Corner Stripes */}
                  <div className="absolute -bottom-10 -right-10 w-28 h-28 pointer-events-none z-0 overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(315deg, ${theme.cornerStripeDark} 0%, ${theme.cornerStripeDark} 25%, transparent 25%, transparent 35%, ${theme.cornerStripeLight} 35%, ${theme.cornerStripeLight} 55%, transparent 55%)`
                      }}
                    />
                  </div>

                  {/* TOP ROW: Big Two-Tone Brand Logo + Large Bold Dollar Amount */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center tracking-tight leading-none select-none drop-shadow-xs">
                      <span className={`text-2xl sm:text-3xl font-display font-black tracking-wider ${theme.textColor}`}>
                        OUT
                      </span>
                      <span className="text-2xl sm:text-3xl font-display font-black tracking-wider text-[#C84428]">
                        FIT
                      </span>
                    </div>

                    <div className="flex flex-col items-end leading-none">
                      <div className="flex items-baseline">
                        <span className={`text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight ${theme.textColor} drop-shadow-xs`}>
                          {activeCard.amount}
                        </span>
                        <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase ml-1 opacity-75 ${theme.textColor}`}>
                          USD
                        </span>
                      </div>
                      <span className={`text-[8.5px] sm:text-[9.5px] font-mono uppercase font-bold tracking-wider ${theme.subtextColor} mt-0.5`}>
                        {activeCard.editionName.split(' ')[0]} PASS
                      </span>
                    </div>
                  </div>

                  {/* CENTER: Flagship Large Scaled & Stylized VIP MEMBERSHIP CARD */}
                  <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center py-0 select-none">
                    <h1 className={`font-display text-7xl sm:text-8xl md:text-9xl font-black tracking-[-0.05em] leading-[0.82] drop-shadow-md ${theme.textColor}`}>
                      VIP
                    </h1>

                    {/* Architectural Luxury Divider Bar */}
                    <div className="w-44 sm:w-60 flex items-center justify-center gap-2 my-1 sm:my-1.5 opacity-90">
                      <div className={`flex-1 h-[1.5px] bg-current ${theme.textColor}`} />
                      <span className={`text-[7px] sm:text-[8px] ${theme.textColor}`}>◆</span>
                      <div className={`flex-1 h-[1.5px] bg-current ${theme.textColor}`} />
                    </div>

                    <span className={`text-[11px] sm:text-[13.5px] font-display font-black tracking-[0.32em] uppercase leading-none ${theme.textColor}`}>
                      MEMBERSHIP
                    </span>

                    <span className={`text-[14px] sm:text-[17.5px] font-display font-black tracking-[0.28em] uppercase mt-0.5 leading-none ${theme.textColor}`}>
                      CARD
                    </span>
                  </div>

                  {/* BOTTOM ROW: Clean Member ID + Valid Year (No white shape overlay) */}
                  <div className="relative z-10 flex items-center justify-between border-t border-black/10 sm:border-current/15 pt-2">
                    <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider ${theme.subtextColor}`}>
                      <Lock className="w-2.5 h-2.5 opacity-80 shrink-0" />
                      <span>ID: {activeCard.memberPrefix}</span>
                      <span className="blur-[2.5px] select-none font-mono font-black px-1 rounded-xs bg-black/10">
                        {activeCard.memberSecret}
                      </span>
                      <span className="text-[7.5px] sm:text-[8px] opacity-60 hidden xs:inline">(ENCRYPTED)</span>
                    </div>

                    <div className={`text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-wider ${theme.subtextColor}`}>
                      VALID 2028
                    </div>
                  </div>
                </div>


                {/* ═══ BACK SIDE OF CARD (3D Rotated 180deg) ═══ */}
                <div 
                  className={`vip-member-card absolute inset-0 w-full h-full p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border ${theme.borderColor}`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: '10px'
                  }}
                >
                  {/* 1. Base Metallic Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} z-0`} />

                  {/* 2. Fine Diagonal Grid Texture */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-0 opacity-15"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.20) 0px, rgba(255, 255, 255, 0.20) 1px, transparent 1px, transparent 10px),
                        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.10) 0px, rgba(0, 0, 0, 0.10) 1px, transparent 1px, transparent 10px)
                      `
                    }}
                  />

                  {/* TOP: Black Magnetic Stripe */}
                  <div className="relative z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 h-8 sm:h-10 bg-[#161209] flex items-center justify-between px-6 opacity-95">
                    <span className="text-[8px] font-mono tracking-widest text-amber-200/50 uppercase">
                      MAGNETIC STRIPE DATA ENCRYPTED
                    </span>
                    <span className="text-[8px] font-mono text-white/40">ISO/IEC 7810</span>
                  </div>

                  {/* CENTER BODY: Signature Strip + CVC + Terms */}
                  <div className="relative z-10 flex flex-col gap-2 my-auto pt-1">
                    
                    {/* Signature Strip Row */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/90 border border-black/10 rounded-[2px] h-6 sm:h-7 px-2 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#5A6678] tracking-widest italic select-none">
                          AUTHORIZED SIGNATURE
                        </span>
                        <span className="font-mono text-[9px] font-bold text-[#1E2631] tracking-wider">
                          {activeCard.memberSecret}
                        </span>
                      </div>
                      <div className="px-2 py-1 rounded-[2px] bg-black/15 text-[8px] font-mono font-bold tracking-widest text-current">
                        CVC: •••
                      </div>
                    </div>

                    {/* Official Store Terms */}
                    <p className={`text-[8px] sm:text-[9px] leading-relaxed font-mono opacity-80 ${theme.subtextColor} line-clamp-3 sm:line-clamp-none`}>
                      This official VIP Privilege Card is non-transferable and valid across all participating OUTFIT flagship salons in Paris, Milan, and Phnom Penh. Unlocks private 1-of-100 archive reservation and bespoke master tailoring.
                    </p>
                  </div>

                  {/* BACK BOTTOM ROW: Clean Brand Seal (No Email) */}
                  <div className="relative z-10 flex items-center justify-between border-t border-black/10 sm:border-current/15 pt-1.5 text-[8.5px] font-mono font-bold tracking-wider">
                    <div className={`flex items-center gap-1.5 ${theme.textColor}`}>
                      <Crown className="w-3 h-3 text-[#C84428]" />
                      <span>OUTFIT VIP PRIVILEGE</span>
                    </div>
                    <span className={theme.subtextColor}>AUTHENTIC ARCHIVE • ISO/IEC 7810</span>
                  </div>

                </div>

              </div>
            </div>

          </div>


          {/* RIGHT: Tier Privileges & Instant Action */}
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

            {/* Single Clean Centered Action Button (Bold Luxury Handwriting Font) */}
            <div className="pt-5 border-t border-[#5A6678]/15">
              <button
                type="button"
                onClick={handleCopyCode}
                className={`btn-liquid group relative w-full py-3 px-6 rounded-[2px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 select-none shadow-xs hover:shadow-md ${
                  copied
                    ? 'bg-emerald-900/95 text-emerald-200 border border-emerald-500 ring-1 ring-emerald-400/40'
                    : 'bg-[#1E2631] hover:bg-[#C84428] text-white border border-[#1E2631] hover:border-[#C84428]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3] text-emerald-300" />
                    <span className="font-handwriting text-2xl sm:text-3xl font-bold tracking-wide leading-none pt-0.5">
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="font-handwriting text-2xl sm:text-3xl font-bold tracking-wide leading-none pt-0.5">
                      Claim Pass
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

