import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandTicker({ brands = [], loading = false }) {
  // Skeleton while brands are loading
  if (loading) {
    return (
      <section className="py-12 bg-slate-50 dark:bg-[#080c14] transition-colors duration-200 overflow-hidden">
        <div className="text-center mb-8 px-4">
          <div className="h-8 w-64 max-w-full mx-auto rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-80 max-w-full mx-auto mt-3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="flex gap-6 px-6 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="w-40 sm:w-48 h-24 sm:h-28 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Nothing to show (no brands or the request failed)
  if (!brands.length) return null;

  // Repeat the brands so each half of the marquee is wider than any screen
  const MIN_PER_HALF = 12;
  const repeats = Math.max(1, Math.ceil(MIN_PER_HALF / brands.length));
  const half = Array.from({ length: repeats }, () => brands).flat();

  // Two identical halves: sliding by -50% lands exactly on the start of the second half
  const marqueeList = [...half, ...half];

  return (
    <section className="py-12 bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-white transition-colors duration-200 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Trusted by Leading Brands
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Official partners across gaming, business, and enterprise tech
        </p>
      </div>

      {/* Marquee Wrapper with Edge Fades */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div
          className="flex w-max animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: `${half.length * 4}s` }}
        >
          {marqueeList.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              to={`/brand/${brand.id ?? encodeURIComponent(brand.name)}`}
              className="shrink-0 pr-6"
            >
              <div
                className="flex items-center justify-center w-40 sm:w-48 h-24 sm:h-28 px-6 bg-white dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 rounded-2xl shadow-sm shrink-0 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-h-12 sm:max-h-16 w-auto object-contain brightness-100 dark:contrast-125"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}