import React from 'react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

interface FinalCtaProps {
  onOpenProjectModal: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenProjectModal }) => {
  return (
    <section id="contact" className="py-28 lg:py-36 bg-[#0A0B0E] relative overflow-hidden border-b border-[#1F2937]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <SectionKicker icon={Sparkles} label="NEJ Digitale" className="justify-center" />

        {/* Headline */}
        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-8">
          Et si votre prochaine idée devenait notre prochain produit ?
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#9CA3AF] font-normal leading-relaxed max-w-2xl mx-auto mb-12">
          Que vous soyez un entrepreneur ambitieux, une institution, une coopérative ou un investisseur, concevons des solutions qui créent un impact durable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="cta-final-build"
            onClick={onOpenProjectModal}
            className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-extrabold text-sm sm:text-base tracking-wide uppercase inline-flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl cursor-pointer"
          >
            <span>Construisons quelque chose ensemble</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <a
            id="cta-final-discover"
            href="#realisations"
            className="w-full sm:w-auto px-7 py-4 bg-[#111827] hover:bg-[#1F2937] text-white font-medium text-sm sm:text-base border border-[#1F2937] hover:border-[#3B82F6] transition-all inline-flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Layers className="w-4 h-4 text-[#3B82F6]" />
            <span>Découvrir notre travail</span>
          </a>
        </div>

        {/* Contact Coordinates Card */}
        <div className="mt-16 pt-10 border-t border-[#1F2937] grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="p-5 bg-[#111827] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Siège Opérationnel</div>
            <div className="text-sm font-semibold text-white mt-1">Dakar, Sénégal</div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">Plateau & Almadies Tech Hub</div>
          </div>
          <div className="p-5 bg-[#111827] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Échange Direct</div>
            <div className="text-sm font-semibold text-white mt-1">nejdigital0@gmail.com</div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">Réponse garantie &lt; 24h</div>
          </div>
          <div className="p-5 bg-[#111827] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Partenariats & Invest</div>
            <div className="text-sm font-semibold text-[#3B82F6] mt-1">nejdigital0@gmail.com</div>
            <div className="text-xs text-[#9CA3AF] mt-0.5">Dossier investisseur disponible</div>
          </div>
        </div>

      </div>
    </section>
  );
};
