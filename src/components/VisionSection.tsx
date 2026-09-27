import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

interface VisionSectionProps {
  onOpenProjectModal: () => void;
}

export const VisionSection: React.FC<VisionSectionProps> = ({ onOpenProjectModal }) => {
  return (
    <section id="vision" className="py-28 lg:py-36 bg-[#0A0B0E] border-b border-[#1F2937] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <SectionKicker label="Vision pérenne" className="justify-center" />

        {/* Headline */}
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-8">
          Une nouvelle ère pour une nouvelle génération.
        </h2>

        {/* Manifesto Text */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#9CA3AF] font-normal leading-relaxed max-w-3xl mx-auto mb-12">
          NEJ Digitale veut contribuer à faire émerger une génération africaine capable de{' '}
          <span className="text-white font-semibold">concevoir, développer et déployer</span>{' '}
          les technologies qui façonneront son avenir.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenProjectModal}
            className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-bold text-sm tracking-wide uppercase inline-flex items-center gap-2 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <span>Rejoindre la dynamique</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
