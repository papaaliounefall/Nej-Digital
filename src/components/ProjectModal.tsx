import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Sparkles, Building2, User, Mail, Phone } from 'lucide-react';
import { useModalDismiss } from '../hooks/useModalDismiss';

// Temporary inbox until nej-digitale.sn has real email hosting configured.
const CONTACT_EMAIL = 'nejdigital0@gmail.com';

// Web3Forms access key tied to CONTACT_EMAIL — safe to expose client-side,
// it only routes submissions to that inbox, it isn't a secret credential.
const WEB3FORMS_ACCESS_KEY = 'bb8ceb4c-63c0-45d1-90c1-bf3bbf1b8516';

const SECTORS = [
  'Commerce Digital',
  'Éducation & Orientation',
  'Agriculture & Logistique',
  'Ville intelligente & Événementiel',
  'Sport & Réservation',
  'Mobilité & Location',
  'Transformation Digitale d\'Entreprise',
  'Partenariat Institutionnel / Investissement',
  'Autre projet numérique'
];

// "Explorer X" on a product card passes the product's name (e.g. "SunuMall"),
// not a sector label — map it to the matching option so it's pre-selected.
const PRODUCT_NAME_TO_SECTOR: Record<string, string> = {
  SunuMall: 'Commerce Digital',
  OrientaSn: 'Éducation & Orientation',
  AgriMarket: 'Agriculture & Logistique',
  HadraSmart: 'Ville intelligente & Événementiel',
  MiniFoot: 'Sport & Réservation',
  SunuCar: 'Mobilité & Location'
};

function resolveSector(defaultCategory?: string): string {
  if (!defaultCategory) return SECTORS[0];
  if (SECTORS.includes(defaultCategory)) return defaultCategory;
  return PRODUCT_NAME_TO_SECTOR[defaultCategory] || SECTORS[0];
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  defaultCategory
}) => {
  const [sector, setSector] = useState(() => resolveSector(defaultCategory));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [budgetTier, setBudgetTier] = useState('Étape d\'amorçage / MVP');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'api' | 'mailto' | null>(null);

  useModalDismiss(isOpen, onClose);

  // The component stays mounted between opens (App.tsx renders it unconditionally),
  // so re-sync the selected sector each time it opens with a possibly new category.
  useEffect(() => {
    if (isOpen) setSector(resolveSector(defaultCategory));
  }, [isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const subject = `Nouveau projet — ${sector}`;
    const body = [
      `Nom : ${name}`,
      `Email : ${email}`,
      `Téléphone : ${phone || 'Non renseigné'}`,
      `Organisation : ${organization || 'Non renseignée'}`,
      `Domaine : ${sector}`,
      `Budget / étape : ${budgetTier}`,
      '',
      'Description du besoin :',
      description
    ].join('\n');

    try {
      // FormData (not JSON) avoids a CORS preflight that Web3Forms doesn't answer.
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', subject);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('telephone', phone || 'Non renseigné');
      formData.append('organisation', organization || 'Non renseignée');
      formData.append('domaine', sector);
      formData.append('budget', budgetTier);
      formData.append('message', description);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Web3Forms request failed');
      setDeliveryMethod('api');
      setSubmitted(true);
    } catch {
      // Automatic send failed (offline, service down...) — fall back to the
      // visitor's own mail client so the request isn't silently lost.
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setDeliveryMethod('mailto');
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setDeliveryMethod(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#111827] border border-[#1F2937] p-6 sm:p-8 shadow-2xl text-left animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#0A0B0E] border border-[#1F2937] text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer la modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F2937] border border-[#374151] text-[10px] font-mono tracking-widest text-[#3B82F6] uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>INITIATION DE PROJET & PARTENARIAT</span>
              </div>
              <h3 id="project-modal-title" className="font-display font-black text-2xl sm:text-3xl text-white">
                Parlons de votre projet.
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1.5 leading-relaxed">
                Partagez-nous votre vision. Notre équipe d'ingénierie et de produit à Dakar vous répondra sous 24 heures avec une proposition méthodologique claire.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sector selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 uppercase tracking-wider">
                  1. Quel est votre domaine ou objectif ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SECTORS.map((sec) => (
                    <button
                      type="button"
                      key={sec}
                      onClick={() => setSector(sec)}
                      className={`px-3 py-2.5 text-xs text-left transition-all border ${
                        sector === sec
                          ? 'bg-[#1F2937] border-[#3B82F6] text-[#3B82F6] font-bold'
                          : 'bg-[#0A0B0E] border-[#1F2937] text-[#9CA3AF] hover:bg-[#151D2F] hover:text-white'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6B7280] font-bold mb-1">Votre Nom & Prénom *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Papa Ndiaye"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6B7280] font-bold mb-1">Email Professionnel *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="p.ndiaye@entreprise.sn"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6B7280] font-bold mb-1">Téléphone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6B7280] font-bold mb-1">Entreprise / Organisation</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Nom de l'entité"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#6B7280] font-bold mb-1">Description de votre besoin / problème à résoudre *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez en quelques lignes le problème que vous souhaitez adresser, vos utilisateurs cibles et vos attentes..."
                  className="w-full p-3 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl cursor-pointer uppercase tracking-wider"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSending ? 'Envoi en cours...' : 'Envoyer ma demande à l\'équipe NEJ'}</span>
                </button>
                <div className="text-[10px] text-center text-[#6B7280] font-mono mt-2 uppercase tracking-wider">
                  🔒 Données strictement confidentielles · Zéro spam
                </div>
              </div>

            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-[#1F2937] text-[#3B82F6] flex items-center justify-center mx-auto border border-[#3B82F6]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {deliveryMethod === 'api' ? (
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-white">
                  Demande envoyée avec succès
                </h3>
                <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                  Merci <strong className="text-white">{name || 'à vous'}</strong>. Votre demande concernant <span className="text-[#3B82F6]">{sector}</span> a bien été transmise à l'équipe NEJ Digitale.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-white">
                  Votre messagerie s'est ouverte
                </h3>
                <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                  L'envoi automatique n'a pas pu aboutir, mais pas d'inquiétude : un e-mail pré-rempli avec votre demande a été préparé — il ne reste qu'à cliquer sur « Envoyer » dans votre logiciel de messagerie.
                </p>
              </div>
            )}

            <div className="p-4 bg-[#0A0B0E] border border-[#1F2937] text-xs text-[#9CA3AF] max-w-md mx-auto text-left space-y-1.5">
              {deliveryMethod === 'api' ? (
                <>
                  <div>1. Votre demande est arrivée dans notre boîte : <span className="text-white">{CONTACT_EMAIL}</span></div>
                  <div>2. Réponse de notre équipe sous 24h ouvrées</div>
                </>
              ) : (
                <>
                  <div>1. Vérifiez le message pré-rempli dans votre client mail</div>
                  <div>2. Envoyez-le à <span className="text-white">{CONTACT_EMAIL}</span></div>
                  <div>3. Réponse de notre équipe sous 24h ouvrées</div>
                </>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-white text-[#0A0B0E] font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer uppercase tracking-wider"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
