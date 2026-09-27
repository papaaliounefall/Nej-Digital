import React, { useState } from 'react';
import {
  ShoppingBag,
  GraduationCap,
  Sprout,
  Landmark,
  Trophy,
  Car,
  ArrowRight,
  Layers
} from 'lucide-react';
import { PRODUCTS } from '../data/nejData';
import { SectionKicker } from './SectionKicker';

interface SolutionsEcosystemProps {
  /** Switches which product is shown in the inline preview below — no modal. */
  onSelectTab: (productId: string) => void;
  /** Opens the full product detail modal. */
  onExploreProduct: (productId: string) => void;
  selectedProductId: string;
}

export const SolutionsEcosystem: React.FC<SolutionsEcosystemProps> = ({
  onSelectTab,
  onExploreProduct,
  selectedProductId
}) => {
  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const getProductIcon = (id: string) => {
    switch (id) {
      case 'sunumall':
        return ShoppingBag;
      case 'orientasn':
        return GraduationCap;
      case 'agrimarket':
        return Sprout;
      case 'hadrasmart':
        return Landmark;
      case 'minifoot':
        return Trophy;
      case 'sunucar':
        return Car;
      default:
        return Layers;
    }
  };

  return (
    <section id="solutions" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <SectionKicker icon={Layers} label="L'écosystème de produits NEJ" />

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-tight mb-4">
            Des idées qui deviennent des produits.
          </h2>
          
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Nous développons des solutions dans des secteurs où le numérique peut créer une véritable différence.
          </p>
        </div>

        {/* Ecosystem Product Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {PRODUCTS.map((product) => {
            const isCurrent = activeProduct.id === product.id;
            const Icon = getProductIcon(product.id);
            return (
              <button
                key={product.id}
                onClick={() => onSelectTab(product.id)}
                className={`p-4 sm:p-5 text-left transition-all duration-300 border relative cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1F2937] border-[#3B82F6] shadow-xl shadow-blue-500/5'
                    : 'bg-[#111827] border-[#1F2937] hover:bg-[#151D2F] hover:border-[#374151]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 flex items-center justify-center ${
                    isCurrent ? 'bg-[#3B82F6] text-white font-bold' : 'bg-[#0A0B0E] border border-[#1F2937] text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-[#3B82F6] font-bold">
                    {product.number}
                  </span>
                </div>

                <div className="font-display font-bold text-base sm:text-lg text-white mb-1">
                  {product.name}
                </div>
                <div className="text-xs text-[#9CA3AF] font-sans truncate">
                  {product.category}
                </div>

                {isCurrent && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Product Hero Viewport */}
        <div className="bg-[#111827] border border-[#1F2937] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Product Narrative & Strategic Breakdown */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div>
                {/* Meta Badge */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 bg-[#1F2937] text-white border border-[#374151]">
                    {activeProduct.number} — {activeProduct.category}
                  </span>
                  <span className="text-[10px] text-[#3B82F6] px-2.5 py-1 bg-[#1F2937] border border-[#374151] font-bold uppercase tracking-wide">
                    {activeProduct.status}
                  </span>
                </div>

                {/* Product Name & Tagline */}
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white mb-2 uppercase">
                  {activeProduct.name}
                </h3>
                <div className="text-base sm:text-lg text-[#3B82F6] font-medium font-sans mb-6">
                  {activeProduct.tagline}
                </div>

                {/* Description */}
                <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed mb-8">
                  {activeProduct.description}
                </p>

                {/* Problem vs Solution vs Impact Matrix */}
                <div className="space-y-4 mb-8">
                  
                  {/* The Problem */}
                  <div className="p-4 bg-[#0A0B0E] border border-[#1F2937] border-l-2 border-l-rose-500">
                    <div className="text-xs font-mono font-bold uppercase text-rose-400 mb-1 flex items-center gap-1.5">
                      <span>Le Problème Résolu</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                      {activeProduct.problem}
                    </p>
                  </div>

                  {/* The NEJ Solution */}
                  <div className="p-4 bg-[#0A0B0E] border border-[#1F2937] border-l-2 border-l-[#3B82F6]">
                    <div className="text-xs font-mono font-bold uppercase text-[#3B82F6] mb-1 flex items-center gap-1.5">
                      <span>La Solution Déployée</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                      {activeProduct.solution}
                    </p>
                  </div>

                  {/* The Impact */}
                  <div className="p-4 bg-[#0A0B0E] border border-[#1F2937] border-l-2 border-l-emerald-500">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                      <span>L'Impact Mesurable</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                      {activeProduct.impact}
                    </p>
                  </div>

                </div>
              </div>

              {/* Action Button to Open Full Modal */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id={`cta-explore-${activeProduct.id}`}
                  onClick={() => onExploreProduct(activeProduct.id)}
                  className="px-8 py-4 bg-[#3B82F6] text-white hover:bg-blue-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  <span>Explorer {activeProduct.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs font-mono text-[#9CA3AF] text-center sm:text-left">
                  Cible : <span className="text-white font-semibold">{activeProduct.targetAudience}</span>
                </div>
              </div>

            </div>

            {/* Right: Real Product Screenshot */}
            <div className="lg:col-span-5">

              <div className="bg-[#0A0B0E] border border-[#1F2937] p-5 sm:p-6 shadow-2xl">

                {/* Preview Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1F2937] mb-5">
                  <span className="text-xs font-semibold text-white">Aperçu — {activeProduct.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#3B82F6]">
                    {activeProduct.status}
                  </span>
                </div>

                {/* Real Product Screenshot */}
                <div className="border border-[#1F2937] overflow-hidden">
                  <img
                    key={activeProduct.id}
                    src={activeProduct.imageUrl}
                    alt={`Aperçu de l'interface ${activeProduct.name}`}
                    className="w-full h-auto object-cover object-top"
                  />
                </div>

                {/* Key Metrics Grid */}
                <div className="mt-5 pt-4 border-t border-[#1F2937] grid grid-cols-2 gap-3">
                  {activeProduct.metrics.map((metric, idx) => (
                    <div key={idx} className="p-2.5 bg-[#111827] border border-[#1F2937]">
                      <div className="text-xs text-[#9CA3AF] font-sans">{metric.label}</div>
                      <div className="text-base font-display font-black text-[#3B82F6] mt-0.5">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
