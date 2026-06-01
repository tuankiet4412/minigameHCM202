'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ArtifactFrame({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Group>(null!);
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.2;

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.5 + index) * 0.08;
    }
  });

  return (
    <group
      ref={ref}
      position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
      rotation={[0, -angle + Math.PI / 2, 0]}
    >
      <mesh>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#C41E3A"
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.7, 0.85]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function MuseumGallery3D({ count = 6 }: { count?: number }) {
  return (
    <div className="h-[360px] w-full">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
        <ambientLight intensity={0.35} />
        <spotLight position={[0, 5, 0]} angle={0.4} penumbra={0.5} intensity={1} color="#fff" />
        <pointLight position={[3, 2, 3]} color="#D4AF37" intensity={0.4} />
        {Array.from({ length: count }).map((_, i) => (
          <ArtifactFrame key={i} index={i} total={count} />
        ))}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}
