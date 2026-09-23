import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function ShopByBrand({ onBrandSelect }) {
  const [popularBrands, setPopularBrands] = useState([]);
  const [activeBrandId, setActiveBrandId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBrands = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/popularbrands`);
        const data = res.data?.data || res.data || [];

        if (Array.isArray(data) && data.length > 0) {
          setPopularBrands(data);
          setActiveBrandId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch popular brands:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBrands();
  }, []);

  const handleBrandClick = (brand) => {
    setActiveBrandId(brand.id);
    if (onBrandSelect) onBrandSelect(brand);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto my-6 p-8 bg-[#111111] rounded-2xl border-x-4 border-indigo-600 animate-pulse flex flex-col items-center justify-center min-h-[160px]">
        <div className="h-5 w-44 bg-neutral-800 rounded mb-2"></div>
        <div className="h-3 w-28 bg-neutral-800 rounded mb-6"></div>
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-3.5 w-20 bg-neutral-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!popularBrands.length) return null;

  return (
    <section className="w-full max-w-7xl mx-auto my-8 relative overflow-hidden rounded-2xl bg-[#111111] border-x-4 border-indigo-600 shadow-2xl py-8 px-6 text-center">
      {/* Title Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-wider uppercase">
          Shop by Brand
        </h2>
        <p className="text-xs text-neutral-400 mt-1 font-medium tracking-wide">
          Popular Brands
        </p>
      </div>

      {/* Popular Brand Names List */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 max-w-5xl mx-auto">
        {popularBrands.map((brand) => {
          const isActive = activeBrandId === brand.id;

          return (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand)}
              className={`
                relative text-xs md:text-sm font-extrabold uppercase tracking-widest transition-colors duration-200 py-1 px-0.5
                ${isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}
              `}
            >
              {brand.name}
              
              {/* Active Blue Underline Indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-indigo-600 rounded-full transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}