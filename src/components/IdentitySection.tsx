import React from 'react';
import {
  Target, Globe, Zap, ArrowRight,
  Eye, Lightbulb, Hammer, RefreshCw,
  Flame, Sparkles, Activity, ShieldAlert, Rocket
} from 'lucide-react';
import { SectionKicker } from './SectionKicker';
import { Reveal } from './Reveal';
import { PHILOSOPHY_PILLARS, DNA_VALUES } from '../data/nejData';

const METHOD_ICONS = [Eye, Lightbulb, Hammer, RefreshCw];
const DNA_ICONS = [Flame, Sparkles, Activity, ShieldAlert, Rocket];

/** Merged Positionnement + Philosophie + ADN + Vision into one identity section
 * to cut redundant "who we are" storytelling before reaching Réalisations. */
export const IdentitySection: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      tag: 'Ancrage Terrain',
      title: 'Répondre aux réalités locales',
      description: 'Nous privilégions des solutions pensées pour les réalités locales plutôt que des modèles importés tels quels. Nos outils intègrent nativement les paiements mobiles (Wave, Orange Money), le multilinguisme et les réseaux intermittents.'
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
    <section id="positionnement" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#3B82F6]/[0.02] blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Identity Header */}
        <div className="max-w-3xl mb-16">
          <SectionKicker label="Notre positionnement stratégique" />

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-6">
            Une nouvelle génération construit déjà son avenir.
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#9CA3AF] font-normal leading-relaxed border-l-2 border-[#3B82F6] pl-6">
            <p>
              <strong className="text-white font-semibold">NEJ Digital</strong> est une entreprise technologique et digitale sénégalaise qui transforme les idées et les besoins du quotidien en <span className="text-[#3B82F6] font-semibold">produits numériques utiles, accessibles et évolutifs</span>.
            </p>
            <p className="text-[#9CA3AF]">
              Notre ambition est simple : créer depuis l'Afrique des technologies capables de répondre aux réalités locales tout en portant une vision internationale.
            </p>
          </div>
        </div>

        {/* 3 Structural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={idx} delayMs={idx * 70} className="h-full">
              <div
                className="h-full bg-[#111827] border border-[#1F2937] p-8 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
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
              </Reveal>
            );
          })}
        </div>

        {/* Method Strip (ex-Philosophie) — a one-line sequence, not a detailed methodology */}
        <Reveal className="mb-20">
          <div className="text-[10px] font-mono text-[#8B93A1] uppercase tracking-widest font-bold mb-5">
            Notre méthode, en quatre temps
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1F2937] border border-[#1F2937]">
            {PHILOSOPHY_PILLARS.map((pillar, idx) => {
              const Icon = METHOD_ICONS[idx];
              return (
                <div key={pillar.number} className="bg-[#111827] p-5 flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-display font-bold text-sm text-white">{pillar.title}</div>
                    <p className="text-xs text-[#9CA3AF] mt-1 leading-snug">{pillar.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Compact Values Strip (ex-ADN) */}
        <Reveal className="bg-[#111827] border border-[#1F2937] p-8 sm:p-10 mb-20">
          <div className="text-[10px] font-mono text-[#3B82F6] uppercase tracking-widest font-bold mb-6">
            Ce qui nous définit
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {DNA_VALUES.map((dna, idx) => {
              const Icon = DNA_ICONS[idx];
              return (
                <div key={dna.name}>
                  <Icon className="w-4 h-4 text-[#3B82F6] mb-2" />
                  <div className="text-sm font-bold text-white mb-1">{dna.name}</div>
                  <div className="text-[11px] text-[#9CA3AF] leading-snug">{dna.indicator}</div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Closing Manifesto + Single CTA (ex-Vision) */}
        <Reveal className="text-center max-w-3xl mx-auto">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.08] mb-6">
            Une nouvelle ère pour une nouvelle génération.
          </h2>
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed mb-10">
            NEJ Digital veut contribuer à faire émerger une génération africaine capable de{' '}
            <span className="text-white font-semibold">concevoir, développer et déployer</span>{' '}
            les technologies qui façonneront son avenir.
          </p>
          <a
            href="/contact/"
            className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-bold text-sm tracking-wide uppercase inline-flex items-center gap-2 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <span>Rejoindre la dynamique</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </Reveal>

      </div>
    </section>
  );
};
