import React, { useState } from 'react';
import { Send, CheckCircle2, User, Mail, Tag } from 'lucide-react';

// Temporary inbox until nejdigital.sn has real email hosting configured.
const CONTACT_EMAIL = 'nejdigital0@gmail.com';

// Web3Forms access key tied to CONTACT_EMAIL — safe to expose client-side,
// it only routes submissions to that inbox, it isn't a secret credential.
const WEB3FORMS_ACCESS_KEY = 'bb8ceb4c-63c0-45d1-90c1-bf3bbf1b8516';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'api' | 'mailto' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot: real visitors never fill this hidden field, bots usually do.
    const honeypot = (e.currentTarget.elements.namedItem('botcheck') as HTMLInputElement | null)?.value;
    if (honeypot) return;

    setIsSending(true);

    const mailBody = [`Nom : ${name}`, `Email : ${email}`, '', message].join('\n');

    try {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', subject || 'Nouveau message depuis nejdigital.sn');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Web3Forms request failed');
      setDeliveryMethod('api');
      setSubmitted(true);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
      setDeliveryMethod('mailto');
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="p-8 bg-[#111827] border border-[#1F2937] text-center space-y-4">
        <div className="w-14 h-14 bg-[#1F2937] text-[#3B82F6] flex items-center justify-center mx-auto border border-[#3B82F6]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        {deliveryMethod === 'api' ? (
          <div className="space-y-2">
            <h3 className="font-display font-black text-xl text-white">Message envoyé avec succès</h3>
            <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
              Merci <strong className="text-white">{name || 'à vous'}</strong>, votre message a bien été transmis à l'équipe NEJ Digital. Réponse sous 24h.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-display font-black text-xl text-white">Votre messagerie s'est ouverte</h3>
            <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
              L'envoi automatique n'a pas abouti : un e-mail pré-rempli a été préparé, il ne reste qu'à cliquer sur « Envoyer » dans votre client mail.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-[#111827] border border-[#1F2937] p-6 sm:p-8">
      {/* Honeypot field: hidden from sighted users and screen readers, bots tend to fill every input */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px overflow-hidden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="contact-name" className="block text-[10px] font-mono uppercase text-[#8B93A1] font-bold mb-1">
            Nom *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              id="contact-name"
              name="name"
              required
              aria-required="true"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] focus-visible:ring-2 focus-visible:ring-[#3B82F6] transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-[10px] font-mono uppercase text-[#8B93A1] font-bold mb-1">
            E-mail *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              id="contact-email"
              name="email"
              required
              aria-required="true"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.sn"
              className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] focus-visible:ring-2 focus-visible:ring-[#3B82F6] transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-[10px] font-mono uppercase text-[#8B93A1] font-bold mb-1">
          Sujet *
        </label>
        <div className="relative">
          <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            id="contact-subject"
            name="subject"
            required
            aria-required="true"
            type="text"
            autoComplete="off"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de votre message"
            className="w-full pl-9 pr-3 py-2.5 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] focus-visible:ring-2 focus-visible:ring-[#3B82F6] transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-[10px] font-mono uppercase text-[#8B93A1] font-bold mb-1">
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          aria-required="true"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez votre demande..."
          className="w-full p-3 bg-[#0A0B0E] border border-[#1F2937] text-xs text-white focus:outline-none focus:border-[#3B82F6] focus-visible:ring-2 focus-visible:ring-[#3B82F6] transition-colors"
        />
      </div>

      <label htmlFor="contact-consent" className="flex items-start gap-2.5 text-xs text-[#9CA3AF] cursor-pointer">
        <input
          id="contact-consent"
          type="checkbox"
          required
          aria-required="true"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-[#3B82F6] focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        />
        <span>
          J'accepte que ces informations soient utilisées pour traiter ma demande, conformément à la{' '}
          <a href="/confidentialite/" className="text-[#3B82F6] hover:underline">politique de confidentialité</a>.
        </span>
      </label>

      <button
        type="submit"
        disabled={isSending || !consent}
        className="w-full py-3.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl cursor-pointer uppercase tracking-wider"
      >
        <Send className="w-4 h-4 text-white" />
        <span>{isSending ? 'Envoi en cours...' : 'Envoyer'}</span>
      </button>

      <p className="text-[10px] text-[#8B93A1] text-center leading-relaxed">
        Ce formulaire est traité par le service tiers Web3Forms, qui transmet votre message par e-mail sans le stocker.
      </p>
    </form>
  );
};
