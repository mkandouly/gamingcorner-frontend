// src/pages/WishlistPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useWishlist } from '../components/WishlistContext';
import { useCart } from '../components/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Your wishlist is empty</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Tap the heart icon on any product to save it here.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" /> My Wishlist
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((product) => {
          const imageUrl = product.image_url
            ? product.image_url.startsWith('http')
              ? product.image_url
              : `${API_BASE_URL}${product.image_url}`
            : null;
          const effectivePrice = Number(product.sale_price ?? product.price ?? 0) || 0;

          return (
            <div
              key={product.id}
              className="group rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col p-3.5"
            >
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative w-full h-36 md:h-44 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/80 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">No Image</div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col justify-between flex-1 mt-2.5">
                <Link to={`/product/${product.id}`} className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                  {product.name}
                </Link>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                  <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                    ${effectivePrice.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all active:scale-90"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
