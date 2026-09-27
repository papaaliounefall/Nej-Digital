import React from 'react';
import { DNA_VALUES } from '../data/nejData';
import { Flame, Sparkles, Activity, ShieldAlert, Rocket } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

export const DnaSection: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return Flame;
      case 1:
        return Sparkles;
      case 2:
        return Activity;
      case 3:
        return ShieldAlert;
      case 4:
        return Rocket;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="adn" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionKicker label="L'ADN NEJ Digitale" />
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight">
              Ce qui nous définit
            </h2>
          </div>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl font-normal">
            Cinq principes inaliénables qui guident chacune de nos décisions architecturales, humaines et stratégiques.
          </p>
        </div>

        {/* 5 DNA Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DNA_VALUES.map((dna, idx) => {
            const Icon = getIcon(idx);
            const isLarge = idx === 3 || idx === 4;
            return (
              <div
                key={dna.name}
                className={`bg-[#111827] border border-[#1F2937] p-7 sm:p-8 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group ${
                  isLarge && idx === 4 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-[#3B82F6] font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {dna.name}
                  </h3>

                  <div className="text-sm font-semibold text-slate-200 mb-3 font-sans">
                    {dna.headline}
                  </div>

                  <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                    {dna.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1F2937] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#6B7280] uppercase tracking-wider font-bold">Preuve concrète :</span>
                  <span className="text-slate-300 font-medium">{dna.indicator}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
