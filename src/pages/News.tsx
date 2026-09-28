import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';
import { SectionKicker } from '../components/SectionKicker';
import { Reveal } from '../components/Reveal';
import { NEWS_POSTS } from '../data/newsData';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const News: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0B0E] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-14">
          <SectionKicker icon={Newspaper} label="Actualités" />
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight leading-[1.08] mb-4">
            Ce qui se passe chez NEJ Digitale.
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Les dernières avancées de nos produits et de notre équipe.
          </p>
        </Reveal>

        {NEWS_POSTS.length === 0 ? (
          <Reveal className="p-10 bg-[#111827] border border-[#1F2937] text-center">
            <p className="text-sm sm:text-base text-[#9CA3AF]">
              Aucune actualité publiée pour l'instant. Revenez bientôt.
            </p>
          </Reveal>
        ) : (
          <div className="space-y-6">
            {NEWS_POSTS.map((post, idx) => (
              <Reveal key={post.slug} delayMs={idx * 80}>
                <article className="bg-[#111827] border border-[#1F2937] p-6 sm:p-8 hover:border-[#3B82F6] transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-[#0A0B0E] text-[#3B82F6] border border-[#1F2937]">
                      {post.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
                    {post.excerpt}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
