import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Gaming Corner
              </span>
            </div>
            <p className="text-sm max-w-md text-slate-600 dark:text-slate-400">
              Your ultimate hub for custom gaming PCs, high-performance computer components, and official gaming peripherals.
            </p>
            
            {/* Newsletter Input */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Subscribe for updates & deals
              </span>
              <div className="flex max-w-md gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

          {/* About Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We specialize in precision custom rig building, component sales, and premium gaming gear. From thermal optimization to high-end hardware selection, we bring top-tier performance to gamers and tech enthusiasts.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} Gaming Corner. All rights reserved.</p>

          <a
            href="https://www.instagram.com/vexcode.lb"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
          >
            Powered by VexCode
          </a>
        </div>
      </div>
    </footer>
  );
}