import React from 'react';
import { REALISATIONS } from '../data/nejData';
import { ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

interface RealisationsSectionProps {
  onSelectProduct: (productId: string) => void;
}

export const RealisationsSection: React.FC<RealisationsSectionProps> = ({ onSelectProduct }) => {
  return (
    <section id="realisations" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionKicker icon={Layers} label="Portfolio & déploiements" />
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight">
              Ce que nous avons déjà construit.
            </h2>
          </div>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg font-normal">
            Des produits en exploitation réelle, confrontés aux marchés et aux utilisateurs du Sénégal et de la sous-région.
          </p>
        </div>

        {/* Editorial Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REALISATIONS.map((caseStudy) => {
            const productId = caseStudy.id.replace('-case', '');
            return (
              <div
                key={caseStudy.id}
                className="bg-[#111827] border border-[#1F2937] overflow-hidden hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Banner with Authentic Context */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.productName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
                    
                    {/* Floating sector tag */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#0A0B0E]/90 border border-[#1F2937] text-[10px] font-mono uppercase tracking-wider text-white">
                        {caseStudy.sector}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#3B82F6] bg-[#0A0B0E]/90 px-2.5 py-1 border border-[#1F2937]">
                        {caseStudy.timeline}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-[#0A0B0E]/90 px-2.5 py-1 border border-[#1F2937]">
                        {caseStudy.clientType}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8">
                    <h3 className="font-display font-black text-2xl text-white mb-3 group-hover:text-[#3B82F6] transition-colors">
                      {caseStudy.productName}
                    </h3>

                    <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                      {caseStudy.summary}
                    </p>

                    {/* Results Bullet points */}
                    <div className="space-y-2.5 pt-4 border-t border-[#1F2937]">
                      <div className="text-[10px] font-mono uppercase text-[#6B7280] font-bold tracking-wider mb-2">Résultats vérifiés :</div>
                      {caseStudy.results.map((res, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 sm:px-8 pt-0 pb-6">
                  <button
                    onClick={() => onSelectProduct(productId)}
                    className="w-full py-3 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#3B82F6] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Consulter la fiche produit détaillée</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
