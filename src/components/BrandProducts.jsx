import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Tag } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // Adjust import path as needed

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function BrandProducts({ brandId, brandName, onOpenCart }) {
  const [products, setProducts] = useState([]);
  const [displayTitle, setDisplayTitle] = useState(brandName || '');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBrandProducts = async () => {
      const identifier = brandId || brandName;
      if (!identifier) return;
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/api/brand/${identifier}`);
        
        if (res.data?.success && res.data?.data) {
          const brandData = res.data.data;
          
          if (Array.isArray(brandData.products)) {
            setProducts(brandData.products);
          }
          if (brandData.name) {
            setDisplayTitle(brandData.name);
          }
        } 
        else if (Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error(`Failed to fetch products for brand ${identifier}:`, err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandId, brandName]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleProductCardClick = (product) => {
    // Navigates to product route and passes pre-fetched product object in state
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e, product) => {
    // Prevents opening the product page when clicking the + button
    e.stopPropagation();
    if (addToCart) {
      addToCart(product);
    }
    if (onOpenCart) {
      onOpenCart();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-indigo-600 dark:text-indigo-400 gap-2 text-xs font-medium">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading brand products...
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight capitalize flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {displayTitle || 'Brand Products'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing {products.length} product{products.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Flow Layout */}
      <div
        ref={scrollRef}
        className="grid grid-rows-2 md:grid-rows-1 grid-flow-col auto-cols-[calc(50%-0.5rem)] md:auto-cols-[calc(25%-0.75rem)] gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const imageUrl = product.image_url
            ? product.image_url.startsWith('http')
              ? product.image_url
              : `${API_BASE_URL}${product.image_url}`
            : null;

          return (
            <div
              key={product.id}
              onClick={() => handleProductCardClick(product)}
              className="
                snap-start cursor-pointer group rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 
                hover:border-indigo-500/40 shadow-sm dark:shadow-none transition-all duration-200 overflow-hidden flex flex-col justify-between p-3.5
                h-[230px] md:h-[320px]
              "
            >
              {/* Product Image */}
              <div className="relative w-full h-28 md:h-44 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/80 overflow-hidden flex items-center justify-center shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">No Image</div>
                )}

                {product.sale_price && (
                  <span className="absolute top-2 left-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    Sale
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between flex-1 mt-2.5">
                <div>
                  {product.sku && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block truncate">
                      {product.sku}
                    </span>
                  )}
                  <h3 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                      ${product.sale_price || product.price}
                    </span>
                    {product.sale_price && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Add To Cart Button (+) */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}