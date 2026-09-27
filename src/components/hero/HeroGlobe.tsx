import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { CityLights } from './CityLights';
import { ConnectionLines } from './ConnectionLines';
import { Stars } from './Stars';
import { prefersReducedMotion } from '../../lib/webgl';

const MAX_PARALLAX = 0.06; // radians — kept subtle on purpose

// Dakar sits at longitude -17.4°, which by default faces off to the screen's
// right. Most connection arcs fan out eastward from Dakar (Abidjan, Paris,
// Lagos, Nairobi, Dubaï), so this starting yaw turns that whole cluster to
// face the camera on the left/visible side instead of hiding off-frame.
const INITIAL_ROTATION_Y = -1.97;

// Rather than spinning all the way around (which would eventually turn Africa
// and the connections away from the camera), the globe gently sways side to
// side around that starting angle — always alive, never loses the view.
const SWAY_RANGE = 0.22; // radians, ~13° each direction
const SWAY_SPEED = 0.09; // radians/sec of the underlying sine wave

const GlobeScene: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetTilt = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const swaySpeed = reduceMotion ? SWAY_SPEED * 0.2 : SWAY_SPEED;
    const swayRange = reduceMotion ? SWAY_RANGE * 0.35 : SWAY_RANGE;
    group.rotation.y = INITIAL_ROTATION_Y + Math.sin(state.clock.elapsedTime * swaySpeed) * swayRange;

    if (!reduceMotion) {
      const { pointer } = state;
      targetTilt.current.x = -pointer.y * MAX_PARALLAX;
      targetTilt.current.y += (pointer.x * MAX_PARALLAX - targetTilt.current.y) * 0.02;
      group.rotation.x += (targetTilt.current.x - group.rotation.x) * 0.03;
      group.rotation.z += (targetTilt.current.y * 0.3 - group.rotation.z) * 0.03;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, INITIAL_ROTATION_Y, 0]}>
      <Earth />
      <Atmosphere />
      <CityLights reduceMotion={reduceMotion} />
      <ConnectionLines reduceMotion={reduceMotion} />
    </group>
  );
};

/** Keeps the pixel ratio sane on very large / very small viewports. */
const AdaptivePixelRatio: React.FC = () => {
  const { gl } = useThree();
  useMemo(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);
  return null;
};

export const HeroGlobe: React.FC = () => {
  const reduceMotion = useMemo(() => prefersReducedMotion(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <AdaptivePixelRatio />
      <ambientLight intensity={0.35} color="#4a6fa5" />
      <directionalLight position={[-4, 3, 5]} intensity={1.4} color="#eaf2ff" />
      <directionalLight position={[3, -2, -4]} intensity={0.25} color="#3B82F6" />
      <Stars />
      <GlobeScene reduceMotion={reduceMotion} />
    </Canvas>
  );
};
