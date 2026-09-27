import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from './Earth';

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;

export const Atmosphere: React.FC = () => {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#2a6fd6') },
      uIntensity: { value: 0.55 }
    }),
    []
  );

  return (
    <mesh scale={1.045}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
