'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  Ruler, 
  Feather, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Package
} from 'lucide-react';
import { BrandWordmark } from '@/components/brand/BrandWordmark';

export type CustomerGuideTopic = 
  | 'normandy-linen'
  | 'fit-guide'
  | 'care-guide'
  | 'shipping-duties'
  | 'returns-exchange'
  | 'all-pieces'
  | 'overshirts'
  | 'supima-knits'
  | 'tailored-trousers'
  | 'capsule-drops'
  | null;

interface CustomerGuideModalProps {
  topic: CustomerGuideTopic;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export function CustomerGuideModal({ topic, onClose, onSelectCategory }: CustomerGuideModalProps) {
  if (!topic) return null;

  const contentMap: Record<string, {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge: string;
    sections: { heading: string; body: string; bulletPoints?: string[] }[];
  }> = {
    'normandy-linen': {
      title: 'Normandy Flax Standard',
      subtitle: 'Traceable, ethical European cultivation for enduring quiet luxury',
      icon: <Feather className="w-5 h-5 text-[#C84428]" />,
      badge: 'Certified Origin',
      sections: [
        {
          heading: 'Heritage Terroir',
          body: 'Cultivated in northern France along the Normandy coast, where ocean mist, fertile soil, and optimal rainfall yield the world’s longest, most resilient flax fibers (280 GSM).'
        },
        {
          heading: 'Material Specifications',
          body: '100% European Flax Certified. Naturally hypoallergenic, thermo-regulating, and pre-washed with organic enzymes for a soft, structured drape that improves with age.'
        }
      ]
    },
    'fit-guide': {
      title: 'Bespoke Tailoring & Fit Guide',
      subtitle: 'Precise dimensional metrics for European & American sizing',
      icon: <Ruler className="w-5 h-5 text-[#C84428]" />,
      badge: 'Sizing Spec',
      sections: [
        {
          heading: 'Standard Conversion Matrix',
          body: 'Our garments follow relaxed bespoke tailoring. If between sizes, choose your standard size for an architectural drape, or size down for structured slim fitting.',
          bulletPoints: [
            'Size S (EU 46 / US 36): Chest 38-40 in • Shoulder 18.0 in',
            'Size M (EU 48 / US 38): Chest 40-42 in • Shoulder 18.5 in',
            'Size L (EU 50 / US 40): Chest 42-44 in • Shoulder 19.2 in',
            'Size XL (EU 52 / US 42): Chest 44-46 in • Shoulder 20.0 in'
          ]
        }
      ]
    },
    'care-guide': {
      title: 'Garment Longevity & Care Protocol',
      subtitle: 'Preserve natural fibers, rich patina, and fabric integrity',
      icon: <Sparkles className="w-5 h-5 text-[#C84428]" />,
      badge: 'Care Standards',
      sections: [
        {
          heading: 'Washing Instructions',
          body: 'Machine wash delicate cycle in cold water (maximum 30°C / 86°F) using gentle plant-based detergent. Do not bleach or tumble dry.'
        },
        {
          heading: 'Drying & Steaming',
          body: 'Reshape while damp and dry flat away from direct sunlight. For optimal finish, steam lightly on medium heat setting while garment is hanging.'
        }
      ]
    },
    'shipping-duties': {
      title: 'Insured Global Express & Duties',
      subtitle: 'Direct from our studio to your private door with zero hidden fees',
      icon: <Truck className="w-5 h-5 text-[#C84428]" />,
      badge: 'DDP Direct',
      sections: [
        {
          heading: 'Complimentary Tier',
          body: 'Complimentary insured express delivery on all orders over $120. Standard courier delivery ($15.00 flat rate) on smaller orders.'
        },
        {
          heading: 'Delivery Timeline & Import Taxes',
          body: 'Dispatched within 24 hours via DHL Express (2-4 business days). All import duties, VAT, and custom clearance fees are 100% pre-paid (Delivery Duty Paid).'
        }
      ]
    },
    'returns-exchange': {
      title: '14-Day Boutique Returns & Exchanges',
      subtitle: 'Frictionless return service with prepaid concierge collection',
      icon: <RotateCcw className="w-5 h-5 text-[#C84428]" />,
      badge: 'Concierge Return',
      sections: [
        {
          heading: 'Return Policy Conditions',
          body: 'You may return or exchange unworn pieces in original condition with all security tags and original packaging intact within 14 calendar days of receipt.'
        },
        {
          heading: 'Instant Refund Process',
          body: 'Generate your prepaid DHL return waybill with 1 tap. Refunds are credited instantly to your original payment method upon barcode scan verification.'
        }
      ]
    },
    'all-pieces': {
      title: 'Complete Haute Collection',
      subtitle: 'Discover our verified luxury pieces currently in live catalog sync',
      icon: <Package className="w-5 h-5 text-[#C84428]" />,
      badge: 'Full Catalog',
      sections: [
        {
          heading: 'Curated Ready-to-Wear',
          body: 'Complete assortment spanning tailored jackets, Supima knits, Normandy flax overshirts, silk tees, and luxury archive accessories.'
        }
      ]
    },
    'overshirts': {
      title: 'Structured Overshirts Collection',
      subtitle: 'Heavyweight Normandy linen and double-face cotton layering essentials',
      icon: <Layers className="w-5 h-5 text-[#C84428]" />,
      badge: 'Outerwear',
      sections: [
        {
          heading: 'Architectural Layering',
          body: 'Cut with clean boxy shoulders, horn buttons, and French seams to transition seamlessly between casual daytime and evening tailoring.'
        }
      ]
    },
    'supima-knits': {
      title: 'California Supima Knits',
      subtitle: 'Long-staple 24-gauge fine knits for second-skin comfort',
      icon: <Sparkles className="w-5 h-5 text-[#C84428]" />,
      badge: 'Fine Gauge',
      sections: [
        {
          heading: 'Extra-Long Staple Purity',
          body: 'Crafted from 100% California Supima cotton, renowned for superior softness, high tensile strength, and exceptional color fastness.'
        }
      ]
    },
    'tailored-trousers': {
      title: 'High-Twist Tailored Trousers',
      subtitle: 'Double-pleated tropical wool with fluid movement and drape',
      icon: <Ruler className="w-5 h-5 text-[#C84428]" />,
      badge: 'Tailoring',
      sections: [
        {
          heading: 'Contemporary Proportions',
          body: 'Featuring a high-rise waist, tab closures, and subtle taper down to an unfinished hem ready for bespoke cuffing.'
        }
      ]
    },
    'capsule-drops': {
      title: 'Secret Archive Capsule Drops',
      subtitle: 'Numbered limited editions and private archive releases',
      icon: <ShieldCheck className="w-5 h-5 text-[#C84428]" />,
      badge: 'Limited Privé',
      sections: [
        {
          heading: 'Exclusivity & Provenance',
          body: 'Produced in limited numbered editions of 50–100 pieces. Once archived, designs are never re-released to maintain authentic rarity.'
        }

      ]
    }
  };

  const activeContent = contentMap[topic] || contentMap['normandy-linen'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1E2631]/60 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-[#5A6678]/20 rounded-[2px] shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto text-[#1E2631]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#5A6678]/15 mb-4">
          <div className="flex items-center gap-2">
            <BrandWordmark size="sm" />
            <span className="text-xs font-mono font-bold text-[#8E9AA8]">/ Brand Standards</span>
          </div>

          <button
            onClick={onClose}
            className="btn-liquid btn-liquid-glass p-1.5 rounded-[2px] cursor-pointer hover:border-[#C84428] text-[#5A6678] hover:text-[#1E2631] transition-colors"
            title="Close Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Title & Badge */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-[2px] bg-[#F8F7F4] border border-[#5A6678]/15 flex items-center justify-center shrink-0">
            {activeContent.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg sm:text-xl font-display font-black text-[#1E2631]">
                {activeContent.title}
              </h3>
              <span className="btn-liquid btn-liquid-terracotta px-2 py-0.5 text-[9px] font-mono font-bold rounded-[2px]">
                {activeContent.badge}
              </span>
            </div>
            <p className="text-xs text-[#5A6678] font-sans">
              {activeContent.subtitle}
            </p>
          </div>
        </div>

        {/* Sections Content */}
        <div className="space-y-4 mb-6">
          {activeContent.sections.map((sec, idx) => (
            <div key={idx} className="p-3.5 bg-[#F8F7F4] border border-[#5A6678]/12 rounded-[2px]">
              <h4 className="text-xs font-mono font-bold text-[#1E2631] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C84428]" />
                {sec.heading}
              </h4>
              <p className="text-xs text-[#5A6678] leading-relaxed">
                {sec.body}
              </p>
              {sec.bulletPoints && (
                <ul className="mt-2.5 space-y-1.5 pt-2 border-t border-[#5A6678]/10 text-xs font-mono text-[#1E2631]">
                  {sec.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C84428]" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5A6678]/15">
          <button
            onClick={() => {
              if (onSelectCategory && (topic === 'overshirts' || topic === 'all-pieces')) {
                onSelectCategory(topic === 'overshirts' ? 'Overshirts' : 'All');
              }
              onClose();
            }}
            className="btn-liquid btn-liquid-charcoal px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
          >
            Acknowledge &amp; Return
          </button>
        </div>

      </div>
    </div>
  );
}
