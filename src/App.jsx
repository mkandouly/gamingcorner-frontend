import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/HeroSlider';
import ActionButtons from './components/ActionButtons';
import BrandTicker from './components/BrandTicker';
import Footer from './components/Footer';
import LatestReleases from './components/LatestProducts';
import SubcategoryProducts from './components/SubcategoryProducts';
import ShopByBrand from './components/ShopByBrand';
import BrandProducts from './components/BrandProducts';
import axios from 'axios';

function App() {
  const [featuredSlugs, setFeaturedSlugs] = useState([]);
  const [popularBrands, setPopularBrands] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

  useEffect(() => {
    // 1. Fetch featured subcategories
    const fetchFeaturedSlugs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/subcategory/featured`);
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setFeaturedSlugs(data);
      } catch (error) {
        console.error('Error fetching featured subcategories:', error);
      }
    };

    // 2. Fetch popular brands
    const fetchPopularBrands = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/brands/featured`);
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setPopularBrands(data);
      } catch (error) {
        console.error('Error fetching popular brands:', error);
      }
    };

    fetchFeaturedSlugs();
    fetchPopularBrands();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      <Header />
      <main className="pt-[168px] md:pt-[136px]">
        <Hero />
        <ActionButtons />
        <BrandTicker />
        <LatestReleases />
        
        {/* Render Featured Subcategory Carousels */}
        {featuredSlugs.map((slug) => (
          <SubcategoryProducts key={slug} subcategorySlug={slug} />
        ))}

        {/* Shop By Brand Selector Bar */}
        <ShopByBrand />

        {/* Render Carousel for EVERY Popular Brand */}
        {popularBrands.map((brand) => (
          <BrandProducts 
            key={brand.id}
            brandId={brand.id} 
            brandName={brand.name} 
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default App;