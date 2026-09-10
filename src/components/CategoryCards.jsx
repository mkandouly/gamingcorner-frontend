import React from 'react';
import { navCategories as defaultCategories } from '../data/categoriesData';

const categoryIcons = {
  'Prebuilt PCs': '🖥️',
  'PC Components': '🧩',
  'Graphics Cards': '🎮',
  'Processors & Cooling': '⚡',
  'Monitors & Gear': '⌨️',
  'Deals & Sales': '🔥',
};

export default function CategoryCards({ categories = defaultCategories }) {
  return (
    <section className="bg-slate-100 dark:bg-slate-900/60 py-10 transition-colors duration-200 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Explore Hardware
            </h2>
            <p className="text-xl font-black uppercase text-slate-900 dark:text-white">
              Browse By Category
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            ← Scroll or Swipe →
          </span>
        </div>

        {/* Horizontal Card Track */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`group flex-none w-[270px] sm:w-[290px] snap-start bg-white dark:bg-slate-950 border ${
                cat.isHot 
                  ? 'border-red-500 dark:border-red-500/80 shadow-md shadow-red-500/5' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500'
              } rounded-2xl p-5 transition-all duration-200 hover:shadow-lg dark:hover:shadow-none flex flex-col justify-between`}
            >
              <div>
                {/* Header Row: Icon & Hot Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      {cat.icon || '📦'}
                  </span>

                  {cat.isHot && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                      Hot Deal
                    </span>
                  )}
                </div>

                {/* Category Title */}
                <a href={cat.href} className="block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
                    {cat.name}
                  </h3>
                </a>

                {/* Sub-Items List */}
                {cat.items && cat.items.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-900">
                    {cat.items.slice(0, 4).map((subItem, subIdx) => (
                      <a
                        key={subIdx}
                        href={subItem.href}
                        className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <span className="truncate">• {subItem.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1">→</span>
                      </a>
                    ))}
                    
                    {cat.items.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-400 block pt-1">
                        +{cat.items.length - 4} more options
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Link */}
              <a
                href={cat.href}
                className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
              >
                <span>View All {cat.name}</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}