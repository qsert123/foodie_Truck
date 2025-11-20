import React from 'react';
import { ArrowLeft, Award, ChefHat } from 'lucide-react';
import { ASSETS } from '../assets';

interface TeamPageProps {
  onBack: () => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans bg-texture">
       {/* Nav */}
       <nav className="p-6 md:px-12 flex justify-between items-center fixed top-0 left-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
         <button onClick={onBack} className="flex items-center text-brand-muted hover:text-brand-orange transition-colors group">
           <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
           <span className="uppercase tracking-widest text-xs font-bold">Back to Menu</span>
         </button>
         <h2 className="font-serif italic text-xl text-white">The Team</h2>
       </nav>

       {/* Content */}
       <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 text-white">Meet the Creators</h1>
            <p className="text-brand-muted max-w-2xl mx-auto leading-relaxed">
              The passion, heat, and soul behind every bite you take.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
            
            {/* Chef Card */}
            <div className="flex flex-col items-center text-center group">
               <div className="relative w-72 h-96 mb-8 overflow-hidden rounded-xl border border-brand-muted/10 shadow-2xl">
                  <img src={ASSETS.team.chef} alt="Head Chef" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-0 right-0">
                     <ChefHat className="w-8 h-8 mx-auto text-brand-orange mb-2" />
                  </div>
               </div>
               <h3 className="text-3xl font-serif text-white mb-2">Marco Rossi</h3>
               <span className="text-xs uppercase tracking-widest text-brand-orange mb-6 border-b border-brand-orange/30 pb-1">Head Chef & Spice Master</span>
               <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
                 With 15 years of culinary experience across Mexico and Nashville, Marco brings the heat that makes our chicken addictive. His secret spice blend is locked in a vault, and only he knows the combination.
               </p>
            </div>

            {/* Chef Card */}
            <div className="flex flex-col items-center text-center group">
               <div className="relative w-72 h-96 mb-8 overflow-hidden rounded-xl border border-brand-muted/10 shadow-2xl">
                  <img src={ASSETS.team.chef} alt="Head Chef" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-0 right-0">
                     <ChefHat className="w-8 h-8 mx-auto text-brand-orange mb-2" />
                  </div>
               </div>
               <h3 className="text-3xl font-serif text-white mb-2">Marco Rossi</h3>
               <span className="text-xs uppercase tracking-widest text-brand-orange mb-6 border-b border-brand-orange/30 pb-1">Head Chef & Spice Master</span>
               <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
                 With 15 years of culinary experience across Mexico and Nashville, Marco brings the heat that makes our chicken addictive. His secret spice blend is locked in a vault, and only he knows the combination.
               </p>
            </div>

            {/* Owner Card */}
            <div className="flex flex-col items-center text-center group">
               <div className="relative w-72 h-96 mb-8 overflow-hidden rounded-xl border border-brand-muted/10 shadow-2xl">
                  <img src={ASSETS.team.owner} alt="The Owner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-0 right-0">
                     <Award className="w-8 h-8 mx-auto text-brand-orange mb-2" />
                  </div>
               </div>
               <h3 className="text-3xl font-serif text-white mb-2">Sarah Jenkins</h3>
               <span className="text-xs uppercase tracking-widest text-brand-orange mb-6 border-b border-brand-orange/30 pb-1">Founder & Visionary</span>
               <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
                 Sarah started The Food Truck with a single fryer and a dream. Her vision for urban street food that doesn't compromise on quality has turned a small truck into a city landmark.
               </p>
            </div>

          </div>
       </div>
    </div>
  );
}

export default TeamPage;