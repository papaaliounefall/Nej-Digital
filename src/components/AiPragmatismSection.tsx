import React from 'react';
import { AI_PHILOSOPHY } from '../data/nejData';
import { Brain, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

export const AiPragmatismSection: React.FC = () => {
  return (
    <section id="ia" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <SectionKicker icon={Brain} label="Intelligence artificielle & pragmatisme" />

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-tight mb-6">
            {AI_PHILOSOPHY.title}
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
            <p className="font-medium text-white">
              « {AI_PHILOSOPHY.statement} »
            </p>
            <p className="text-[#9CA3AF] text-sm sm:text-base">
              {AI_PHILOSOPHY.corePrinciple} Nous refusons les gadgets génératifs sans valeur économique réelle.
            </p>
          </div>
        </div>

        {/* 4 Pragmatic Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AI_PHILOSOPHY.useCases.map((uc, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-[#1F2937] p-7 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-[#0A0B0E] text-[#3B82F6] border border-[#1F2937] uppercase tracking-wider">
                    {uc.domain}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">0{idx + 1}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {uc.title}
                </h3>

                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center gap-2 text-xs font-mono text-[#3B82F6]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Impact mesurable & opérationnel</span>
              </div>
            </div>
          ))}
        </div>

        {/* Anti-Cliché Guarantee Banner */}
        <div className="mt-12 p-6 bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-slate-200">GARANTIE NEJ : Zéro robot gadget · Zéro hallucination non vérifiée · Données protégées</span>
          </div>
          <span className="text-white font-bold">Conformité CDP Sénégal & Standards Éthiques</span>
        </div>

      </div>
    </section>
  );
};
