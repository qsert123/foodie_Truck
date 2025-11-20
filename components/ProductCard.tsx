import React from 'react';
import { Info } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showIngredients, setShowIngredients] = React.useState(false);

  return (
    <div className="group relative flex flex-col items-center p-4 bg-transparent rounded-lg transition-all duration-300">
      
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex space-x-2">
        {product.isNew && (
          <span className="w-8 h-8 rounded-full border border-brand-orange text-brand-orange flex items-center justify-center text-[10px] uppercase tracking-tighter">
            New
          </span>
        )}
        {product.isHot && (
          <span className="w-8 h-8 rounded-full border border-brand-muted text-brand-muted flex items-center justify-center text-[10px] uppercase tracking-tighter">
            Ha!
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 rounded-full overflow-visible">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
        />
        
        {/* Info Icon */}
        <button
          className="absolute bottom-0 right-0 bg-brand-dark border border-brand-muted/30 rounded-full p-1 text-brand-muted hover:text-white transition-colors"
          onMouseEnter={() => setShowIngredients(true)}
          onMouseLeave={() => setShowIngredients(false)}
          aria-label="View Ingredients"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Hover Ingredient Tooltip */}
        {showIngredients && product.ingredients && (
           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-[#8B5E3C] text-white text-xs p-3 rounded shadow-xl z-50 pointer-events-none">
             <div className="font-bold mb-1 text-white/80 border-b border-white/20 pb-1">Ingredients:</div>
             <p className="leading-relaxed opacity-90">
               {product.ingredients.join(', ')}
             </p>
             {/* Triangle arrow */}
             <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-[#8B5E3C]"></div>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full flex justify-between items-end border-t border-brand-muted/10 pt-4 mt-2">
        <div className="flex flex-col">
          <span className="text-brand-light font-sans text-sm mb-1">₹{product.price.toFixed(2)}</span>
          <h3 className="text-brand-light font-serif text-lg leading-tight w-24 md:w-32">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className="text-brand-muted text-xs">{product.weight}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;