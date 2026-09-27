import React from 'react';
import { Compass } from 'lucide-react';
import { SenegalMap } from './SenegalMap';
import { SectionKicker } from './SectionKicker';

export const AfricaSection: React.FC = () => {
  return (
    <section id="afrique" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <SectionKicker icon={Compass} label="Ancrage & ambition géographique" />

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-tight mb-6">
            Nés en Afrique. Pensés pour aller plus loin.
          </h2>

          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
            Aujourd'hui, nos six produits sont conçus et déployés depuis Dakar, au Sénégal. Notre ambition est panafricaine : chaque solution est pensée dès le départ pour pouvoir s'étendre au-delà de nos frontières, à mesure que nous grandissons.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="bg-[#111827] border border-[#1F2937] p-6 sm:p-8 lg:p-10">
          <SenegalMap />
        </div>

      </div>
    </section>
  );
};
