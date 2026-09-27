import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { GLOBE_CITIES } from '../../data/globeCities';
import { createGlowTexture, latLngToVector3 } from '../../lib/globe';
import { GLOBE_RADIUS } from './Earth';

interface CityMarkerProps {
  position: THREE.Vector3;
  isPrimary?: boolean;
  glowTexture: THREE.CanvasTexture;
  phase: number;
  reduceMotion: boolean;
}

const CityMarker: React.FC<CityMarkerProps> = ({ position, isPrimary, glowTexture, phase, reduceMotion }) => {
  const spriteRef = useRef<THREE.Sprite>(null);
  const baseScale = isPrimary ? 0.42 : 0.26;

  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    const twinkle = reduceMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 1.4 + phase) * 0.12;
    spriteRef.current.scale.setScalar(baseScale * twinkle);
  });

  return (
    <group position={position}>
      {/* Crisp dot on the surface */}
      <mesh>
        <sphereGeometry args={[isPrimary ? 0.028 : 0.018, 12, 12]} />
        <meshBasicMaterial color={isPrimary ? '#ffffff' : '#bfe0ff'} />
      </mesh>
      {/* Soft halo */}
      <sprite ref={spriteRef} scale={[baseScale, baseScale, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={isPrimary ? 0.9 : 0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
};

export const CityLights: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const glowTexture = useMemo(() => createGlowTexture('#bfe0ff'), []);

  const markers = useMemo(
    () =>
      GLOBE_CITIES.map((city, idx) => ({
        city,
        position: latLngToVector3(city.lat, city.lng, GLOBE_RADIUS * 1.002),
        phase: idx * 1.37
      })),
    []
  );

  return (
    <group>
      {markers.map(({ city, position, phase }) => (
        <CityMarker
          key={city.name}
          position={position}
          isPrimary={city.isPrimary}
          glowTexture={glowTexture}
          phase={phase}
          reduceMotion={reduceMotion}
        />
      ))}
    </group>
  );
};
