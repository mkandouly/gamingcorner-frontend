import React, { useEffect, useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function CartDrawer({ isOpen, onClose, products = [], onCheckout }) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [rendered, setRendered] = useState(isOpen);
  const [active, setActive] = useState(false);

  // Handle slide-in / slide-out timing
  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      const timer = setTimeout(() => setActive(true), 10);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      const timer = setTimeout(() => setRendered(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered) return null;

  // Hydrate local cart items: Check productData first, then fallback to item directly
  const enrichedCartItems = cart.map((item) => {
    const productData = products.find((p) => String(p.id) === String(item.id)) || {};

    // Combine properties with fallback precedence
    const name = item.name || productData.name;
    const sku = item.sku || productData.sku;
    
    // Determine raw price string or number
    const rawPrice =
      productData.sale_price ??
      productData.price ??
      item.sale_price ??
      item.price ??
      0;

    const displayPrice = Number(rawPrice) || 0;

    // Resolve Image URL
    const rawImage = item.image_url || productData.image_url;
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${API_BASE_URL}${rawImage}`
      : null;

    return {
      ...item,
      ...productData,
      name,
      sku,
      displayPrice,
      imageUrl,
    };
  });

  const subtotal = enrichedCartItems.reduce(
    (acc, item) => acc + item.displayPrice * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Fade Animation */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Slide Animation from Right */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-10 transition-transform duration-300 ease-out transform ${
          active ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="w-full sm:w-80 md:w-96 bg-white dark:bg-[#161b22] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0d1117]/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Shopping Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {enrichedCartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Add some items to get started!
                </p>
              </div>
            ) : (
              enrichedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200/80 dark:border-slate-800/80"
                >
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name || 'Product Image'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">No image</span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.name || `Product #${item.id}`}
                        </h4>
                        {item.sku && (
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block truncate">
                            {item.sku}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-semibold px-1.5 text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        ${(item.displayPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {enrichedCartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1117]/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  onClick={clearCart}
                  className="col-span-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22] text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 transition-colors flex items-center justify-center"
                >
                  Clear
                </button>
                <button
                  onClick={() => onCheckout && onCheckout(cart)}
                  className="col-span-3 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}