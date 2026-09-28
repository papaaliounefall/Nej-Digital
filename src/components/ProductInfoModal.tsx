import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { getProductIcon } from '../lib/productIcons';
import { useModalDismiss } from '../hooks/useModalDismiss';

interface ProductInfoModalProps {
  product: Product | null;
  onClose: () => void;
}

/** Pure content modal ("en savoir plus") — narrative only, no mechanism-level
 * detail (tech stack, feature list, problem/solution breakdown) that would
 * hand a competitor a blueprint. Contact intent is a plain link to Contact. */
export const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ product, onClose }) => {
  useModalDismiss(product !== null, onClose);

  if (!product) return null;

  const Icon = getProductIcon(product.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111827] border border-[#1F2937] p-6 sm:p-8 lg:p-10 shadow-2xl text-left animate-scaleIn"
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

        {/* No real screenshot: products aren't public yet, so no UI to expose to copycats. */}
        <div className="mb-8 relative h-40 overflow-hidden bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center">
          <span className="absolute -right-3 -bottom-8 font-display font-black text-[130px] leading-none text-[#111827] select-none" aria-hidden="true">
            {product.number}
          </span>
          <div className="relative z-10 w-16 h-16 bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#3B82F6]">
            <Icon className="w-7 h-7" />
          </div>
        </div>

        {/* Narrative: what we built and why — no mechanism-level detail */}
        <div className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed mb-8 p-5 bg-[#0A0B0E] border border-[#1F2937]">
          {product.description}
        </div>

        {/* Impact */}
        <div className="mb-8 p-4 bg-[#0A0B0E] border border-[#1F2937] border-l-2 border-l-[#3B82F6]">
          <div className="text-[10px] font-mono font-bold uppercase text-[#3B82F6] mb-1 tracking-wider">
            Impact
          </div>
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {product.impact}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mb-8 p-5 bg-[#0A0B0E] border border-[#1F2937]">
          <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold mb-3">
            Indicateurs de performance réels :
          </h3>
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
