import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { isWebGLAvailable } from '../lib/webgl';

const HeroGlobe = lazy(() => import('./hero/HeroGlobe').then((m) => ({ default: m.HeroGlobe })));

/** Soft static glow — used while the globe loads, and as the permanent fallback without WebGL. */
const GlobeFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className="w-2/3 aspect-square rounded-full"
      style={{
        background: 'radial-gradient(circle at 40% 35%, rgba(90,162,255,0.18), rgba(10,15,28,0) 70%)'
      }}
    />
  </div>
);

export const Hero: React.FC = () => {
  const [canRenderGlobe, setCanRenderGlobe] = useState(false);

  useEffect(() => {
    setCanRenderGlobe(isWebGLAvailable());
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
      style={{ backgroundColor: '#080B12' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">

          {/* Left: Typography & Intent — ~40% on desktop */}
          <div className="lg:col-span-5 relative z-10">
            <div className="text-[11px] tracking-[0.3em] uppercase font-bold mb-6" style={{ color: '#9CA3AF' }}>
              <span style={{ color: '#3B82F6' }}>NEJ Digital</span>
              <span className="mx-2" style={{ color: '#374151' }}>/</span>
              Nouvelle ère de la jeunesse
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-black tracking-[-0.02em] mb-8"
              style={{ color: '#F5F5F2' }}
            >
              Nous construisons la technologie de la nouvelle génération.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed max-w-lg mb-10" style={{ color: '#9CA3AF' }}>
              Des produits numériques conçus depuis l'Afrique pour transformer les idées en solutions concrètes.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                id="hero-cta-projects"
                href="/projets/"
                className="bg-[#3B82F6] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all text-center inline-flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-blue-500/10"
              >
                <span>Nos projets</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                id="hero-cta-contact"
                href="/contact/"
                className="border px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5"
                style={{ borderColor: '#252B3A', color: '#F5F5F2' }}
              >
                <span>Parlons de votre projet</span>
                <ArrowUpRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
              </a>
            </div>

            {/* Micro Pillars */}
            <div className="pt-6 border-t grid grid-cols-3 gap-3 sm:gap-6 text-left" style={{ borderColor: '#1a2030' }}>
              <div>
                <span className="text-[10px] uppercase tracking-wide font-bold block mb-1" style={{ color: '#8B93A1' }}>Écosystème</span>
                <div className="font-display font-black text-lg sm:text-2xl" style={{ color: '#F5F5F2' }}>En développement</div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wide font-bold block mb-1" style={{ color: '#8B93A1' }}>Territoire</span>
                <div className="font-display font-black text-lg sm:text-2xl" style={{ color: '#3B82F6' }}>Sénégal</div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wide font-bold block mb-1" style={{ color: '#8B93A1' }}>Ambition</span>
                <div className="font-display font-black text-lg sm:text-2xl" style={{ color: '#F5F5F2' }}>Panafricaine</div>
              </div>
            </div>
          </div>

          {/* Right: 3D Globe — ~60% on desktop, allowed to bleed slightly past the section padding */}
          <div className="lg:col-span-7 relative">
            <div className="h-[280px] sm:h-[380px] md:h-[460px] lg:h-[620px] lg:-mr-10 xl:-mr-16 lg:scale-110 xl:scale-125">
              {canRenderGlobe ? (
                <Suspense fallback={<GlobeFallback />}>
                  <HeroGlobe />
                </Suspense>
              ) : (
                <GlobeFallback />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
