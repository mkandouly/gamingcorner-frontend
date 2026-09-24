import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout({ products = [] }) {
  // 1. Declare state for the cart drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 flex flex-col transition-colors duration-200">
      {/* 2. Pass setIsCartOpen to Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} products={products} />
      
      <main className="flex-1 w-full bg-[#090d16]">
        <Outlet />
      </main>

      <Footer />

      {/* 3. Render CartDrawer component and pass props */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}