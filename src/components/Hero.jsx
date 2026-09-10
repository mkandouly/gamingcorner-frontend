import React, { useState } from 'react';

export default function Hero() {
  const [partCondition, setPartCondition] = useState('mixed'); // 'new', 'used', or 'mixed'

  return (
    <section className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 py-12 lg:py-20 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-block text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/40 px-3 py-1 rounded-full">
            Custom Gaming Station Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            How Are We Building Today?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Select an approach below to explore custom PCs, full room bundles, furniture, and peripherals.
          </p>
        </div>

        {/* Dual Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PATH A: CUSTOM PC BUILDER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-500/60 transition-all duration-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl">🖥️</span>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                  Tailored To Budget
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black uppercase mb-1 text-slate-900 dark:text-white">Custom PC Rig</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Mix brand-new or budget-friendly used parts. Every build is benchmarked and stress-tested.
                </p>
              </div>

              {/* Part Preference Selector */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl space-y-2">
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Part Preference:</div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-bold font-mono">
                  <button 
                    type="button"
                    onClick={() => setPartCondition('new')}
                    className={`py-1.5 rounded transition-colors ${
                      partCondition === 'new' 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    100% New
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPartCondition('mixed')}
                    className={`py-1.5 rounded transition-colors ${
                      partCondition === 'mixed' 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    New + Used
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPartCondition('used')}
                    className={`py-1.5 rounded transition-colors ${
                      partCondition === 'used' 
                        ? 'bg-red-600 text-white shadow-sm' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Best Value
                  </button>
                </div>
              </div>
            </div>

            <a href="#build-pc" className="block text-center py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-red-600/20">
              Configure Custom Rig →
            </a>
          </div>

          {/* PATH B: COMPLETE BUNDLE & FURNITURE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all duration-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl">🪑</span>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                  All-In-One Package
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black uppercase mb-1 text-slate-900 dark:text-white">Full Room Setup & Gear</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Complete battlestation bundles including PC, gaming desk, ergonomic chair, monitor, and peripherals.
                </p>
              </div>

              {/* Package Quick Items */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span> Desk & Chair
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span> High-FPS Screen
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span> Keyboard & Mouse
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span> Audio & Cable Mgmt
                </div>
              </div>
            </div>

            <a href="#bundles" className="block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-600/20">
              Shop Setup Bundles →
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}