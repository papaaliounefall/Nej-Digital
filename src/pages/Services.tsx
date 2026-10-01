import React from 'react';
import { Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket, ArrowRight, Users, Package } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';
import { SERVICES } from '../data/servicesData';

const SERVICE_ICONS = [Code2, BrainCircuit, RefreshCcw, GraduationCap, Rocket];

const FAQ = [
  {
    question: 'Comment se passe une demande de devis ?',
    answer: 'Après un premier échange pour cadrer votre besoin, nous vous envoyons une proposition détaillant le périmètre, les délais et le budget estimé.'
  },
  {
    question: 'Quels sont les délais habituels ?',
    answer: 'Ils varient selon la complexité du projet et sont précisés après le cadrage initial — un MVP et une plateforme complète n\'ont pas le même calendrier.'
  },
  {
    question: 'Assurez-vous la maintenance après le lancement ?',
    answer: 'Oui, un accompagnement post-lancement peut être prévu dès le cadrage du projet, selon vos besoins.'
  },
  {
    question: 'Qui héberge la solution livrée ?',
    answer: 'Selon le projet, l\'hébergement peut être pris en charge par NEJ Digital ou transmis directement à votre organisation — ce point est précisé avant le développement.'
  },
  {
    question: 'À qui appartient le produit une fois livré ?',
    answer: 'La propriété du produit livré et de son code source vous revient, selon les termes convenus avant le début du projet.'
  }
];

export const Services: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal className="max-w-3xl mb-16">
          <SectionKicker label="Nos services" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-6">
            Nos domaines d'intervention.
          </h1>
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
            Cinq domaines dans lesquels NEJ Digital conçoit, développe et accompagne des solutions numériques utiles — sans surcouche technique inutile.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICES.map((service, idx) => {
            const Icon = SERVICE_ICONS[idx];
            return (
              <Reveal key={service.title} delayMs={idx * 70} className="h-full">
                <div className="h-full bg-[#111827] border border-[#1F2937] p-7 hover:border-[#3B82F6] transition-all duration-300 group flex flex-col">
                  <div className="w-11 h-11 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] mb-5 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#3B82F6] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-5 border-t border-[#1F2937] space-y-3">
                    <div className="flex items-start gap-2">
                      <Users className="w-3.5 h-3.5 text-[#3B82F6] mt-0.5 shrink-0" />
                      <div className="text-xs text-[#9CA3AF]">
                        <span className="text-[#8B93A1] font-mono uppercase tracking-wider text-[10px] block mb-0.5">Pour qui ?</span>
                        {service.forWho}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="w-3.5 h-3.5 text-[#3B82F6] mt-0.5 shrink-0" />
                      <div className="text-xs text-[#9CA3AF]">
                        <span className="text-[#8B93A1] font-mono uppercase tracking-wider text-[10px] block mb-0.5">Livrables</span>
                        {service.deliverables}
                      </div>
                    </div>
                    <a
                      href="/contact/"
                      className="mt-3 w-full py-2.5 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#3B82F6] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Demander un devis</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* FAQ */}
        <Reveal className="mb-16">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-6">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-[#1F2937] border-t border-b border-[#1F2937]">
            {FAQ.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm sm:text-base font-semibold text-white">
                  {item.question}
                  <span className="text-[#3B82F6] text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#9CA3AF] leading-relaxed mt-3">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal className="bg-[#111827] border border-[#1F2937] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
        </Reveal>

      </div>
    </section>
  );
};
