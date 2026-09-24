// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HeroSlider from '../components/HeroSlider';
import ShopByBrand from '../components/ShopByBrand';
import BrandTicker from '../components/BrandTicker';
import LatestProducts from '../components/LatestProducts';
import SubcategoryProducts from '../components/SubcategoryProducts';
import BrandProducts from '../components/BrandProducts';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function HomePage() {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [popularBrands, setPopularBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicFeeds = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/subcategory/featured`),
          axios.get(`${API_BASE_URL}/api/brands/featured`),
        ]);

        // Safely extract subcategories array
        const catData = categoriesRes.data?.data || categoriesRes.data;
        if (Array.isArray(catData)) {
          setFeaturedCategories(catData);
        }

        // Safely extract popular brands array
        const brandData = brandsRes.data?.data || brandsRes.data;
        if (Array.isArray(brandData)) {
          setPopularBrands(brandData);
        }
      } catch (err) {
        console.error('Failed to load dynamic home page sections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicFeeds();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <HeroSlider />
      <BrandTicker />
      <LatestProducts />

      {/* Dynamic Featured Subcategory Feeds */}
      {featuredCategories.map((category, index) => {
        // Fallback checks for slug, id, or name to ensure subcategorySlug is never undefined
        const targetSlug = category.slug || category.id || category.name;

        if (!targetSlug) return null;

        return (
          <SubcategoryProducts
            key={category.id || category.slug || index}
            subcategorySlug={targetSlug}
          />
        );
      })}

      <ShopByBrand />

      {/* Dynamic Popular Brand Feeds */}
      {popularBrands.map((brand) => (
        <BrandProducts
          key={brand.id || brand.name}
          brandId={brand.id}
          brandName={brand.name}
        />
      ))}
    </div>
  );
}