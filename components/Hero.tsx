import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Instagram, Phone } from 'lucide-react';
import { ASSETS } from '../assets';

const HERO_SLIDES = [
  {
    id: 1,
    image: ASSETS.food.nashville,
    name: "Nashville",
    subName: "Burger",
    price: "₹16.00"
  },
  {
    id: 2,
    image: ASSETS.food.loadedFries,
    name: "Loaded",
    subName: "Fries",
    price: "₹100.00"
  },
  {
    id: 3,
    image: ASSETS.food.brownieTriple,
    name: "Triple Choc",
    subName: "Brownie",
    price: "₹6.00"
  },
  {
    id: 4,
    image: ASSETS.food.mojitoGreen,
    name: "Green Apple",
    subName: "Mojito",
    price: "₹5.00"
  }
];

interface HeroProps {
  onOpenTeam: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenTeam }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000); // Cycle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden">
      
      {/* Top Right Team Button */}
      <button 
        onClick={onOpenTeam}
        className="absolute top-6 right-6 z-50 px-6 py-2 bg-black/30 backdrop-blur-sm hover:bg-brand-orange hover:text-brand-dark text-white border border-white/10 rounded-full transition-all duration-300 font-serif italic text-sm tracking-wide group"
      >
        <span className="group-hover:not-italic group-hover:font-bold">Our Team</span>
      </button>

      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:pl-24 md:pr-12 z-10 pt-12 md:pt-0">
        
        {/* Brand Logo Area */}
        <div className="mb-12 md:mb-16">
            <div className="flex flex-col items-start">
                <div className="w-16 h-16 mb-4">
                    <img src={ASSETS.logo} alt="The Food Truck Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>
                <h1 className="text-2xl font-serif font-bold tracking-wider text-brand-light">THE FOOD TRUCK</h1>
                <p className="text-xs text-brand-orange tracking-[0.3em] uppercase mt-1">~ Savoury & Sweet ~</p>
            </div>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
          URBAN <br />
          <span className="text-brand-light/90">FOOD EXPERIENCE</span>
        </h2>

        <p className="text-brand-muted text-sm md:text-base max-w-md leading-relaxed mb-10">
          Serving up the best broasted chicken, loaded fries, and gourmet burgers in town. 
          Don't forget to leave room for our triple chocolate brownies and refreshing mojitos.
        </p>

        {/* Contact Details Grid */}
        <div className="mt-8 md:mt-12 flex flex-col space-y-4 text-brand-muted text-xs">
          <div className="flex items-center group">
            <MapPin className="w-4 h-4 mr-3 text-brand-orange" />
            <div>
              <p>Downtown Parking, Main Street Corner</p>
            </div>
          </div>
          
          <div className="flex items-center group">
            <Instagram className="w-4 h-4 mr-3 text-brand-orange" />
            <span className="uppercase tracking-wide">@the.food.truck</span>
          </div>

          <div className="flex items-center group">
            <Phone className="w-4 h-4 mr-3 text-brand-orange" />
            <span className="uppercase tracking-wide">+1 555 019 2834</span>
          </div>
        </div>
      </div>

      {/* Right Content - Image & Floating Details */}
      <div className="w-full md:w-1/2 relative h-[50vh] md:h-screen bg-brand-dark">
        {/* Background texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand-dark/20 to-brand-dark z-20 pointer-events-none"></div>
        
        {/* Slideshow Images */}
        {HERO_SLIDES.map((slide, index) => (
           <div 
             key={slide.id}
             className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
             }`}
           >
              <img 
                  src={slide.image}
                  alt={`${slide.name} ${slide.subName}`} 
                  className="w-full h-full object-cover object-center opacity-90"
              />
           </div>
        ))}

        {/* Floating Price Tag with Transition */}
        <div className="absolute top-1/4 left-10 md:left-20 z-30 text-white min-h-[120px] min-w-[200px]">
           {HERO_SLIDES.map((slide, index) => (
             <div 
               key={slide.id}
               className={`absolute top-0 left-0 transition-all duration-700 ease-out transform ${
                 index === currentIndex 
                  ? 'opacity-100 translate-y-0 delay-300' // Delay text slightly for better flow
                  : 'opacity-0 translate-y-4 pointer-events-none'
               }`}
             >
                <h3 className="font-serif text-2xl italic">{slide.name}</h3>
                <h3 className="font-serif text-2xl italic mb-1">{slide.subName}</h3>
                <p className="text-brand-orange font-sans font-bold text-lg">{slide.price}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;