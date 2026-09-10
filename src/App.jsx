import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryCards from './components/CategoryCards';
import { navCategories } from './data/categoriesData';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      <Header />
      <main>
        <Hero />
        <CategoryCards categories={navCategories}/>
      </main>
    </div>
  );
}

export default App;