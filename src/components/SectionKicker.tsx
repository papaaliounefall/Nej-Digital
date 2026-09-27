import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionKickerProps {
  label: string;
  icon?: LucideIcon;
  className?: string;
}

/** Small eyebrow label used above section headlines — one consistent, understated style
 * instead of a bordered/boxed badge repeated with slight variations on every section. */
export const SectionKicker: React.FC<SectionKickerProps> = ({ label, icon: Icon, className = '' }) => (
  <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#3B82F6] mb-4 ${className}`}>
    {Icon && <Icon className="w-3.5 h-3.5" />}
    <span>{label}</span>
  </div>
);
