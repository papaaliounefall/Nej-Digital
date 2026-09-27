import React, { useState } from 'react';
import { Linkedin, Instagram, Facebook, Twitter, Github, ArrowUp, X } from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';

interface FooterLink {
  label: string;
  href: string;
}

export const Footer: React.FC = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  useModalDismiss(legalModalOpen, () => setLegalModalOpen(false));
  useModalDismiss(privacyModalOpen, () => setPrivacyModalOpen(false));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navColumns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos & Vision', href: '/a-propos/' },
        { label: 'Nos services', href: '/services/' },
        { label: 'Équipe & Talents', href: '/equipe/' },
        { label: 'Actualités', href: '/actualites/' },
      ]
    },
    {
      title: 'Ressources & Contact',
      links: [
        { label: 'Nous contacter', href: '/contact/' },
        { label: 'nejdigital0@gmail.com', href: 'mailto:nejdigital0@gmail.com' },
      ]
    }
  ];

  return (
    <footer className="bg-[#0A0B0E] border-t border-[#1F2937] text-[#9CA3AF] font-sans pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#1F2937]">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo-nej.webp" alt="NEJ Digitale" className="h-11 w-auto" width={44} height={44} />
              <div className="text-xs text-[#6B7280] uppercase tracking-wider">
                Nouvelle Ère de la Jeunesse
              </div>
            </div>

            <p className="font-display font-semibold text-base text-slate-200 italic max-w-sm">
              « Construire depuis l'Afrique. Penser sans frontières. »
            </p>

            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm">
              Startup technologique et digitale africaine. Nous concevons, développons et déployons des solutions logicielles d'utilité publique et d'impact économique majeur.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/company/nej-digital/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="LinkedIn NEJ Digitale"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/nejdigital/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Instagram NEJ Digitale"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1dDcuBtPmR/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Facebook NEJ Digitale"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/NEJDigital26"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="X (Twitter) NEJ Digitale"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/nejdigital26"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="GitHub NEJ Digitale"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {navColumns.map((col, idx) => (
              <div key={idx} className="space-y-4">
                <div className="font-display font-bold text-xs uppercase tracking-widest text-white">
                  {col.title}
                </div>
                <ul className="space-y-2.5 text-xs">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="hover:text-[#3B82F6] transition-colors block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6B7280]">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <span>© 2026 NEJ Digitale. Tous droits réservés.</span>
            <span className="hidden sm:inline text-[#374151]">|</span>
            <button
              onClick={() => setLegalModalOpen(true)}
              className="hover:text-[#3B82F6] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Mentions légales
            </button>
            <span className="hidden sm:inline text-[#374151]">|</span>
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-[#3B82F6] transition-colors underline underline-offset-4 cursor-pointer"
            >
              Politique de confidentialité
            </button>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#3B82F6]" />
          </button>
        </div>

      </div>

      {/* Mentions Légales Modal */}
      {legalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setLegalModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div
            className="relative w-full max-w-lg bg-[#111827] border border-[#1F2937] p-6 shadow-2xl text-left animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLegalModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#0A0B0E] border border-[#1F2937] text-slate-400 hover:text-white"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 id="legal-modal-title" className="font-display font-bold text-xl text-white mb-4 uppercase">
              Mentions Légales — NEJ Digitale
            </h3>
            <div className="text-xs text-[#9CA3AF] space-y-3 leading-relaxed">
              <p><strong className="text-white">Éditeur :</strong> NEJ Digitale, startup technologique et digitale basée à Dakar, République du Sénégal. <em>(Statut juridique et numéro d'immatriculation à compléter dès l'enregistrement officiel de la société.)</em></p>
              <p><strong className="text-white">Signification :</strong> Nouvelle Ère de la Jeunesse.</p>
              <p><strong className="text-white">Siège social :</strong> Dakar, Sénégal. <em>(Adresse complète à préciser.)</em></p>
              <p><strong className="text-white">Directeur de la publication :</strong> <em>À compléter par l'équipe fondatrice.</em></p>
              <p><strong className="text-white">Contact :</strong> nejdigital0@gmail.com.</p>
              <p><strong className="text-white">Hébergement :</strong> <em>À compléter une fois le site déployé chez un hébergeur.</em></p>
            </div>
          </div>
        </div>
      )}

      {/* Politique de Confidentialité Modal */}
      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPrivacyModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
        >
          <div
            className="relative w-full max-w-lg bg-[#111827] border border-[#1F2937] p-6 shadow-2xl text-left animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-[#0A0B0E] border border-[#1F2937] text-slate-400 hover:text-white"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 id="privacy-modal-title" className="font-display font-bold text-xl text-white mb-4 uppercase">
              Politique de Confidentialité & Protection des Données
            </h3>
            <div className="text-xs text-[#9CA3AF] space-y-3 leading-relaxed">
              <p><strong className="text-white">Engagement :</strong> NEJ Digitale s'engage à respecter scrupuleusement la loi n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel (CDP Sénégal) ainsi que les meilleurs standards internationaux.</p>
              <p><strong className="text-white">Données collectées :</strong> Les formulaires de contact et d'expression de besoin recueillent uniquement les informations nécessaires au traitement professionnel de votre demande.</p>
              <p><strong className="text-white">Sécurité :</strong> Toutes les transmissions bénéficient d'un chiffrement TLS 1.3 de bout en bout. Aucune donnée n'est revendue ou cédée à des tiers à des fins publicitaires.</p>
              <p><strong className="text-white">Vos droits :</strong> Vous pouvez demander la modification ou suppression de vos données à tout moment via nejdigital0@gmail.com.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
