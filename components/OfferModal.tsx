import React, { useEffect, useState } from 'react';
import { X, PartyPopper } from 'lucide-react';

interface OfferModalProps {
  onClose: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation frame for smooth entrance
    requestAnimationFrame(() => setShow(true));
  }, []);

  const handleClose = () => {
    setShow(false);
    // Wait for animation to finish before unmounting
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500 ${show ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      <div className={`relative w-full max-w-sm md:max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl border border-brand-orange/20 overflow-hidden transform transition-all duration-500 ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}`}>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 p-2 bg-black/40 hover:bg-brand-orange text-white rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Section */}
        <div className="relative h-56">
          <img 
            src="images\Desserts\brownieClassic.jpeg" 
            alt="Fresh Mojito" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
          
          <div className="absolute bottom-4 left-6">
             <span className="px-3 py-1 bg-brand-orange text-brand-dark text-xs font-bold uppercase tracking-widest rounded-sm shadow-lg">
               Big offer
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 text-center relative">
          {/* Floating Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] p-2 rounded-full border border-brand-orange/20 shadow-lg">
             <div className="bg-brand-dark p-2 rounded-full">
                <PartyPopper className="w-6 h-6 text-brand-orange" />
             </div>
          </div>

          <h2 className="mt-4 text-2xl font-serif text-white mb-2">Free Refreshment!</h2>
          <p className="text-brand-muted text-sm mb-6 leading-relaxed px-2">
            Order any <strong className="text-brand-light">Spicy Nashville Burger</strong> today and get a <span className="text-brand-orange font-bold">Green Apple Mojito</span> on the house!
          </p>

          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleClose}
              className="w-full py-3 bg-brand-orange text-brand-dark font-bold text-sm uppercase tracking-widest rounded hover:bg-white transition-colors shadow-lg shadow-brand-orange/20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;