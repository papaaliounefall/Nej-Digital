import React from 'react';
import { Stars as DreiStars } from '@react-three/drei';

/** A very restrained starfield — a hint of depth, not a "galaxy" backdrop. */
export const Stars: React.FC = () => (
  <DreiStars radius={60} depth={40} count={800} factor={2} saturation={0} fade speed={0.15} />
);
