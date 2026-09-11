import React, { useState, useEffect, useRef } from 'react';

export default function HeroSlider({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Fallback state if no banners are passed from backend/props
  const activeBanners = banners.length > 0 ? banners : [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
      title: 'Next-Gen Gaming Rigs',
      link: '/category/pcs'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
      title: 'Ultimate Esports Peripherals',
      link: '/category/peripherals'
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeBanners.length) % activeBanners.length);
  };

  // Setup 3-second autoplay interval
  useEffect(() => {
    if (!isPaused && activeBanners.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, activeBanners.length]);

  // Pause autoplay on direct user interaction
  const triggerManualSwitch = (action) => {
    setIsPaused(true);
    action();
    // Resume auto-rotation after 6 seconds of inactivity
    setTimeout(() => setIsPaused(false), 6000);
  };

  if (!activeBanners.length) return null;

  return (
    <div className="container mx-auto px-4 my-6">
      <section 
        className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[500px] bg-slate-950 rounded-2xl overflow-hidden group select-none shadow-2xl border border-slate-200/20 dark:border-slate-800"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Banner Slides */}
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out transform ${
                isActive 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title || `Hero banner ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Banner Text Overlay */}
              {banner.title && (
                <div className="absolute bottom-10 sm:bottom-12 left-0 right-0 z-20 px-12 sm:px-16">
                  <div className="max-w-xl">
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                      {banner.title}
                    </h2>
                    {banner.link && (
                      <a
                        href={banner.link}
                        className="inline-flex items-center gap-2 mt-3 bg-white hover:bg-blue-50 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-xl transition-all hover:gap-3"
                      >
                        <span>Shop Now</span>
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={() => triggerManualSwitch(handlePrev)}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-slate-900/60 hover:bg-blue-600 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110 opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => triggerManualSwitch(handleNext)}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 rounded-full bg-slate-900/60 hover:bg-blue-600 text-white border border-white/10 backdrop-blur-md transition-all duration-200 hover:scale-110 opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-xl"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => triggerManualSwitch(() => setCurrentIndex(idx))}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-blue-500 shadow-lg shadow-blue-500/50'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}