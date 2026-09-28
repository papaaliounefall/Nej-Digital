import { ShoppingBag, GraduationCap, Sprout, Landmark, Trophy, Car, Layers, type LucideIcon } from 'lucide-react';

/** Shared between ProjectsGrid and ProductInfoModal, which both need the
 * same product -> icon mapping for their screenshot-less placeholder visual. */
export function getProductIcon(id: string): LucideIcon {
  switch (id) {
    case 'sunumall': return ShoppingBag;
    case 'orientasn': return GraduationCap;
    case 'agrimarket': return Sprout;
    case 'hadrasmart': return Landmark;
    case 'minifoot': return Trophy;
    case 'sunucar': return Car;
    default: return Layers;
  }
}
