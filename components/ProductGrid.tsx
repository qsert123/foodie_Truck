import React, { useState } from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

const FILTERS = ['All', 'Savoury', 'Desserts', 'Juice'];

const ProductGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProducts = PRODUCTS.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Savoury') return p.category === 'savoury';
    if (activeFilter === 'Desserts') return p.category === 'dessert';
    if (activeFilter === 'Juice') return p.category === 'juice';
    return true;
  });

  return (
    <section className="relative z-10 w-full bg-brand-dark px-6 md:px-12 py-20 border-t border-white/5">
      
      <div className="flex flex-col md:flex-row">
        
        {/* Sidebar Filter */}
        <div className="w-full md:w-1/4 mb-12 md:mb-0">
          <h3 className="text-brand-orange font-serif text-xl md:text-2xl mb-8">
            MENU ITEMS
          </h3>
          
          <div className="flex flex-col space-y-4 items-start">
            <span className="text-brand-muted text-xs uppercase tracking-widest mb-2">Filter by:</span>
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-sm font-sans transition-all duration-300 relative pl-4 ${
                  activeFilter === filter 
                    ? 'text-white font-bold border-l-2 border-brand-orange' 
                    : 'text-brand-muted hover:text-white border-l-2 border-transparent'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;