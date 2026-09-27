import React, { useState } from 'react';
import { ShoppingBag, GraduationCap, Sprout, Landmark, Trophy, Car, ArrowUpRight, Layers } from 'lucide-react';
import { PRODUCTS } from '../data/nejData';
import { Product } from '../types';
import { ProductInfoModal } from './ProductInfoModal';
import { Reveal } from './Reveal';

const getProductIcon = (id: string) => {
  switch (id) {
    case 'sunumall': return ShoppingBag;
    case 'orientasn': return GraduationCap;
    case 'agrimarket': return Sprout;
    case 'hadrasmart': return Landmark;
    case 'minifoot': return Trophy;
    case 'sunucar': return Car;
    default: return Layers;
  }
};

interface ProjectsGridProps {
  /** If set, only render the first N products (used for the Home preview). */
  limit?: number;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ limit }) => {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const products = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => {
          const Icon = getProductIcon(product.id);
          return (
            <Reveal key={product.id} delayMs={(idx % 3) * 70} className="h-full">
            <div
              className="h-full bg-[#111827] border border-[#1F2937] overflow-hidden hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-[#0A0B0E]">
                  <img
                    src={product.imageUrl}
                    alt={`Aperçu de l'interface ${product.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-[#0A0B0E]/90 border border-[#1F2937] text-white">
                    {product.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">{product.category}</span>
                  </div>

                  <h3 className="font-display font-black text-xl text-white mb-1 group-hover:text-[#3B82F6] transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-sm text-[#3B82F6] font-medium mb-3">{product.tagline}</div>
                  <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setDetailProduct(product)}
                  className="w-full py-3 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#3B82F6] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>En savoir plus</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                </button>
              </div>
            </div>
            </Reveal>
          );
        })}
      </div>

      <ProductInfoModal product={detailProduct} onClose={() => setDetailProduct(null)} />
    </>
  );
};
