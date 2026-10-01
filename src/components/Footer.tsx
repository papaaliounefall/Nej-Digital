import React from 'react';
import { Linkedin, Instagram, Facebook, Twitter, Github, ArrowUp } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

export const Footer: React.FC = () => {
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
              <img src="/logo-nej.webp" alt="NEJ Digital" className="h-11 w-auto" width={44} height={44} />
              <div className="text-xs text-[#8B93A1] uppercase tracking-wider">
                Nouvelle Ère de la Jeunesse
              </div>
            </div>

            <p className="font-display font-semibold text-base text-slate-200 italic max-w-sm">
              « Construire depuis l'Afrique. Penser sans frontières. »
            </p>

            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm">
              Entreprise technologique et digitale sénégalaise. Nous concevons, développons et déployons des solutions logicielles d'utilité publique et d'impact économique majeur.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.linkedin.com/company/nej-digital/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="LinkedIn NEJ Digital"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/nejdigital/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Instagram NEJ Digital"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1dDcuBtPmR/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="Facebook NEJ Digital"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/NEJDigital26"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="X (Twitter) NEJ Digital"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/nejdigital26"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#111827] hover:bg-[#3B82F6] hover:text-white border border-[#1F2937] flex items-center justify-center text-slate-300 transition-colors"
                aria-label="GitHub NEJ Digital"
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
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8B93A1]">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <span>© 2026 NEJ Digital. Tous droits réservés.</span>
            <span className="hidden sm:inline text-[#374151]">|</span>
            <a
              href="/mentions-legales/"
              className="hover:text-[#3B82F6] transition-colors underline underline-offset-4"
            >
              Mentions légales
            </a>
            <span className="hidden sm:inline text-[#374151]">|</span>
            <a
              href="/confidentialite/"
              className="hover:text-[#3B82F6] transition-colors underline underline-offset-4"
            >
              Politique de confidentialité
            </a>
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
    </footer>
  );
};
