import React from 'react';
import { Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket, ArrowRight } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { SERVICES } from '../data/servicesData';

const SERVICE_ICONS = [Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket];

export const Services: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mb-16">
          <SectionKicker label="Nos services" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-6">
            Nos domaines d'intervention.
          </h1>
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
            Cinq domaines dans lesquels NEJ Digitale conçoit, développe et accompagne des solutions numériques utiles — sans surcouche technique inutile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, idx) => {
            const Icon = SERVICE_ICONS[idx];
            return (
              <div
                key={service.title}
                className="bg-[#111827] border border-[#1F2937] p-7 hover:border-[#3B82F6] transition-all duration-300 group"
              >
                <div className="w-11 h-11 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] mb-5 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#3B82F6] transition-colors">
                  {service.title}
                </h2>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white mb-1">
              Un projet dans l'un de ces domaines ?
            </h2>
            <p className="text-sm text-[#9CA3AF]">Parlons de vos objectifs et de la meilleure façon d'y répondre.</p>
          </div>
          <a
            href="/contact/"
            className="shrink-0 px-8 py-4 bg-[#3B82F6] text-white hover:bg-blue-600 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-blue-500/10"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
