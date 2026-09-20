import React from 'react';
import Header from './components/Header';
import Hero from './components/HeroSlider';
import { navCategories } from './data/categoriesData';
import ActionButtons from './components/ActionButtons';
import BrandTicker from './components/BrandTicker';
import Footer from './components/Footer';
import LatestReleases from './components/LatestProducts';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      <Header />
      <main className="pt-[168px] md:pt-[136px]">
        <Hero />
        <ActionButtons />
        <BrandTicker />
        <LatestReleases />
      </main>
      <Footer />
    </div>
  );
}

export default App;