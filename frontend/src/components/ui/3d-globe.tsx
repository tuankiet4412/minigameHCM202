'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export type GlobeMarker = {
  lat: number;
  lng: number;
  src?: string;
  label?: string;
  color?: string;
};

export type GlobeConfig = {
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  globeColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
};

type Props = {
  markers?: GlobeMarker[];
  config?: GlobeConfig;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  className?: string;
};

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeMarkerMesh({
  marker,
  onClick,
  onHover,
}: {
  marker: GlobeMarker;
  onClick?: (m: GlobeMarker) => void;
  onHover?: (m: GlobeMarker | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(marker.lat, marker.lng, 1.02);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.4 + Math.sin(clock.elapsedTime * 4) * 0.15 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onClick={() => onClick?.(marker)}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover?.(marker); }}
      onPointerOut={() => { setHovered(false); onHover?.(null); }}
    >
      <sphereGeometry args={[0.022, 12, 12]} />
      <meshStandardMaterial
        color={hovered ? '#FCD34D' : (marker.color ?? '#EF4444')}
        emissive={hovered ? '#FCD34D' : (marker.color ?? '#EF4444')}
        emissiveIntensity={hovered ? 1.5 : 0.8}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

function GlobePing({ marker }: { marker: GlobeMarker }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = latLngToVector3(marker.lat, marker.lng, 1.02);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.abs(Math.sin(clock.elapsedTime * 1.5)) * 2;
      meshRef.current.scale.setScalar(scale);
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = 0.6 - (scale - 1) / 3;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.022, 12, 12]} />
      <meshStandardMaterial
        color={marker.color ?? '#EF4444'}
        transparent
        opacity={0.4}
        emissive={marker.color ?? '#EF4444'}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function GlobeMesh({
  markers,
  config,
  onMarkerClick,
  onMarkerHover,
}: {
  markers: GlobeMarker[];
  config: GlobeConfig;
  onMarkerClick?: (m: GlobeMarker) => void;
  onMarkerHover?: (m: GlobeMarker | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (config.autoRotateSpeed ?? 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main globe sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color={config.globeColor ?? '#1a3a6b'}
          emissive={config.emissive ?? '#0a1a3a'}
          emissiveIntensity={config.emissiveIntensity ?? 0.3}
          shininess={config.shininess ?? 15}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Grid / wireframe overlay */}
      <mesh>
        <sphereGeometry args={[1.001, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.12, 32, 32]} />
        <meshBasicMaterial
          color={config.atmosphereColor ?? '#4da6ff'}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.06, 32, 32]} />
        <meshBasicMaterial
          color={config.atmosphereColor ?? '#4da6ff'}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Markers */}
      {markers.map((m, i) => (
        <group key={i}>
          <GlobeMarkerMesh marker={m} onClick={onMarkerClick} onHover={onMarkerHover} />
          <GlobePing marker={m} />
        </group>
      ))}
    </group>
  );
}

export function Globe3D({ markers = [], config = {}, onMarkerClick, onMarkerHover, className }: Props) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4da6ff" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />

        <GlobeMesh
          markers={markers}
          config={config}
          onMarkerClick={onMarkerClick}
          onMarkerHover={onMarkerHover}
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
