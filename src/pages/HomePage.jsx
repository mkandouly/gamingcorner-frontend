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
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicFeeds = async () => {
      try {
        setLoading(true);
        // allSettled: if one request fails, the other sections still load
        const [categoriesRes, brandsRes, bannersRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/subcategory/featured`),
          axios.get(`${API_BASE_URL}/api/brands/featured`),
          axios.get(`${API_BASE_URL}/api/banners`),
        ]);

        const pick = (res) =>
          res.status === 'fulfilled' ? res.value.data?.data || res.value.data : null;

        [categoriesRes, brandsRes, bannersRes].forEach((res) => {
          if (res.status === 'rejected') {
            console.error('Failed to load home page section:', res.reason);
          }
        });

        const catData = pick(categoriesRes);
        if (Array.isArray(catData)) setFeaturedCategories(catData);

        const brandData = pick(brandsRes);
        if (Array.isArray(brandData)) setPopularBrands(brandData);

        const bannerData = pick(bannersRes);
        if (Array.isArray(bannerData)) setBanners(bannerData);
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
      <HeroSlider
        loading={loading}
        banners={banners.map((b) => ({
          id: b.id,
          title: b.title,
          link: b.link,
          image_url: b.image_url?.startsWith('http') ? b.image_url : `${API_BASE_URL}${b.image_url || ''}`,
        }))}
      />
      <BrandTicker
        loading={loading}
        brands={popularBrands.map((b) => ({
          id: b.id,
          name: b.name,
          logoUrl: b.logo_url?.startsWith('http') ? b.logo_url : `${API_BASE_URL}${b.logo_url || ''}`,
        }))}
      />
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