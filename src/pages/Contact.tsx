import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { ContactForm } from '../components/ContactForm';

export const Contact: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <SectionKicker label="Contact" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-4">
            Parlons de votre projet.
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Notre équipe à Dakar vous répond sous 24 heures ouvrées.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#111827] border border-[#1F2937] flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">E-mail</div>
                <a href="mailto:nejdigital0@gmail.com" className="text-sm font-semibold text-white hover:text-[#3B82F6] transition-colors">
                  nejdigital0@gmail.com
                </a>
              </div>
            </div>

            {/* TODO: remplacer par le vrai numéro professionnel avant mise en ligne */}
            <div className="p-5 bg-[#111827] border border-[#1F2937] flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Téléphone</div>
                <div className="text-sm font-semibold text-white">Sur demande par e-mail</div>
              </div>
            </div>

            <div className="p-5 bg-[#111827] border border-[#1F2937] flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold">Localisation</div>
                <div className="text-sm font-semibold text-white">Dakar, Sénégal</div>
              </div>
            </div>

            {/* TODO: remplacer par les vraies URLs de profils avant mise en ligne */}
            <div className="p-5 bg-[#111827] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider font-bold mb-3">Réseaux sociaux</div>
              <div className="flex items-center gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn NEJ Digitale" className="w-9 h-9 bg-[#0A0B0E] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram NEJ Digitale" className="w-9 h-9 bg-[#0A0B0E] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook NEJ Digitale" className="w-9 h-9 bg-[#0A0B0E] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X (Twitter) NEJ Digitale" className="w-9 h-9 bg-[#0A0B0E] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
