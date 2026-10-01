import React from 'react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';

export const Confidentialite: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionKicker label="Vos données" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-10">
            Politique de confidentialité
          </h1>

          <div className="space-y-5 text-sm text-[#9CA3AF] leading-relaxed bg-[#111827] border border-[#1F2937] p-6 sm:p-8">
            <p><strong className="text-white">Engagement :</strong> NEJ Digital s'engage à respecter la loi n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel (CDP Sénégal) ainsi que les bonnes pratiques internationales en la matière.</p>
            <p><strong className="text-white">Données collectées :</strong> Le formulaire de contact recueille uniquement votre nom, votre e-mail, le sujet et le contenu de votre message, dans le seul but de répondre à votre demande. Il est traité par le service tiers <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-[#3B82F6] hover:underline">Web3Forms</a>, qui transmet le message par e-mail sans le stocker durablement.</p>
            <p><strong className="text-white">Sécurité :</strong> Les échanges avec ce site sont chiffrés (HTTPS). Aucune donnée n'est revendue ni cédée à des tiers à des fins publicitaires.</p>
            <p><strong className="text-white">Vos droits :</strong> Vous pouvez demander l'accès, la modification ou la suppression de vos données à tout moment via <a href="mailto:nejdigital0@gmail.com" className="text-[#3B82F6] hover:underline">nejdigital0@gmail.com</a>.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
