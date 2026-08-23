'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Zap, 
  CheckCircle,
  Search,
  RotateCcw,
  Barcode,
  Volume2,
  VolumeX,
  ReceiptText
} from 'lucide-react';
import { PosProduct, CartItem, TransactionReceipt } from '@/types';
import { ApiService } from '@/services/api';

export function CashierPosView() {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tenderModalOpen, setTenderModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<TransactionReceipt | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const barcodeBuffer = useRef<string>('');
  const lastKeyTime = useRef<number>(0);

  // Load products on mount
  useEffect(() => {
    ApiService.getProducts().then(data => {
      setProducts(data);
      // Initialize with default sample if cart is empty
      const savedCart = localStorage.getItem('outfit_pos_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart([
            { ...data[0], qty: 1 },
            { ...data[1], qty: 1 }
          ]);
        }
      } else {
        setCart([
          { ...data[0], qty: 1 },
          { ...data[1], qty: 1 }
        ]);
      }
    });
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('outfit_pos_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('outfit_pos_cart');
    }
  }, [cart]);

  // Hardware Barcode Scanner Listener (Keystroke wedge)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime.current > 100) {
        barcodeBuffer.current = '';
      }
      lastKeyTime.current = currentTime;

      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length > 2) {
          handleBarcodeScan(barcodeBuffer.current);
          barcodeBuffer.current = '';
        }
      } else if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // Audio context fallback
    }
  };

  const categories = ['All', 'Overshirts', 'Knits', 'Shirts', 'Trousers', 'Tees'];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.barcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: PosProduct) => {
    playBeep();
    setCart(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item => 
          item.sku === product.sku ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerToast(`Added ${product.name} to ticket`);
  };

  const handleBarcodeScan = async (code: string) => {
    const matched = await ApiService.lookupBarcode(code);
    if (matched) {
      addToCart(matched);
      triggerToast(`Scanned Barcode: ${matched.sku}`);
    } else {
      triggerToast(`Barcode not found: ${code}`);
    }
  };

  const handleManualBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    handleBarcodeScan(manualBarcode.trim());
    setManualBarcode('');
  };

  const updateQty = (sku: string, delta: number) => {
    setCart(prev => 
      prev
        .map(item => item.sku === sku ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    triggerToast('POS ticket cleared');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.10;
  const grandTotal = subtotal + tax;

  const handleCheckout = async (tender: 'CASH' | 'CARD' | 'ABA_KHQR' | 'BITCOIN_LN') => {
    if (cart.length === 0) return;
    const receipt: TransactionReceipt = {
      receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      tax,
      total: grandTotal,
      tenderType: tender,
      cashierName: 'Sothea Kem',
      registerId: 'Register #02',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    await ApiService.submitTransaction(receipt);
    setActiveReceipt(receipt);
    setTenderModalOpen(false);
    triggerToast(`Payment approved via ${tender}. Printing receipt...`);
  };

  const finalizeReceipt = () => {
    setActiveReceipt(null);
    setCart([]);
    triggerToast('Ready for next customer.');
  };

  const simulateBarcode = () => {
    if (products.length === 0) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    addToCart(randomProduct);
    triggerToast(`Simulated Scan: ${randomProduct.sku}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 w-full h-full">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1E2631] text-white px-4 py-2.5 rounded-[9px] shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#C84428]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LEFT: PRODUCT CATALOG & SCANNER (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-3 h-full overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-white border border-[#5A6678]/15 rounded-[9px] p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
          
          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] px-3 py-1.5 focus-within:border-[#C84428] transition-colors">
            <Search className="w-3.5 h-3.5 text-[#5A6678]" />
            <input 
              type="text" 
              placeholder="Search product name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#1E2631] focus:outline-none placeholder:text-[#8E9AA8]"
            />
          </div>

          {/* Barcode Quick Entry Form */}
          <form onSubmit={handleManualBarcodeSubmit} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] px-2.5 py-1.5">
              <Barcode className="w-3.5 h-3.5 text-[#C84428]" />
              <input 
                type="text" 
                placeholder="Scan / Type Barcode..." 
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className="w-32 bg-transparent text-xs font-mono font-bold text-[#1E2631] focus:outline-none placeholder:text-[#8E9AA8]"
              />
            </div>
            <button 
              type="submit"
              className="btn-9px bg-[#1E2631] hover:bg-[#0F172A] text-white px-2.5 py-1.5 text-xs font-bold shadow-xs"
            >
              Enter
            </button>
          </form>

          {/* Scanner Simulation & Beep Toggle */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={simulateBarcode}
              className="btn-9px bg-white border border-[#5A6678]/15 hover:border-[#C84428] text-[#1E2631] px-2.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Simulate Barcode Scanner Scan"
            >
              <Scan className="w-3.5 h-3.5 text-[#C84428]" />
              <span className="hidden sm:inline">Scan SKU</span>
            </button>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-[9px] border transition-all ${
                soundEnabled 
                  ? 'bg-orange-50/50 border-[#C84428]/30 text-[#C84428]' 
                  : 'bg-slate-100 border-[#5A6678]/15 text-[#8E9AA8]'
              }`}
              title={soundEnabled ? 'Beep Audio Enabled' : 'Beep Audio Muted'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="p-1.5 rounded-[9px] bg-white border border-[#5A6678]/15 hover:bg-slate-100 text-[#5A6678] transition-all"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Category Pills (Strict 2px) */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-[10px] font-extrabold text-[#5A6678] uppercase tracking-wider mr-1">
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip-2px px-2.5 py-1 text-xs font-bold transition-all border ${
                selectedCategory === cat 
                  ? 'bg-[#C84428] text-white border-[#C84428] shadow-xs' 
                  : 'bg-white text-[#5A6678] border-[#5A6678]/15 hover:border-[#C84428] hover:text-[#1E2631]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Tiles Grid (Strict 9px) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 overflow-y-auto pr-1 flex-1">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              className="card-9px bg-white border border-[#5A6678]/15 p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-[#C84428] hover:-translate-y-0.5 transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#5A6678] font-mono">
                  <span>{product.sku}</span>
                  <span className="badge-2px px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-bold">
                    {product.stock} in stock
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs text-[#1E2631] mt-1 line-clamp-2 leading-snug group-hover:text-[#C84428] transition-colors">
                  {product.name}
                </h4>
                <p className="text-[10px] text-[#5A6678] font-medium mt-0.5">
                  {product.color} &bull; Size {product.size}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 mt-auto">
                <span className="font-mono font-black text-xs text-[#1E2631]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-[10px] font-extrabold text-[#C84428] flex items-center gap-0.5 group-hover:underline">
                  <Plus className="w-3 h-3" /> Add
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT: POS CART TICKET (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-3 h-full">
        
        <div className="bg-white/90 backdrop-blur-xl border border-[#5A6678]/15 rounded-[9px] p-3.5 flex flex-col gap-3 h-full shadow-xs">
          
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-[#5A6678]/15 pb-2">
            <div>
              <h3 className="font-display font-black text-xs text-[#1E2631] uppercase tracking-wide flex items-center gap-1.5">
                <ReceiptText className="w-3.5 h-3.5 text-[#C84428]" />
                <span>Active Sales Ticket</span>
              </h3>
              <p className="text-[10px] text-[#5A6678] font-mono">Terminal #02 &bull; Shift POS</p>
            </div>
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="chip-2px text-[10px] font-bold text-red-600 hover:bg-red-50 border border-red-200 px-2 py-0.5 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Cart Stream */}
          <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#8E9AA8] text-xs font-medium py-12 text-center">
                <Barcode className="w-8 h-8 opacity-40 mb-2" />
                <span>Ticket is empty.</span>
                <span className="text-[10px]">Scan or click a product tile.</span>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.sku}
                  className="bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] p-2 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-bold text-[#1E2631] truncate">{item.name}</h5>
                    <p className="text-[10px] text-[#5A6678] font-mono">
                      {item.sku} &bull; ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateQty(item.sku, -1)}
                      className="w-5 h-5 rounded-[2px] bg-white border border-[#5A6678]/15 hover:bg-slate-100 text-[#1E2631] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-mono text-xs font-bold w-4 text-center">
                      {item.qty}
                    </span>
                    <button 
                      onClick={() => updateQty(item.sku, 1)}
                      className="w-5 h-5 rounded-[2px] bg-white border border-[#5A6678]/15 hover:bg-slate-100 text-[#1E2631] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Box */}
          <div className="bg-[#F8F7F4] border border-[#5A6678]/15 rounded-[9px] p-2.5 flex flex-col gap-1 mt-auto">
            <div className="flex justify-between text-[11px] text-[#5A6678]">
              <span>Subtotal ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
              <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#5A6678]">
              <span>VAT / Tax (10%)</span>
              <span className="font-mono font-bold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-black text-[#1E2631] border-t border-dashed border-slate-300 pt-1.5 mt-0.5">
              <span>Total Due</span>
              <span className="font-mono text-[#C84428] text-base font-black">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Tender CTA */}
          <button 
            disabled={cart.length === 0}
            onClick={() => setTenderModalOpen(true)}
            className="btn-9px w-full py-2.5 bg-[#C84428] hover:bg-[#B33920] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wider"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Tender &bull; ${grandTotal.toFixed(2)}</span>
          </button>

        </div>

      </div>

      {/* PAYMENT TENDER MODAL */}
      {tenderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#5A6678]/20 rounded-[9px] max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-sm text-[#1E2631] uppercase tracking-wide">
                Select Payment Tender
              </h3>
              <button 
                onClick={() => setTenderModalOpen(false)}
                className="text-[#5A6678] hover:text-[#1E2631] text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="text-center py-3 bg-[#F8F7F4] rounded-[9px] border border-[#5A6678]/15">
              <span className="text-[11px] text-[#5A6678] font-bold uppercase tracking-wider">Total Due</span>
              <div className="font-mono font-black text-2xl text-[#C84428] mt-0.5">
                ${grandTotal.toFixed(2)} USD
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => handleCheckout('CASH')}
                className="btn-9px p-3 border border-[#5A6678]/15 hover:border-[#C84428] hover:bg-orange-50/30 flex flex-col items-center gap-1.5 transition-all text-[#1E2631]"
              >
                <Banknote className="w-5 h-5 text-[#C84428]" />
                <span className="text-xs font-bold">Cash Currency</span>
              </button>

              <button 
                onClick={() => handleCheckout('CARD')}
                className="btn-9px p-3 border border-[#5A6678]/15 hover:border-[#C84428] hover:bg-orange-50/30 flex flex-col items-center gap-1.5 transition-all text-[#1E2631]"
              >
                <CreditCard className="w-5 h-5 text-[#C84428]" />
                <span className="text-xs font-bold">Visa / Mastercard</span>
              </button>

              <button 
                onClick={() => handleCheckout('ABA_KHQR')}
                className="btn-9px p-3 border border-[#5A6678]/15 hover:border-sky-500 hover:bg-sky-50/30 flex flex-col items-center gap-1.5 transition-all text-[#1E2631]"
              >
                <QrCode className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold">ABA KHQR Pay</span>
              </button>

              <button 
                onClick={() => handleCheckout('BITCOIN_LN')}
                className="btn-9px p-3 border border-[#5A6678]/15 hover:border-amber-500 hover:bg-amber-50/30 flex flex-col items-center gap-1.5 transition-all text-[#1E2631]"
              >
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">Lightning POS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPT MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#5A6678]/20 rounded-[9px] max-w-sm w-full p-5 flex flex-col gap-3 shadow-2xl font-mono text-xs text-[#1E2631] animate-in zoom-in-95">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <div className="font-display font-black text-base tracking-wider">OUTFIT STORE</div>
              <div className="text-[10px] text-[#5A6678]">theoufit.kesararamwithdigital.tech</div>
              <div className="text-[10px] text-[#5A6678] mt-1">{activeReceipt.receiptNo} &bull; {activeReceipt.timestamp}</div>
            </div>

            <div className="flex flex-col gap-1.5 py-2 border-b border-dashed border-slate-300 max-h-48 overflow-y-auto">
              {activeReceipt.items.map(item => (
                <div key={item.sku} className="flex justify-between text-[11px]">
                  <span>{item.qty}x {item.name}</span>
                  <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 text-[11px] pt-1">
              <div className="flex justify-between text-[#5A6678]">
                <span>Subtotal</span>
                <span>${activeReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5A6678]">
                <span>VAT / Tax (10%)</span>
                <span>${activeReceipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-1">
                <span>TOTAL PAID ({activeReceipt.tenderType})</span>
                <span className="text-[#C84428]">${activeReceipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
              <button 
                onClick={finalizeReceipt}
                className="btn-9px flex-1 py-2.5 bg-[#C84428] hover:bg-[#B33920] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print &bull; Next Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
