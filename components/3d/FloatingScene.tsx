'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingSceneProps {
  color?: string;
  position?: [number, number, number];
}

const FloatingElements: React.FC<FloatingSceneProps> = ({ color = '#06b6d4', position = [0, 0, 0] }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const clockOffset = 0.8;

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime + clockOffset;

    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.004;
      sphereRef.current.rotation.y += 0.006;
      sphereRef.current.position.y = Math.sin(elapsed) * 0.45;
    }
    if (boxRef.current) {
      boxRef.current.rotation.x -= 0.0025;
      boxRef.current.rotation.z += 0.004;
      boxRef.current.position.y = Math.cos(elapsed * 0.7) * 0.45;
    }
  });

  return (
      <>
        <Sphere ref={sphereRef} args={[1, 32, 32]} position={[position[0] - 1.5, position[1], position[2]]}>
        <meshStandardMaterial color={color} wireframe roughness={0.2} metalness={0.9} emissive={color} emissiveIntensity={0.15} />
      </Sphere>
      <Box ref={boxRef} args={[1.2, 1.2, 1.2]} position={[position[0] + 1.5, position[1], position[2]]}>
        <meshStandardMaterial color={color} wireframe roughness={0.25} metalness={0.85} emissive={color} emissiveIntensity={0.1} />
      </Box>
    </>
  );
};

export const FloatingScene: React.FC<FloatingSceneProps> = (props) => {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 3], fov: 75 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />
      <FloatingElements {...props} />
    </Canvas>
  );
};
