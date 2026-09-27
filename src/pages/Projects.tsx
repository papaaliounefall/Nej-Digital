import React from 'react';
import { Layers } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';
import { ProjectsGrid } from '../components/ProjectsGrid';

export const Projects: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-14">
          <SectionKicker icon={Layers} label="L'écosystème de produits NEJ" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-tight mb-4">
            Des idées qui deviennent des produits.
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Nous développons des solutions dans des secteurs où le numérique peut créer une véritable différence, au Sénégal et en Afrique de l'Ouest.
          </p>
        </Reveal>

        <ProjectsGrid />
      </div>
    </section>
  );
};
