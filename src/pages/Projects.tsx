import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';

// No products listed yet: none are public. This page gets real project
// cards (see ProjectsGrid + ProductInfoModal, kept ready in src/components/)
// as soon as a first product actually launches.
export const Projects: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <SectionKicker icon={Layers} label="L'écosystème de produits NEJ" className="justify-center" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-tight mb-6">
            Des solutions numériques en construction.
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed mb-4">
            NEJ Digital développe actuellement plusieurs produits numériques pensés pour répondre à des besoins concrets.
          </p>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed mb-10">
            Nos projets sont progressivement développés, testés et préparés pour leur mise en ligne. Ils seront présentés ici dès qu'ils seront disponibles.
          </p>
          <a
            href="/contact/"
            className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-3 active:scale-95 transition-all shadow-lg shadow-blue-500/10"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
};
