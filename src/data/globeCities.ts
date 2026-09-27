export interface GlobeCity {
  name: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
}

export const GLOBE_CITIES: GlobeCity[] = [
  { name: 'Dakar', lat: 14.7167, lng: -17.4677, isPrimary: true },
  { name: 'Abidjan', lat: 5.36, lng: -4.0083 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792 },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { name: 'Le Caire', lat: 30.0444, lng: 31.2357 },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Londres', lat: 51.5074, lng: -0.1278 },
  { name: 'Dubaï', lat: 25.2048, lng: 55.2708 },
  { name: 'New York', lat: 40.7128, lng: -74.006 }
];

/** Connections radiate from Dakar — kept few, on purpose. */
export const GLOBE_CONNECTIONS: [string, string][] = [
  ['Dakar', 'Paris'],
  ['Dakar', 'Abidjan'],
  ['Dakar', 'Lagos'],
  ['Dakar', 'Nairobi'],
  ['Dakar', 'Dubaï'],
  ['Dakar', 'New York']
];
