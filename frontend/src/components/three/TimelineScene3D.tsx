'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { TimelineEvent } from '@/lib/types';

function EventNode({ event, index, total }: { event: TimelineEvent; index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const angle = (index / Math.max(total - 1, 1)) * Math.PI * 1.5 - Math.PI * 0.75;
  const x = Math.cos(angle) * 1.8;
  const z = Math.sin(angle) * 1.8;
  const y = (index - total / 2) * 0.15;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = y + Math.sin(clock.elapsedTime + index) * 0.05;
    }
  });

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#C41E3A" emissive="#C41E3A" emissiveIntensity={0.5} metalness={0.3} />
      </mesh>
      <Text position={[0, 0.35, 0]} fontSize={0.12} color="#D4AF37" anchorX="center">
        {String(event.year)}
      </Text>
    </group>
  );
}

function TimelinePath({ count }: { count: number }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i / count) * Math.PI * 2]}>
          <torusGeometry args={[1.8, 0.01, 8, 64, Math.PI / count]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function TimelineScene3D({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="h-[420px] w-full rounded-glass overflow-hidden">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff" />
        <pointLight position={[-2, 3, 2]} color="#D4AF37" intensity={0.6} />
        <TimelinePath count={events.length} />
        {events.map((event, i) => (
          <EventNode key={event.id} event={event} index={i} total={events.length} />
        ))}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}
