import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import OfferModal from './components/OfferModal';
import TeamPage from './components/TeamPage';
import { Instagram, Mail, Phone, MapPin, Clock, Truck } from 'lucide-react';

const App: React.FC = () => {
  const [showOffer, setShowOffer] = useState(false);
  const [view, setView] = useState<'home' | 'team'>('home');

  useEffect(() => {
    // Show offer shortly after landing only if on home
    if (view === 'home') {
      const timer = setTimeout(() => {
        setShowOffer(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  if (view === 'team') {
    return <TeamPage onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light selection:bg-brand-orange selection:text-brand-dark font-sans bg-texture bg-fixed relative">
      
      {/* Offer Modal Overlay */}
      {showOffer && <OfferModal onClose={() => setShowOffer(false)} />}

      <main>
        <Hero onOpenTeam={() => setView('team')} />
        <ProductGrid />
        
        {/* Contact & Info Section */}
        <section id="contacts" className="w-full py-20 px-6 md:px-12 bg-[#0f0f0f] border-t border-white/5">
          <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                
                {/* Column 1: Brand & Intro */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                   <h3 className="font-serif text-2xl text-brand-light mb-6 flex items-center gap-2">
                     <Truck className="w-6 h-6 text-brand-orange" />
                     The Food Truck
                   </h3>
                   <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
                     Serving the city's best street food. From spicy Nashville burgers to decadent triple chocolate brownies. 
                     Fresh, fast, and unforgettable.
                   </p>
                   <div className="mt-8 flex space-x-4">
                      <a href="#" className="text-brand-muted hover:text-brand-orange transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-brand-muted hover:text-brand-orange transition-colors">
                        <Mail className="w-5 h-5" />
                      </a>
                   </div>
                </div>

                {/* Column 2: Contact Details */}
                <div className="flex flex-col items-center text-center">
                  <h4 className="text-brand-orange font-sans font-bold uppercase tracking-widest text-xs mb-8">Get in Touch</h4>
                  <div className="space-y-6 w-full max-w-xs">
                    <div className="flex flex-col items-center group">
                      <Mail className="w-5 h-5 text-brand-muted mb-2 group-hover:text-brand-orange transition-colors" />
                      <span className="text-sm text-brand-light">prabhu.com</span>
                    </div>
                    <div className="flex flex-col items-center group">
                      <Phone className="w-5 h-5 text-brand-muted mb-2 group-hover:text-brand-orange transition-colors" />
                      <span className="text-sm text-brand-light">+1 555 019 2834</span>
                    </div>
                    <div className="flex flex-col items-center group">
                      <Instagram className="w-5 h-5 text-brand-muted mb-2 group-hover:text-brand-orange transition-colors" />
                      <span className="text-sm text-brand-light">@prabhu</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Visit Us */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                   <h4 className="text-brand-orange font-sans font-bold uppercase tracking-widest text-xs mb-8">Find Us</h4>
                   
                   <div className="mb-6 flex flex-col items-center md:items-end">
                     <div className="flex items-center mb-2 text-brand-muted">
                        <MapPin className="w-4 h-4 mr-2 md:order-2 md:ml-2 md:mr-0" />
                        <span className="text-sm font-bold text-brand-light">City Center</span>
                     </div>
                     <p className="text-brand-muted text-sm">Corner of Main & 4th</p>
                     <p className="text-brand-muted text-sm">Downtown District</p>
                   </div>

                   <div className="flex flex-col items-center md:items-end">
                      <div className="flex items-center mb-2 text-brand-muted">
                        <Clock className="w-4 h-4 mr-2 md:order-2 md:ml-2 md:mr-0" />
                        <span className="text-sm font-bold text-brand-light">Operating Hours</span>
                      </div>
                      <p className="text-brand-muted text-sm">Tue - Sun: 11am - 10pm</p>
                      <p className="text-brand-muted text-sm">Mon: Closed</p>
                   </div>
                </div>

             </div>
          </div>
        </section>
      </main>
      
      {/* Footer Simple */}
      <footer className="w-full py-6 text-center bg-[#050505] text-brand-muted text-[10px] uppercase tracking-widest">
        <p>&copy; 2024 The Food Truck. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;