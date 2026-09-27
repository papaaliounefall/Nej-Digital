import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AFRICA_CENTER, buildWorldOutlines, createGlowTexture, latLngToVector3 } from '../../lib/globe';

const RADIUS = 2.4;

export const GLOBE_RADIUS = RADIUS;

export const Earth: React.FC = () => {
  const outlines = useMemo(() => buildWorldOutlines(RADIUS), []);
  const africaGlow = useMemo(() => createGlowTexture('#5aa2ff'), []);

  const worldGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(outlines.worldSegments, 3));
    return geo;
  }, [outlines]);

  const africaGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(outlines.africaSegments, 3));
    return geo;
  }, [outlines]);

  const africaHaloPosition = useMemo(() => {
    const [lat, lng] = AFRICA_CENTER;
    return latLngToVector3(lat, lng, RADIUS * 1.01);
  }, []);

  return (
    <group>
      {/* Core sphere — dark navy, faint metallic sheen */}
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial
          color="#0a0f1c"
          roughness={0.55}
          metalness={0.35}
          emissive="#050a14"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* All landmasses — subtle */}
      <lineSegments geometry={worldGeometry}>
        <lineBasicMaterial color="#3a5a8c" transparent opacity={0.35} />
      </lineSegments>

      {/* Africa — slightly brighter, the continent of origin */}
      <lineSegments geometry={africaGeometry}>
        <lineBasicMaterial color="#8fc3ff" transparent opacity={0.85} />
      </lineSegments>

      {/* Africa halo — soft, discreet glow */}
      <sprite position={africaHaloPosition} scale={[RADIUS * 1.6, RADIUS * 1.6, 1]}>
        <spriteMaterial
          map={africaGlow}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
};
