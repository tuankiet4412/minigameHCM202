'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { JourneyLocation } from '@/lib/types';

function latLngToPos(lat: number, lng: number, r = 1.01): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

function RouteLine({ locations }: { locations: JourneyLocation[] }) {
  const points = useMemo(() => {
    return locations.map((l) => new THREE.Vector3(...latLngToPos(l.latitude, l.longitude)));
  }, [locations]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#D4AF37"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
}

function LocationPin({
  location,
  onSelect,
}: {
  location: JourneyLocation;
  onSelect?: (l: JourneyLocation) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = latLngToPos(location.latitude, location.longitude);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onClick={() => onSelect?.(location)}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshStandardMaterial color="#C41E3A" emissive="#C41E3A" emissiveIntensity={0.8} />
    </mesh>
  );
}

function Globe({ locations, onSelect }: { locations: JourneyLocation[]; onSelect?: (l: JourneyLocation) => void }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial color="#1a2744" emissive="#0a1528" emissiveIntensity={0.4} transparent opacity={0.95} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.001, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.05} />
      </mesh>
      <RouteLine locations={locations} />
      {locations.map((loc) => (
        <LocationPin key={loc.id} location={loc} onSelect={onSelect} />
      ))}
    </group>
  );
}

export default function JourneyMap3D({
  locations,
  onSelect,
  className,
}: {
  locations: JourneyLocation[];
  onSelect?: (l: JourneyLocation) => void;
  className?: string;
}) {
  return (
    <div className={className ?? 'h-[500px] w-full'}>
      <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 2, 4]} color="#D4AF37" intensity={0.5} />
        <Globe locations={locations} onSelect={onSelect} />
        <OrbitControls enableZoom enablePan={false} minDistance={2} maxDistance={4} />
      </Canvas>
    </div>
  );
}
