import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';

export const NotFound: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative min-h-[60vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionKicker label="Erreur 404" className="justify-center" />
        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#F9FAFB] tracking-tight mb-6">
          Page introuvable.
        </h1>
        <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed mb-10">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <a
          href="/"
          className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-3 active:scale-95 transition-all shadow-xl"
        >
          <span>Retour à l'accueil</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
