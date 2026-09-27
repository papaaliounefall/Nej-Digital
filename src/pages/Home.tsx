import React from 'react';
import { Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket, ArrowRight, Layers } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SectionKicker } from '../components/SectionKicker';
import { ProjectsGrid } from '../components/ProjectsGrid';
import { Reveal } from '../components/Reveal';
import { SERVICES } from '../data/servicesData';

const SERVICE_ICONS = [Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket];

export const Home: React.FC = () => {
  return (
    <>
      <Hero />

      {/* Domaines d'intervention (preview) */}
      <section className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <SectionKicker label="Nos domaines d'intervention" />
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight">
                Le numérique appliqué à des besoins réels.
              </h2>
            </div>
            <a href="/services/" className="shrink-0 text-xs font-mono font-bold text-[#3B82F6] hover:text-white px-4 py-2.5 bg-[#111827] hover:bg-[#3B82F6] border border-[#1F2937] hover:border-[#3B82F6] transition-colors uppercase tracking-wider inline-flex items-center gap-2">
              <span>Voir tous nos services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {SERVICES.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx];
              return (
                <div key={service.title} className="bg-[#111827] border border-[#1F2937] p-6 hover:border-[#3B82F6] transition-all duration-300">
                  <div className="w-10 h-10 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] mb-4">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white leading-snug">
                    {service.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* Nos projets (preview) */}
      <section id="projets-preview" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <SectionKicker icon={Layers} label="Nos projets" />
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight">
                Des idées qui deviennent des produits.
              </h2>
            </div>
            <a href="/projets/" className="shrink-0 text-xs font-mono font-bold text-[#3B82F6] hover:text-white px-4 py-2.5 bg-[#111827] hover:bg-[#3B82F6] border border-[#1F2937] hover:border-[#3B82F6] transition-colors uppercase tracking-wider inline-flex items-center gap-2">
              <span>Voir tous nos projets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <ProjectsGrid limit={3} />
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="py-24 lg:py-32 bg-[#0A0B0E] relative text-center">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.08] mb-6">
            Et si votre prochaine idée devenait notre prochain produit ?
          </h2>
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed mb-10">
            Entrepreneur, institution, coopérative ou investisseur — parlons de votre projet.
          </p>
          <a
            href="/contact/"
            className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-extrabold text-sm tracking-wide uppercase inline-flex items-center gap-3 active:scale-95 transition-all shadow-2xl"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </Reveal>
      </section>
    </>
  );
};
