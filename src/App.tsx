/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SolutionsEcosystem } from './components/SolutionsEcosystem';
import { RealisationsSection } from './components/RealisationsSection';
import { IdentitySection } from './components/IdentitySection';
import { AfricaSection } from './components/AfricaSection';
import { TechnologySection } from './components/TechnologySection';
import { AiPragmatismSection } from './components/AiPragmatismSection';
import { TeamSection } from './components/TeamSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PRODUCTS } from './data/nejData';
import { Product } from './types';

export default function App() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalCategory, setProjectModalCategory] = useState<string>('Commerce Digital');
  const [selectedProductId, setSelectedProductId] = useState<string>('sunumall');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const handleOpenProjectModal = (category?: string) => {
    if (category) {
      setProjectModalCategory(category);
    }
    setIsProjectModalOpen(true);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setDetailProduct(prod);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F9FAFB] border-t-8 border-[#3B82F6] selection:bg-[#3B82F6]/30 selection:text-white font-sans antialiased">
      {/* Top Fixed Navbar */}
      <Navbar
        onOpenProjectModal={() => handleOpenProjectModal()}
      />

      {/* Main Sections Hierarchy */}
      <main>
        {/* 1. Hero Principal */}
        <Hero
          onOpenProjectModal={() => handleOpenProjectModal()}
        />

        {/* 2. Nos Solutions (L'Écosystème) */}
        <SolutionsEcosystem
          selectedProductId={selectedProductId}
          onSelectTab={setSelectedProductId}
          onExploreProduct={handleSelectProduct}
        />

        {/* 3. Section Réalisations (preuve sociale, dès que possible) */}
        <RealisationsSection
          onSelectProduct={handleSelectProduct}
        />

        {/* 4. Identité NEJ (Positionnement + Philosophie + ADN + Vision) */}
        <IdentitySection
          onOpenProjectModal={() => handleOpenProjectModal()}
        />

        {/* 5. Section Afrique */}
        <AfricaSection />

        {/* 6. Section Technologie */}
        <TechnologySection />

        {/* 7. Section IA (Mesurée & Pragmatique) */}
        <AiPragmatismSection />

        {/* 8. Section Équipe */}
        <TeamSection />

        {/* 9. CTA Final */}
        <FinalCta
          onOpenProjectModal={() => handleOpenProjectModal()}
        />
      </main>

      {/* Footer Institutionnel */}
      <Footer
        onOpenProjectModal={() => handleOpenProjectModal()}
      />

      {/* Interactive Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        defaultCategory={projectModalCategory}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onOpenProjectModalWithCategory={(cat) => handleOpenProjectModal(cat)}
      />
    </div>
  );
}
