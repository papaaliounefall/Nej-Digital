import React from 'react';
import { PHILOSOPHY_PILLARS } from '../data/nejData';
import { Eye, Lightbulb, Hammer, RefreshCw } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

export const PhilosophySection: React.FC = () => {
  const getPillarIcon = (index: number) => {
    switch (index) {
      case 0:
        return Eye;
      case 1:
        return Lightbulb;
      case 2:
        return Hammer;
      case 3:
        return RefreshCw;
      default:
        return Eye;
    }
  };

  return (
    <section id="philosophie" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Giant Manifesto Quote */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <SectionKicker label="La philosophie NEJ" className="justify-center" />

          <blockquote className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6">
            « Nous ne construisons pas pour impressionner.{' '}
            <span className="text-[#3B82F6] block sm:inline">
              Nous construisons pour être utiles.
            </span> »
          </blockquote>

          <p className="text-[#9CA3AF] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Notre démarche méthodologique s'articule autour de quatre engagements fondamentaux, de l'immersion initiale à l'évolution pérenne.
          </p>
        </div>

        {/* 4 Pillars Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHILOSOPHY_PILLARS.map((pillar, idx) => {
            const Icon = getPillarIcon(idx);
            return (
              <div
                key={pillar.number}
                className="bg-[#111827] border border-[#1F2937] p-7 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-display font-black text-[#6B7280] group-hover:text-[#3B82F6] transition-colors">
                      {pillar.number}
                    </span>
                    <div className="w-10 h-10 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-slate-300 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-[#3B82F6] transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Subtitle / Promise */}
                  <div className="text-sm font-semibold text-[#3B82F6] mb-3 font-sans">
                    {pillar.subtitle}
                  </div>

                  {/* Body description */}
                  <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Practical Action Footer */}
                <div className="mt-8 pt-4 border-t border-[#1F2937] text-[10px] font-mono text-[#6B7280]">
                  <span className="text-slate-300 block mb-0.5 uppercase tracking-wider font-bold">En pratique :</span>
                  <span>{pillar.action}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
