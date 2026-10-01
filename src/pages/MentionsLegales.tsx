import React from 'react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';

export const MentionsLegales: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionKicker label="Informations légales" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-10">
            Mentions légales
          </h1>

          <div className="space-y-5 text-sm text-[#9CA3AF] leading-relaxed bg-[#111827] border border-[#1F2937] p-6 sm:p-8">
            <p><strong className="text-white">Éditeur :</strong> NEJ Digital, entreprise technologique et digitale basée à Dakar, République du Sénégal.</p>
            <p><strong className="text-white">Signification :</strong> Nouvelle Ère de la Jeunesse.</p>
            <p><strong className="text-white">Contact :</strong> <a href="mailto:nejdigital0@gmail.com" className="text-[#3B82F6] hover:underline">nejdigital0@gmail.com</a></p>
            <p><strong className="text-white">Hébergement :</strong> Vercel Inc. — <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#3B82F6] hover:underline">vercel.com</a></p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
