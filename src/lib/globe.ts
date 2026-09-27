import * as THREE from 'three';
import { feature } from 'topojson-client';
import worldTopology from '../data/worldCountries110m.json';

/** Converts geographic coordinates to a position on a sphere of the given radius. */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Natural Earth country names (as used by world-atlas) that make up the African continent. */
const AFRICAN_COUNTRIES = new Set([
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
  'Central African Rep.', 'Chad', 'Congo', 'Dem. Rep. Congo', 'Djibouti', 'Egypt',
  'Eq. Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
  'Guinea-Bissau', "Côte d'Ivoire", 'Kenya', 'Lesotho', 'Liberia', 'Libya',
  'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Morocco', 'Mozambique', 'Namibia',
  'Niger', 'Nigeria', 'Rwanda', 'S. Sudan', 'Senegal', 'Sierra Leone', 'Somalia',
  'Somaliland', 'South Africa', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
  'W. Sahara', 'Zambia', 'Zimbabwe', 'eSwatini'
]);

type Ring = [number, number][];
type CountryGeometry =
  | { type: 'Polygon'; coordinates: Ring[] }
  | { type: 'MultiPolygon'; coordinates: Ring[][] }
  | null;

function extractOuterRings(geometry: CountryGeometry): Ring[] {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') {
    return geometry.coordinates[0] ? [geometry.coordinates[0]] : [];
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.map((poly) => poly[0]).filter(Boolean);
  }
  return [];
}

export interface WorldOutlines {
  /** Line-segment pairs (x,y,z,x,y,z,...) for every country's coastline. */
  worldSegments: Float32Array;
  /** Same, but only for African countries — rendered again, brighter, on top. */
  africaSegments: Float32Array;
}

let cachedOutlines: WorldOutlines | null = null;

/** Builds the coastline wireframe from real Natural Earth boundary data (no bitmap texture). */
export function buildWorldOutlines(radius: number): WorldOutlines {
  if (cachedOutlines) return cachedOutlines;

  const topology = worldTopology as unknown as Parameters<typeof feature>[0];
  const objectName = Object.keys((topology as { objects: Record<string, unknown> }).objects)[0];
  const geo = feature(
    topology,
    (topology as { objects: Record<string, unknown> }).objects[objectName] as Parameters<typeof feature>[1]
  ) as unknown as {
    features: { properties: { name: string }; geometry: CountryGeometry }[];
  };

  const worldPoints: number[] = [];
  const africaPoints: number[] = [];

  for (const f of geo.features) {
    const rings = extractOuterRings(f.geometry);
    const isAfrica = AFRICAN_COUNTRIES.has(f.properties.name);

    for (const ring of rings) {
      for (let i = 0; i < ring.length; i++) {
        const [lngA, latA] = ring[i];
        const [lngB, latB] = ring[(i + 1) % ring.length];
        const a = latLngToVector3(latA, lngA, radius);
        const b = latLngToVector3(latB, lngB, radius);
        worldPoints.push(a.x, a.y, a.z, b.x, b.y, b.z);
        if (isAfrica) {
          africaPoints.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
  }

  cachedOutlines = {
    worldSegments: new Float32Array(worldPoints),
    africaSegments: new Float32Array(africaPoints)
  };
  return cachedOutlines;
}

/** Approximate geographic centroid used to anchor Africa's halo glow. */
export const AFRICA_CENTER: [number, number] = [2, 20];

/**
 * Points along a great-circle arc between two coordinates, lifted outward
 * from the sphere surface so it reads as a connection curving over the globe.
 */
export function createArcPoints(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  radius: number,
  segments = 80
): THREE.Vector3[] {
  const start = latLngToVector3(startLat, startLng, 1);
  const end = latLngToVector3(endLat, endLng, 1);
  const angle = start.angleTo(end);
  const maxAltitude = radius * 0.3;
  const points: THREE.Vector3[] = [];

  const sinTotal = Math.sin(angle);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let point: THREE.Vector3;
    if (sinTotal < 1e-6) {
      point = start.clone();
    } else {
      const a = Math.sin((1 - t) * angle) / sinTotal;
      const b = Math.sin(t * angle) / sinTotal;
      point = new THREE.Vector3(
        start.x * a + end.x * b,
        start.y * a + end.y * b,
        start.z * a + end.z * b
      );
    }
    const altitude = Math.sin(t * Math.PI) * maxAltitude;
    point.normalize().multiplyScalar(radius + altitude);
    points.push(point);
  }
  return points;
}

/** Draws a soft radial-gradient sprite texture at runtime (no image asset). */
export function createGlowTexture(color = '#bfe0ff'): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

