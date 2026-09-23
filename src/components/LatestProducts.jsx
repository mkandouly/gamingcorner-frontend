import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';

// Helper component to handle image errors gracefully
function ProductImage({ src, alt }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !src) {
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2 text-center truncate">
        {alt}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}

export default function LatestReleases({ onProductClick }) {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/latestproducts`
        );

        const productList = response.data?.data || response.data || [];
        
        if (Array.isArray(productList)) {
          setProducts(productList);
        } else {
          console.error('Expected array, received:', productList);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-slate-500 dark:text-slate-400">
        Loading latest products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center text-slate-500 dark:text-slate-400">
        No products available.
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Latest Releases
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore our newest product arrivals</p>
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

      {/* Product Grid / Scroll Container */}
      <div
        ref={scrollRef}
        className="grid grid-rows-2 md:grid-rows-1 grid-flow-col auto-cols-[calc(50%-0.5rem)] md:auto-cols-[calc(25%-0.75rem)] gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {(Array.isArray(products) ? products : []).slice(0, 10).map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick && onProductClick(product)}
            className="snap-start cursor-pointer group rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 shadow-sm dark:shadow-none transition-all duration-200 overflow-hidden flex flex-col justify-between p-3.5 h-[210px] md:h-[320px]"
          >
            {/* Image Box with Sale Badge */}
            <div className="relative w-full h-24 md:h-44 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/80 overflow-hidden flex items-center justify-center shrink-0">
              <ProductImage src={product.image_url} alt={product.name} />

              {product.sale_price && (
                <span className="absolute top-2 left-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  Sale
                </span>
              )}
            </div>

            {/* Product Meta */}
            <div className="flex flex-col justify-between flex-1 mt-2.5">
              <div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block truncate">
                  {product.sku}
                </span>
                <h3 className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mt-0.5">
                  {product.name}
                </h3>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                    ${product.sale_price || product.price}
                  </span>
                  {product.sale_price && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>

                <button 
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}