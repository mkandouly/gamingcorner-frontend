import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Tag, Check, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from './CartContext'; // Adjust import path as needed

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function ProductDetailsModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Prevent background scrolling when modal/page is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const imageUrl = product.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `${API_BASE_URL}${product.image_url}`
    : null;

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to store
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close detail view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left: Product Image */}
          <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 relative overflow-hidden min-h-[300px] md:min-h-[400px]">
            {product.sale_price && (
              <span className="absolute top-4 left-4 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full z-10">
                Sale
              </span>
            )}

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-contain max-h-[350px] transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="text-sm font-mono text-slate-400 dark:text-slate-600">
                No Image Available
              </div>
            )}
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div className="flex flex-col justify-between">
            <div>
              {/* SKU / Category Tag */}
              {product.sku && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 dark:text-slate-500 mb-2">
                  <Tag className="w-3.5 h-3.5" /> SKU: {product.sku}
                </div>
              )}

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 my-4 font-mono">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                  ${product.sale_price || product.price}
                </span>
                {product.sale_price && (
                  <span className="text-base text-slate-400 dark:text-slate-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed my-4 border-t border-b border-slate-100 dark:border-slate-800/80 py-4">
                {product.description || 'No description available for this item.'}
              </p>
            </div>

            {/* Actions Section */}
            <div className="space-y-6 pt-2">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-[#0d1117]">
                  <button
                    onClick={decrementQty}
                    className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 active:scale-[0.99]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart — ${(
                      (product.sale_price || product.price) * quantity
                    ).toFixed(2)}
                  </>
                )}
              </button>

              {/* Guarantee / Value props */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 justify-center">
                  <Truck className="w-3.5 h-3.5 text-indigo-500" /> Fast Delivery
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Authentic
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500" /> Easy Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}