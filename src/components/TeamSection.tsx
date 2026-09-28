import React from 'react';
import { TEAM_MEMBERS } from '../data/nejData';
import { Linkedin, Github, MapPin, Users, Sparkles } from 'lucide-react';
import { SectionKicker } from './SectionKicker';
import { Reveal } from './Reveal';

export const TeamSection: React.FC = () => {
  return (
    <section id="equipe" className="py-24 lg:py-32 bg-[#0A0B0E] border-b border-[#1F2937] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <Reveal className="max-w-3xl mb-16">
          <SectionKicker icon={Users} label="Talents & ingénierie humaine" />

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#F9FAFB] tracking-tight mb-4">
            Derrière la technologie, des personnes.
          </h1>

          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Une équipe multidisciplinaire combinant ingénieurs logiciels, designers UX et spécialistes terrain, unis par une même exigence d'impact et de qualité.
          </p>
        </Reveal>

        {/* Core Team Members Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <Reveal key={member.name} delayMs={(idx % 4) * 70} className="h-full">
            <div
              className="h-full bg-[#111827] border border-[#1F2937] overflow-hidden hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-[#0A0B0E]">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-90" />
                  
                  {/* Location badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#0A0B0E]/90 border border-[#1F2937] text-[10px] font-mono text-slate-200">
                    <MapPin className="w-3 h-3 text-[#3B82F6]" />
                    <span>{member.location}</span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#3B82F6] transition-colors">
                    {member.name}
                  </h3>

                  <div className="mb-3 mt-0.5">
                    <div className="text-xs font-mono text-[#3B82F6] font-bold uppercase tracking-wider">
                      {member.role}
                    </div>
                    {member.secondaryRole && (
                      <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider mt-0.5">
                        {member.secondaryRole}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {member.specialty && (
                    <div className="text-[11px] font-mono text-slate-300 bg-[#0A0B0E] p-2 border border-[#1F2937]">
                      <span className="text-[#6B7280] block text-[10px] uppercase font-bold tracking-wider">Spécialité :</span>
                      {member.specialty}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links Bar */}
              {(member.linkedinUrl || member.githubUrl) && (
                <div className="p-5 pt-0 pb-5 border-t border-[#1F2937] mt-2 flex items-center gap-3">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white transition-colors"
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-[#0A0B0E] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white transition-colors"
                      aria-label={`GitHub de ${member.name}`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
            </Reveal>
          ))}
        </div>

        {/* Note: only leadership is pictured — the wider team isn't listed by name. */}
        <Reveal className="mt-8 text-center">
          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-2xl mx-auto">
            Ce noyau dirigeant est entouré d'une équipe plus large d'ingénieurs, de designers et de spécialistes qui contribuent chaque jour à la construction de nos produits.
          </p>
        </Reveal>

        {/* Recruitment / Culture Note */}
        <Reveal className="mt-12 p-6 bg-[#111827] border border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A0B0E] border border-[#1F2937] flex items-center justify-center text-[#3B82F6] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Vous partagez notre vision de la tech africaine ?</div>
              <div className="text-xs text-[#9CA3AF]">Nous recrutons régulièrement des ingénieurs, designers et bâtisseurs de produits passionnés.</div>
            </div>
          </div>
          <a
            href="/contact/"
            className="text-xs font-mono font-bold text-[#3B82F6] hover:text-white px-4 py-2 bg-[#0A0B0E] hover:bg-[#3B82F6] border border-[#1F2937] hover:border-[#3B82F6] shrink-0 transition-colors uppercase tracking-wider"
          >
            Rejoindre l'aventure →
          </a>
        </Reveal>

      </div>
    </section>
  );
};
