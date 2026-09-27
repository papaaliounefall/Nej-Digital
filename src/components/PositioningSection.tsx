import React from 'react';
import { Target, Globe, Zap, ArrowRight } from 'lucide-react';
import { SectionKicker } from './SectionKicker';

interface PositioningSectionProps {
  onOpenProjectModal: () => void;
}

export const PositioningSection: React.FC<PositioningSectionProps> = ({ onOpenProjectModal }) => {
  const pillars = [
    {
      icon: Target,
      tag: 'Ancrage Terrain',
      title: 'Répondre aux réalités locales',
      description: 'Nous refusons de copier aveuglément des modèles occidentaux inadaptés. Nos outils intègrent nativement les paiements mobiles (Wave, Orange Money), le multilinguisme et les réseaux intermittents.'
    },
    {
      icon: Zap,
      tag: 'Exécution Rapide',
      title: 'Des produits utiles, accessibles & évolutifs',
      description: 'Chaque projet démarre par un cas d\'usage critique. Nous livrons des interfaces épurées, sans friction superflue, conçues pour être adoptées immédiatement sans formation lourde.'
    },
    {
      icon: Globe,
      tag: 'Vision Globale',
      title: 'Une ambition technologique sans frontières',
      description: 'Concevoir depuis Dakar ne signifie pas limiter son horizon. Nous appliquons les plus hauts standards d\'architecture cloud, de sécurité des données et de scalabilité internationale.'
    }
  ];

  return (
    <section id="positionnement" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#3B82F6]/[0.02] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Block */}
        <div className="max-w-3xl mb-16">
          <SectionKicker label="Notre positionnement stratégique" />

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-6">
            Une nouvelle génération construit déjà son avenir.
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-[#9CA3AF] font-normal leading-relaxed border-l-2 border-[#3B82F6] pl-6">
            <p>
              <strong className="text-white font-semibold">NEJ Digitale</strong> est une startup technologique qui transforme les idées et les besoins du quotidien en <span className="text-[#3B82F6] font-semibold">produits numériques utiles, accessibles et évolutifs</span>.
            </p>
            <p className="text-[#9CA3AF]">
              Notre ambition est simple : créer depuis l'Afrique des technologies capables de répondre aux réalités locales tout en portant une vision internationale.
            </p>
          </div>
        </div>

        {/* 3 Structural Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#111827] border border-[#1F2937] p-8 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#9CA3AF] px-2.5 py-1 bg-[#1F2937] border border-[#374151] uppercase tracking-wider font-bold">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#3B82F6] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1F2937] text-xs text-[#3B82F6] font-bold">
                  Pilier {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Quote Banner */}
        <div className="bg-[#111827] border border-[#1F2937] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-widest font-bold mb-3">
              L'IDÉE CENTRALE DE LA MARQUE
            </div>
            <div className="text-xl sm:text-2xl font-display font-black text-white leading-snug">
              « NEJ Digitale représente une nouvelle génération qui ne se contente pas d'utiliser la technologie : elle la construit. »
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-5 text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider font-bold">
              <span className="px-2.5 py-1 bg-[#1F2937] border border-[#374151] text-white">Jeunesse</span>
              <span className="px-2.5 py-1 bg-[#1F2937] border border-[#374151] text-white">Technologie</span>
              <span className="px-2.5 py-1 bg-[#1F2937] border border-[#374151] text-white">Créativité</span>
              <span className="px-2.5 py-1 bg-[#1F2937] border border-[#374151] text-white">Impact</span>
              <span className="px-2.5 py-1 bg-[#1F2937] border border-[#374151] text-white">Ambition</span>
            </div>
          </div>

          <button
            onClick={onOpenProjectModal}
            className="shrink-0 px-8 py-4 bg-[#3B82F6] text-white hover:bg-blue-600 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <span>Collaborer avec NEJ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
