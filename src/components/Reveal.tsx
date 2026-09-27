import React from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger consecutive items in a list (e.g. idx * 80). */
  delayMs?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, className = '', delayMs = 0 }) => {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
};
