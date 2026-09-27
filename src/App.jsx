import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductListingPage from './pages/ProductListingPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="category/:categorySlug" element={<ProductListingPage />} />
            <Route path="category/:categorySlug/:subcategorySlug" element={<ProductListingPage />} />
            <Route path="brand/:identifier" element={<ProductListingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}