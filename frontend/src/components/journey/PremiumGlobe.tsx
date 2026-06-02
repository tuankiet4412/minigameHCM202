'use client';

import { useRef, useMemo, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { EnrichedJourneyLocation } from '@/lib/journey-enrichment';
import { latLngToVector3, arcPoints } from '@/components/journey/globe-utils';

const EARTH = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const BUMP = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
const SPEC = 'https://unpkg.com/three-globe/example/img/earth-water.png';
const NIGHT = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';

function latLngToPos(lat: number, lng: number, r = 1.002): [number, number, number] {
  const v = latLngToVector3(lat, lng, r);
  return [v.x, v.y, v.z];
}

function SceneParticles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const r = 1.8 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.008} color="#D4AF37" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Earth() {
  const [colorMap, bumpMap, specMap, nightMap] = useTexture([EARTH, BUMP, SPEC, NIGHT]);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughnessMap={specMap}
          roughness={0.85}
          metalness={0.1}
          emissiveMap={nightMap}
          emissive="#ffffff"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh scale={1.015}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#4da6ff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function TravelArc({
  from,
  to,
}: {
  from: EnrichedJourneyLocation;
  to: EnrichedJourneyLocation;
}) {
  const uniforms = useMemo(() => ({
    dashOffset: { value: 0 }
  }), []);

  const geometry = useMemo(() => {
    const s = latLngToVector3(from.latitude, from.longitude, 1.01);
    const e = latLngToVector3(to.latitude, to.longitude, 1.01);
    const pts = arcPoints(s, e, 80, 0.28);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, [from, to]);

  const line = useMemo(() => {
    const mat = new THREE.LineDashedMaterial({
      color: '#FFD700',
      transparent: true,
      opacity: 0.9,
      dashSize: 0.05,
      gapSize: 0.025,
      depthWrite: false,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.dashOffset = uniforms.dashOffset;
      shader.fragmentShader = `
        uniform float dashOffset;
        ${shader.fragmentShader}
      `.replace(
        `mod( vLineDistance, dashSize + gapSize ) > dashSize`,
        `mod( vLineDistance - dashOffset, dashSize + gapSize ) > dashSize`
      );
    };
    const l = new THREE.Line(geometry, mat);
    l.computeLineDistances();
    return l;
  }, [geometry, uniforms]);

  useFrame(() => {
    uniforms.dashOffset.value += 0.015;
  });

  return <primitive object={line} />;
}

function CountryMarker({
  location,
  selected,
  onSelect,
}: {
  location: EnrichedJourneyLocation;
  selected: boolean;
  onSelect: (l: EnrichedJourneyLocation) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const pos = latLngToPos(location.latitude, location.longitude, 1.02);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.15;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(selected ? pulse * 1.6 : pulse);
    }
    if (ringRef.current) {
      const s = 1 + ((clock.elapsedTime * 0.8) % 1) * 0.8;
      ringRef.current.scale.setScalar(s);
      if (ringRef.current.material instanceof THREE.MeshBasicMaterial) {
        ringRef.current.material.opacity = selected ? 0.5 * (1 - (s - 1)) : 0.25 * (1 - (s - 1));
      }
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(location);
        }}
      >
        <ringGeometry args={[0.04, 0.055, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(location);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[selected ? 0.028 : 0.02, 16, 16]} />
        <meshStandardMaterial
          color={selected ? '#FFD700' : '#D4AF37'}
          emissive={selected ? '#FFD700' : '#D4AF37'}
          emissiveIntensity={selected ? 2 : 1.2}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <pointLight color="#FFD700" intensity={selected ? 1.2 : 0.4} distance={0.5} />
    </group>
  );
}

const DEFAULT_CAMERA_DIR = new THREE.Vector3(0, 0.15, 2.85).normalize();

function GlobeRotationController({
  selected,
  focusKey,
  children,
}: {
  selected: EnrichedJourneyLocation | null;
  focusKey: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetQuat = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (!selected || focusKey === 0) return;
    const surface = latLngToVector3(selected.latitude, selected.longitude, 1).normalize();
    targetQuat.current.setFromUnitVectors(surface, DEFAULT_CAMERA_DIR);
  }, [selected, focusKey]);

  useFrame((_, delta) => {
    if (!groupRef.current || focusKey === 0) return;
    const step = 1 - Math.pow(0.001, delta);
    groupRef.current.quaternion.slerp(targetQuat.current, step * 2.2);
  });

  return <group ref={groupRef}>{children}</group>;
}

function GlobeScene({
  locations,
  selected,
  focusKey,
  onSelect,
}: {
  locations: EnrichedJourneyLocation[];
  selected: EnrichedJourneyLocation | null;
  focusKey: number;
  onSelect: (l: EnrichedJourneyLocation) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const pauseRotate = hovered || isFocusing;

  useEffect(() => {
    if (focusKey === 0) return;
    setIsFocusing(true);
    const timer = setTimeout(() => setIsFocusing(false), 1400);
    return () => clearTimeout(timer);
  }, [focusKey]);

  return (
    <>
      <color attach="background" args={['#030308']} />
      <fog attach="fog" args={['#030308', 4, 12]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#fffef5" />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#4da6ff" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#D4AF37" />

      <Stars radius={80} depth={40} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <SceneParticles />

      <GlobeRotationController selected={selected} focusKey={focusKey}>
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.08}>
          <Earth />
        </Float>

        {locations.slice(0, -1).map((from, i) => (
          <TravelArc key={`${from.country}-${locations[i + 1].country}`} from={from} to={locations[i + 1]} />
        ))}

        {locations.map((loc) => (
          <CountryMarker
            key={loc.id}
            location={loc}
            selected={selected?.country === loc.country}
            onSelect={onSelect}
          />
        ))}
      </GlobeRotationController>

      <OrbitControls
        enablePan={false}
        minDistance={1.8}
        maxDistance={4.5}
        enableDamping
        dampingFactor={0.06}
        autoRotate={!pauseRotate}
        autoRotateSpeed={0.35}
        onStart={() => setHovered(true)}
        onEnd={() => setHovered(false)}
      />
    </>
  );
}

export default function PremiumGlobe({
  locations,
  selected,
  focusKey = 0,
  onSelect,
  className,
}: {
  locations: EnrichedJourneyLocation[];
  selected: EnrichedJourneyLocation | null;
  focusKey?: number;
  onSelect: (l: EnrichedJourneyLocation) => void;
  className?: string;
}) {
  return (
    <div className={className ?? 'relative h-full w-full min-h-[420px]'}>
      <div className="pointer-events-none absolute inset-0 rounded-glass bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_65%)]" />
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-heritage-gold/70">
            Loading globe…
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.15, 2.85], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          className="rounded-glass"
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.1;
          }}
        >
          <GlobeScene locations={locations} selected={selected} focusKey={focusKey} onSelect={onSelect} />
        </Canvas>
      </Suspense>
    </div>
  );
}
