import React, { useState, useEffect } from 'react';
import { navCategories } from '../data/categoriesData';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state: defaults to dark theme, Syncs with system preference or localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle Dark Class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleMobileCategory = (index) => {
    setActiveMobileCategory(activeMobileCategory === index ? null : index);
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b-2 border-red-600 font-sans sticky top-0 z-50 shadow-md dark:shadow-xl transition-colors duration-200">
      
      {/* ---------------- Top Utility Bar ---------------- */}
      <div className="bg-blue-900 text-white text-xs px-4 py-1.5 border-b border-blue-800/50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="tracking-wide">
              Free Express Shipping on Orders Over $150 | Local Warranty Included
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-slate-200">
            <a href="#support" className="hover:text-red-400 transition-colors">
              Tech Support
            </a>
            <a href="#track" className="hover:text-red-400 transition-colors">
              Track Order
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- Main Navbar Section ---------------- */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* LEFT: Mobile Hamburger + Logo */}
        <div className="flex items-center space-x-3 md:space-x-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden text-slate-700 dark:text-white hover:text-red-600 dark:hover:text-red-500 focus:outline-none p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors relative w-10 h-10 flex items-center justify-center"
          >
            {/* Animated Morphing Hamburger/Close Icon */}
            <div className="w-5 h-4 flex flex-col justify-between items-center relative">
              <span
                className={`w-full h-0.5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>

          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-xl tracking-wider shadow-lg shadow-red-600/30 group-hover:bg-red-500 transition-colors">
              GC
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white hidden sm:inline-block">
              GAMING<span className="text-blue-600 dark:text-blue-500">CORNER</span>
            </span>
          </a>
        </div>

        {/* CENTER: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <form 
            onSubmit={(e) => { e.preventDefault(); console.log('Searching for:', searchQuery); }} 
            className="relative w-full flex"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RTX 4090, Ryzen CPUs, Gaming Laptops..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-4 py-2.5 rounded-l-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-r-lg font-semibold transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* RIGHT: Theme Toggle, Wishlist, Cart */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <a href="#wishlist" className="relative p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-blue-600 transition-colors group">
            <svg className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </a>

          <a href="#cart" className="relative flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-lg transition-colors text-white">
            <div className="relative">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-slate-900 text-red-400 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-red-500">
                2
              </span>
            </div>
            <span className="hidden md:inline text-sm font-bold tracking-wide">$1,249.00</span>
          </a>
        </div>
      </div>

      {/* MOBILE Search Input */}
      <div className="px-4 pb-3 md:hidden">
        <form 
          onSubmit={(e) => { e.preventDefault(); console.log('Searching for:', searchQuery); }} 
          className="relative w-full flex"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search GPUs, CPUs, RAM..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-600 text-xs"
          />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-r-md text-xs font-semibold">
            Search
          </button>
        </form>
      </div>

      {/* ---------------- BOTTOM: Desktop Category Navigation with Dropdowns ---------------- */}
      <nav className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 hidden lg:block transition-colors duration-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            {navCategories.map((cat, index) => (
              <li key={index} className="relative group py-3">
                <a
                  href={cat.href}
                  className={`inline-flex items-center space-x-1.5 transition-all ${
                    cat.isHot
                      ? 'text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold'
                      : 'hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>{cat.name}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  {cat.isHot && (
                    <span className="bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/30">
                      HOT
                    </span>
                  )}
                </a>

                <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white dark:bg-slate-900 border-t-2 border-red-600 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-lg shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  {cat.items.map((subItem, subIdx) => (
                    <a
                      key={subIdx}
                      href={subItem.href}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ---------------- MOBILE MENU DRAWER (Smooth Slide & Expand) ---------------- */}
      <div
        className={`lg:hidden grid transition-all duration-300 ease-in-out border-slate-200 dark:border-slate-800 ${
          isMobileMenuOpen
            ? 'grid-rows-[1fr] opacity-100 border-t'
            : 'grid-rows-[0fr] opacity-0 border-t-0'
        }`}
      >
        <div className="overflow-hidden bg-white dark:bg-slate-950 px-4 py-2">
          <div className="space-y-1 py-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              Categories
            </span>
            
            {navCategories.map((cat, index) => (
              <div key={index} className="border-b border-slate-100 dark:border-slate-800/60 last:border-none">
                <button
                  onClick={() => toggleMobileCategory(index)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <span>{cat.name}</span>
                    {cat.isHot && <span className="text-[10px] text-red-600 dark:text-red-500 font-bold bg-red-100 dark:bg-red-950 px-1.5 py-0.5 rounded">HOT</span>}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      activeMobileCategory === index ? 'rotate-180 text-blue-600' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Sub-Items Animated Accordion */}
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    activeMobileCategory === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-6 pr-3 py-1 space-y-1 bg-slate-50 dark:bg-slate-900/50 rounded-md my-1">
                      {cat.items.map((subItem, subIdx) => (
                        <a
                          key={subIdx}
                          href={subItem.href}
                          className="block py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}