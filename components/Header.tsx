import React from 'react';
import { ShoppingBasket, Menu } from 'lucide-react';
import { NAV_LINKS } from '../constants';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between bg-gradient-to-b from-brand-dark/90 to-transparent">
      {/* Mobile Menu Icon */}
      <div className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </div>

      {/* Logo Area (Hidden on mobile usually in this design, but we keep it for clarity) */}
      <div className="hidden md:block">
         {/* Placeholder for layout balance if needed, or can be empty if logo is in Hero */}
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
        {NAV_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm font-sans text-brand-light/80 hover:text-brand-orange transition-colors uppercase tracking-wide"
          >
            {link.name}
          </a>
        ))}
      </nav>

      {/* Cart */}
      <div className="relative group cursor-pointer">
        <div className="flex items-center space-x-2 text-brand-light/80 hover:text-brand-orange transition-colors">
          <ShoppingBasket className="w-6 h-6" />
          <div className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center text-[10px] font-bold text-brand-dark">
            {cartCount}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;