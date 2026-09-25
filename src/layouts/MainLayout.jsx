import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function MainLayout({ products = [] }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header onOpenCart={() => setIsCartOpen(true)} products={products} />
      
      {/* Fixed: Added slate-50 for light mode and moved dark style behind dark: prefix */}
      <main className="flex-1 w-full bg-slate-50 dark:bg-[#090d16]">
        <Outlet />
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}