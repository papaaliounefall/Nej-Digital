import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { GLOBE_CITIES, GLOBE_CONNECTIONS } from '../../data/globeCities';
import { createArcPoints, createGlowTexture } from '../../lib/globe';
import { GLOBE_RADIUS } from './Earth';

interface ArcProps {
  points: THREE.Vector3[];
  glowTexture: THREE.CanvasTexture;
  offset: number;
  reduceMotion: boolean;
}

const Arc: React.FC<ArcProps> = ({ points, glowTexture, offset, reduceMotion }) => {
  const pulseRef = useRef<THREE.Sprite>(null);

  // Built as a plain THREE.Line via <primitive> — the JSX tag <line> collides
  // with React's own SVG <line> intrinsic and resolves to the wrong type.
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: '#5aa2ff', transparent: true, opacity: 0.45 });
    return new THREE.Line(geometry, material);
  }, [points]);

  useFrame(({ clock }) => {
    if (!pulseRef.current || reduceMotion) return;
    const t = (clock.elapsedTime * 0.12 + offset) % 1;
    const index = Math.min(points.length - 1, Math.floor(t * points.length));
    pulseRef.current.position.copy(points[index]);
    pulseRef.current.material.opacity = Math.sin(t * Math.PI) * 0.9;
  });

  return (
    <group>
      <primitive object={line} />
      {!reduceMotion && (
        <sprite ref={pulseRef} scale={[0.14, 0.14, 1]}>
          <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      )}
    </group>
  );
};

export const ConnectionLines: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const glowTexture = useMemo(() => createGlowTexture('#e8f2ff'), []);

  const arcs = useMemo(() => {
    const cityByName = new Map(GLOBE_CITIES.map((c) => [c.name, c]));
    return GLOBE_CONNECTIONS.map(([fromName, toName], idx) => {
      const from = cityByName.get(fromName);
      const to = cityByName.get(toName);
      if (!from || !to) return null;
      return {
        key: `${fromName}-${toName}`,
        points: createArcPoints(from.lat, from.lng, to.lat, to.lng, GLOBE_RADIUS),
        offset: idx / GLOBE_CONNECTIONS.length
      };
    }).filter((arc): arc is NonNullable<typeof arc> => arc !== null);
  }, []);

  return (
    <group>
      {arcs.map((arc) => (
        <Arc key={arc.key} points={arc.points} glowTexture={glowTexture} offset={arc.offset} reduceMotion={reduceMotion} />
      ))}
    </group>
  );
};
