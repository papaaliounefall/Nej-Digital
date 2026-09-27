import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useModalDismiss } from '../hooks/useModalDismiss';

interface ProductInfoModalProps {
  product: Product | null;
  onClose: () => void;
}

/** Pure content modal ("en savoir plus") — no lead-capture form, just the
 * product's full detail. Contact intent is a plain link to the Contact page. */
export const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ product, onClose }) => {
  useModalDismiss(product !== null, onClose);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#111827] border border-[#1F2937] p-6 sm:p-8 lg:p-10 shadow-2xl text-left animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-[#0A0B0E] border border-[#1F2937] text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pr-10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#1F2937] text-[#3B82F6] border border-[#374151]">
            {product.number} — {product.category}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 px-2.5 py-1 bg-[#0A0B0E] border border-[#1F2937]">
            Statut : {product.status}
          </span>
        </div>

        {/* Title & Tagline */}
        <h2 id="product-modal-title" className="font-display font-black text-3xl sm:text-4xl text-white mb-2 uppercase">
          {product.name}
        </h2>
        <p className="text-base sm:text-lg text-[#3B82F6] font-medium font-sans mb-6">
          {product.tagline}
        </p>

        {/* Real Product Screenshot */}
        <div className="mb-8 border border-[#1F2937] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={`Aperçu de l'interface ${product.name}`}
            loading="lazy"
            className="w-full h-auto object-cover object-top"
          />
        </div>

        {/* Long Description */}
        <div className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed mb-8 p-5 bg-[#0A0B0E] border border-[#1F2937]">
          {product.description}
        </div>

        {/* 3 Pillars: Problem, Solution (Objectif), Impact */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-[#0A0B0E] border border-[#1F2937]">
            <div className="text-[10px] font-mono font-bold uppercase text-rose-400 mb-1 tracking-wider">
              Le problème réel
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {product.problem}
            </div>
          </div>

          <div className="p-4 bg-[#0A0B0E] border border-[#1F2937]">
            <div className="text-[10px] font-mono font-bold uppercase text-[#3B82F6] mb-1 tracking-wider">
              Objectif & solution déployée
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {product.solution}
            </div>
          </div>

          <div className="p-4 bg-[#0A0B0E] border border-[#1F2937]">
            <div className="text-[10px] font-mono font-bold uppercase text-emerald-400 mb-1 tracking-wider">
              Impact concret & mesurable
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {product.impact}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold mb-3">
            Fonctionnalités clés du produit :
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-3 bg-[#0A0B0E] border border-[#1F2937]">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mb-8 p-5 bg-[#0A0B0E] border border-[#1F2937]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold mb-3">
            Indicateurs de performance réels :
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {product.metrics.map((m, idx) => (
              <div key={idx} className="p-3 bg-[#111827] border border-[#1F2937] text-center">
                <div className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono">{m.label}</div>
                <div className="text-lg sm:text-xl font-display font-black text-white mt-1">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-8">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold mb-2">
            Technologies utilisées :
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.techStack.map((tech, idx) => (
              <span key={idx} className="text-xs font-mono px-3 py-1 bg-[#0A0B0E] border border-[#1F2937] text-slate-300">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <a
            href="/contact/"
            className="px-6 py-3.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl uppercase tracking-wider"
          >
            <span>Nous contacter à ce sujet</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-3.5 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] text-xs font-mono text-slate-300 transition-colors cursor-pointer uppercase tracking-wider"
          >
            Fermer l'aperçu
          </button>
        </div>

      </div>
    </div>
  );
};
