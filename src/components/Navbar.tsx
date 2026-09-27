import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenProjectModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProjectModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kept to the essentials: at xl the row (logo + links + CTA) has ~1216px to work
  // with inside max-w-7xl, so the full 8-link version used to force-wrap the CTA button
  // off-screen. Philosophie/ADN/Afrique remain reachable from the footer.
  const navLinks = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Positionnement', href: '#positionnement' },
    { label: 'Technologies', href: '#technologies' },
    { label: 'Réalisations', href: '#realisations' },
    { label: 'Équipe', href: '#equipe' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0B0E]/95 backdrop-blur-md border-b border-[#1F2937] shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#0A0B0E]/70 via-[#0A0B0E]/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Tag */}
          <a href="#" className="flex items-center gap-3 group">
            <img src="/logo-nej.png" alt="NEJ Digitale" className="h-9 w-auto" />
            <span className="hidden sm:inline font-display font-black text-sm tracking-tight text-[#F9FAFB] group-hover:text-[#3B82F6] transition-colors uppercase">
              Nouvelle ère de la jeunesse
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[11px] uppercase tracking-widest font-semibold text-[#9CA3AF]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#3B82F6] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Area: Project CTA */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Main Action Button */}
            <button
              id="nav-cta-button"
              onClick={onOpenProjectModal}
              className="inline-flex items-center gap-2 whitespace-nowrap px-4 2xl:px-5 py-2.5 bg-[#3B82F6] text-white hover:bg-blue-600 font-bold text-xs uppercase tracking-wide 2xl:tracking-widest transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <span>Parlons de votre projet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenProjectModal}
              className="px-3 py-1.5 bg-[#3B82F6] text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Projet
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#111827] border border-[#1F2937] text-[#9CA3AF] hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0B0E]/98 border-b border-[#1F2937] px-4 pt-4 pb-6 mt-3 animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#9CA3AF] hover:text-[#3B82F6] text-xs uppercase tracking-widest font-semibold py-2.5 border-b border-[#1F2937]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProjectModal();
                }}
                className="w-full mt-2 py-3 bg-[#3B82F6] text-white font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2"
              >
                <span>Parlons de votre projet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
