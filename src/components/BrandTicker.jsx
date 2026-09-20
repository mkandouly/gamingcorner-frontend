import React from 'react';

export default function BrandTicker({ brands = [] }) {
  // Sample fallback data
  const defaultBrands = [
    { id: 1, name: 'GravaStar', logoUrl: '/uploads/gravastar.png', ref: '/brands/gravastar'},
    { id: 2, name: 'Cooler Master', logoUrl: '/uploads/coolermaster.png', ref: '/brands/coolermaster' },
    { id: 3, name: 'Keychron', logoUrl: '/uploads/keychron.png', ref: '/brands/keychron' },
    { id: 4, name: 'Fractal', logoUrl: '/uploads/fractal.png', ref: '/brands/fractal' },
    { id: 5, name: 'Lian Li', logoUrl: '/uploads/lianli.png', ref: '/brands/lianli' },
    { id: 6, name: 'Attack Shark', logoUrl: '/uploads/attackshark.png', ref: '/brands/attackshark' },
  ];

  const brandList = brands.length > 0 ? brands : defaultBrands;

  // Duplicate list to guarantee seamless loop transition
  const marqueeList = [...brandList, ...brandList];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 overflow-hidden">
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
        <div className="flex w-max animate-marquee space-x-6 hover:[animation-play-state:paused]">
          {marqueeList.map((brand, index) => (
            <a href={brand.ref}><div
              key={`${brand.id}-${index}`}
              className="flex items-center justify-center w-40 sm:w-48 h-24 sm:h-28 px-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="max-h-12 sm:max-h-16 w-auto object-contain dark:brightness-90 dark:contrast-125"
                loading="lazy"
              />
            </div></a>
          ))}
        </div>
      </div>
    </section>
  );
}