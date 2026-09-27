import React, { useState } from 'react';
import { TECH_CAPABILITIES } from '../data/nejData';
import { SectionKicker } from './SectionKicker';
import {
  Globe, 
  Smartphone, 
  Cloud, 
  Database, 
  BrainCircuit, 
  Network, 
  ShieldCheck, 
  Cog,
  Check
} from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const getTechIcon = (index: number) => {
    switch (index) {
      case 0:
        return Globe;
      case 1:
        return Smartphone;
      case 2:
        return Cloud;
      case 3:
        return Database;
      case 4:
        return BrainCircuit;
      case 5:
        return Network;
      case 6:
        return ShieldCheck;
      case 7:
        return Cog;
      default:
        return Globe;
    }
  };

  return (
    <section id="technologies" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <SectionKicker label="Ingénierie & architecture logicielle" />

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight mb-4">
            La technologie au service de l'idée.
          </h2>

          <div className="p-4 bg-[#111827] border-l-2 border-[#3B82F6] max-w-2xl">
            <p className="text-base sm:text-lg font-display font-bold text-slate-200 italic">
              « Nous choisissons la technologie en fonction du problème à résoudre, jamais l'inverse. »
            </p>
          </div>
        </div>

        {/* 8 Tech Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH_CAPABILITIES.map((cap, idx) => {
            const Icon = getTechIcon(idx);
            const isHovered = selectedCategory === idx;
            return (
              <div
                key={cap.title}
                onMouseEnter={() => setSelectedCategory(idx)}
                onMouseLeave={() => setSelectedCategory(null)}
                className={`p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isHovered
                    ? 'bg-[#111827] border-[#3B82F6] shadow-xl'
                    : 'bg-[#111827] border-[#1F2937] hover:border-[#374151]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-slate-200">
                      <Icon className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <span className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-wider font-bold">
                      {cap.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {cap.title}
                  </h3>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                <div>
                  <div className="pt-4 border-t border-[#1F2937] flex flex-wrap gap-1.5">
                    {cap.tools.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#0A0B0E] text-slate-300 border border-[#1F2937]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
