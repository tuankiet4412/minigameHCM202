'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// ── Coordinate conversion ────────────────────────────────────────────────────
// Vietnam: lat 8.3→23.5, lng 102.0→109.5
const VN_LAT_MIN = 8.3, VN_LAT_MAX = 23.5; // span 15.2°
const VN_LNG_MIN = 102.0, VN_LNG_MAX = 109.5; // span 7.5°
const SW = 7, SH = 14; // scene width / height in units

export function geo(lat: number, lng: number): THREE.Vector3 {
  const x = ((lng - VN_LNG_MIN) / (VN_LNG_MAX - VN_LNG_MIN) - 0.5) * SW;
  const z = (0.5 - (lat - VN_LAT_MIN) / (VN_LAT_MAX - VN_LAT_MIN)) * SH;
  return new THREE.Vector3(x, 0, z);
}

// ── Vietnam border (simplified ~58 points, gives clear S-shape) ──────────────
const BORDER: [number, number][] = [
  // North border going east
  [23.3, 102.2], [23.4, 103.0], [23.0, 103.5], [22.8, 104.1],
  [22.9, 104.9], [22.3, 104.7], [21.5, 104.5], [21.5, 105.2],
  // Northeast notch + coast
  [21.0, 107.5], [21.0, 108.1], [20.5, 107.0], [20.0, 106.5],
  // Central coast
  [19.5, 105.8], [19.0, 105.6], [18.5, 105.8], [18.0, 106.1],
  [17.8, 106.6], [17.0, 107.2], [16.5, 107.9], [16.0, 108.4],
  [15.5, 108.9], [15.0, 109.2], [14.5, 109.4], [14.0, 109.5],
  [13.5, 109.3], [13.0, 109.2], [12.5, 109.4], [12.0, 109.0],
  [11.5, 108.7], [11.0, 108.2],
  // South tapering
  [10.5, 107.1], [10.0, 106.8], [9.5, 106.0], [9.0, 105.6],
  [8.7, 105.0], [8.5, 104.8],
  // Western coast Ca Mau going north
  [8.8, 104.4], [9.0, 104.2], [9.5, 104.0], [10.0, 104.8],
  [10.5, 104.3], [11.0, 103.5], [11.5, 103.2], [12.0, 102.8],
  // Western border (Cambodia)
  [12.5, 103.5], [13.0, 104.5], [13.5, 105.0], [14.0, 105.6],
  // Western border (Laos)
  [14.5, 107.2], [15.0, 107.5], [16.0, 106.7], [17.0, 105.8],
  [18.0, 105.1], [19.0, 104.2], [20.0, 103.5], [21.0, 102.2],
  [22.0, 102.6], [22.8, 102.3], [23.3, 102.2], // close
];

// ── Vietnam land + border ────────────────────────────────────────────────────
function VietnamLand() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const pts = BORDER.map(([lat, lng]) => {
      const v = geo(lat, lng);
      return new THREE.Vector2(v.x, -v.z); // -z due to rotation
    });
    s.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => s.lineTo(p.x, p.y));
    s.closePath();
    return s;
  }, []);

  const borderPts = useMemo(
    () => BORDER.map(([lat, lng]) => geo(lat, lng).toArray() as [number, number, number]),
    []
  );

  return (
    <group>
      {/* Filled land */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#1a472a" roughness={0.95} />
      </mesh>

      {/* Green border glow */}
      <Line points={borderPts} color="#4ade80" lineWidth={2} closed />

      {/* Softer inner glow */}
      <Line points={borderPts.map(([x, y, z]) => [x, y + 0.01, z] as [number, number, number])} color="#166534" lineWidth={1} closed />
    </group>
  );
}

// ── 3D Tank meshes ───────────────────────────────────────────────────────────
function TankMeshes() {
  return (
    <>
      {/* Left track */}
      <mesh position={[0, 0.11, -0.38]}>
        <boxGeometry args={[1.65, 0.22, 0.27]} />
        <meshStandardMaterial color="#111827" roughness={0.95} />
      </mesh>
      {/* Right track */}
      <mesh position={[0, 0.11, 0.38]}>
        <boxGeometry args={[1.65, 0.22, 0.27]} />
        <meshStandardMaterial color="#111827" roughness={0.95} />
      </mesh>
      {/* Track ridges left */}
      {[-0.5, -0.2, 0.1, 0.4].map((xi) => (
        <mesh key={xi} position={[xi, 0.22, -0.38]}>
          <boxGeometry args={[0.18, 0.06, 0.27]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      ))}
      {/* Track ridges right */}
      {[-0.5, -0.2, 0.1, 0.4].map((xi) => (
        <mesh key={xi} position={[xi, 0.22, 0.38]}>
          <boxGeometry args={[0.18, 0.06, 0.27]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
      ))}
      {/* Main body */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[1.45, 0.37, 0.7]} />
        <meshStandardMaterial color="#166534" roughness={0.65} metalness={0.2} />
      </mesh>
      {/* Body slope front */}
      <mesh position={[0.65, 0.28, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.35, 0.3, 0.68]} />
        <meshStandardMaterial color="#15803D" roughness={0.65} metalness={0.2} />
      </mesh>
      {/* Turret */}
      <mesh position={[-0.08, 0.62, 0]}>
        <boxGeometry args={[0.74, 0.3, 0.58]} />
        <meshStandardMaterial color="#14532D" roughness={0.65} metalness={0.25} />
      </mesh>
      {/* Turret hatch */}
      <mesh position={[-0.2, 0.79, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.07, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.6} />
      </mesh>
      {/* Cannon barrel */}
      <mesh position={[0.62, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.047, 0.047, 1.2, 8]} />
        <meshStandardMaterial color="#155e35" roughness={0.55} metalness={0.35} />
      </mesh>
      {/* Cannon muzzle brake */}
      <mesh position={[1.26, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.12, 8]} />
        <meshStandardMaterial color="#14532D" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Red star on turret */}
      <mesh position={[-0.08, 0.8, 0]}>
        <sphereGeometry args={[0.085, 6, 6]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.2} roughness={0.3} />
      </mesh>
      {/* Exhaust pipe */}
      <mesh position={[-0.65, 0.38, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.28, 6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>
    </>
  );
}

// ── Animated Tank ────────────────────────────────────────────────────────────
type TankProps = {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  phase: 'idle' | 'moving';
  onArrived?: () => void;
};

function AnimatedTank({ fromPos, toPos, phase, onArrived }: TankProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(phase === 'idle' ? 1 : 0);
  const arrivedRef = useRef(false);

  useEffect(() => {
    if (phase === 'moving') {
      progressRef.current = 0;
      arrivedRef.current = false;
    }
  }, [phase, fromPos.x, fromPos.z]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isMoving = phase === 'moving' && progressRef.current < 1;

    if (isMoving) {
      progressRef.current = Math.min(progressRef.current + delta * 0.55, 1);
    }

    const t = phase === 'idle' ? 1 : progressRef.current;
    const pos = new THREE.Vector3().lerpVectors(fromPos, toPos, t);
    groupRef.current.position.set(pos.x, 0.01, pos.z);

    // Rotate to face movement direction
    const dir = new THREE.Vector3().subVectors(toPos, fromPos);
    if (dir.lengthSq() > 0.0001) {
      groupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
    }

    // Subtle bounce while moving
    if (isMoving) {
      groupRef.current.position.y = 0.01 + Math.abs(Math.sin(progressRef.current * Math.PI * 8)) * 0.03;
    }

    // Call arrived when done
    if (phase === 'moving' && progressRef.current >= 1 && !arrivedRef.current) {
      arrivedRef.current = true;
      onArrived?.();
    }
  });

  return (
    <group ref={groupRef} position={[fromPos.x, 0.01, fromPos.z]} scale={0.38}>
      <TankMeshes />
      {/* Headlight */}
      <pointLight position={[1.4, 0.5, 0]} intensity={1.5} color="#FCD34D" distance={4} />
    </group>
  );
}

// ── City marker ──────────────────────────────────────────────────────────────
function CityMarker({
  position, name, icon, color, active, reached,
}: {
  position: THREE.Vector3;
  name: string;
  icon: string;
  color: string;
  active: boolean;
  reached: boolean;
}) {
  const pinRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (pinRef.current) {
      pinRef.current.position.y = 0.35 + Math.sin(clock.elapsedTime * 2.5 + position.x * 3) * 0.06;
    }
    if (ringRef.current && active) {
      const s = 1 + (Math.sin(clock.elapsedTime * 2) * 0.5 + 0.5) * 0.8;
      ringRef.current.scale.setScalar(s);
      if (ringRef.current.material instanceof THREE.MeshBasicMaterial) {
        ringRef.current.material.opacity = Math.max(0, 0.7 - (s - 1) * 0.6);
      }
    }
  });

  const c = new THREE.Color(reached ? color : '#374151');

  return (
    <group position={position}>
      {/* Pulse ring */}
      {active && (
        <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.38, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Vertical pin */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 8]} />
        <meshStandardMaterial color={reached ? color : '#374151'} emissive={reached ? color : '#000'} emissiveIntensity={0.3} />
      </mesh>
      {/* Pin sphere */}
      <mesh ref={pinRef} position={[0, 0.35, 0]}>
        <sphereGeometry args={[active ? 0.22 : 0.15, 16, 16]} />
        <meshStandardMaterial
          color={c}
          emissive={c}
          emissiveIntensity={active ? 1.5 : reached ? 0.6 : 0.05}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
      {/* Label */}
      <Html
        position={[0, 0.82, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            background: active
              ? color
              : reached
              ? 'rgba(0,0,0,0.85)'
              : 'rgba(0,0,0,0.4)',
            border: `1.5px solid ${active ? '#FCD34D' : reached ? color : '#374151'}`,
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '10px',
            fontWeight: 700,
            color: 'white',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.02em',
            boxShadow: active ? `0 0 8px ${color}80` : 'none',
          }}
        >
          {icon} {name}
        </div>
      </Html>
    </group>
  );
}

// ── Route path ───────────────────────────────────────────────────────────────
function RoutePath({ positions, currentMilestone }: { positions: THREE.Vector3[]; currentMilestone: number }) {
  const all = positions.map((p) => [p.x, 0.02, p.z] as [number, number, number]);
  const done = positions.slice(0, currentMilestone + 1).map((p) => [p.x, 0.03, p.z] as [number, number, number]);
  return (
    <>
      <Line points={all} color="#374151" lineWidth={3} />
      {done.length > 1 && <Line points={done} color="#FCD34D" lineWidth={4} />}
    </>
  );
}

// ── Camera controller ────────────────────────────────────────────────────────
function CameraController({
  milestone, positions, gamePhase,
}: {
  milestone: number;
  positions: THREE.Vector3[];
  gamePhase: string;
}) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0.5, 20, 8));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));
  const initialized = useRef(false);

  const [desiredPos, desiredLook] = useMemo(() => {
    if (gamePhase !== 'playing') {
      return [new THREE.Vector3(0.5, 20, 8), new THREE.Vector3(0, 0, 0)];
    }
    const city = positions[milestone] ?? positions[0];
    return [
      new THREE.Vector3(city.x - 0.3, 7, city.z + 6.5),
      new THREE.Vector3(city.x, 0, city.z - 0.5),
    ];
  }, [milestone, positions, gamePhase]);

  useEffect(() => {
    if (!initialized.current) {
      camera.position.copy(posRef.current);
      initialized.current = true;
    }
  }, [camera]);

  useFrame((_, delta) => {
    const speed = delta * 2.2;
    posRef.current.lerp(desiredPos, speed);
    lookRef.current.lerp(desiredLook, speed);
    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);
  });

  return null;
}

// ── Arrival burst ────────────────────────────────────────────────────────────
function BurstParticles({ position, trigger }: { position: THREE.Vector3; trigger: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(0);
  const colors = ['#EF4444', '#FCD34D', '#10B981', '#60A5FA'];

  useEffect(() => {
    if (trigger) progressRef.current = 0;
  }, [trigger]);

  useFrame((_, delta) => {
    if (!groupRef.current || !trigger) return;
    progressRef.current = Math.min(progressRef.current + delta * 2, 1);
    groupRef.current.children.forEach((child, i) => {
      const angle = (i / groupRef.current.children.length) * Math.PI * 2;
      const r = progressRef.current * 1.5;
      child.position.set(
        position.x + Math.cos(angle) * r,
        progressRef.current * 0.8,
        position.z + Math.sin(angle) * r
      );
      (child as THREE.Mesh).material &&
        (((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 1 - progressRef.current);
    });
  });

  if (!trigger) return null;

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={colors[i % colors.length]} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
type SceneProps = {
  milestones: { name: string; lat: number; lng: number; color: string; icon: string }[];
  currentMilestone: number;
  tankFrom: number;
  tankTo: number;
  tankPhase: 'idle' | 'moving';
  gamePhase: string;
  onTankArrived?: () => void;
  showBurst?: boolean;
};

function Scene({ milestones, currentMilestone, tankFrom, tankTo, tankPhase, gamePhase, onTankArrived, showBurst }: SceneProps) {
  const positions = useMemo(() => milestones.map((m) => geo(m.lat, m.lng)), [milestones]);

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={['#050d1a', 18, 40]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 12, 4]} intensity={1.8} color="#e0f0ff" />
      <directionalLight position={[-4, 4, -4]} intensity={0.5} color="#4ade80" />
      <hemisphereLight args={['#0a2f1a', '#1a3a6b', 0.5]} />

      {/* Ocean floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color="#071426" roughness={1} />
      </mesh>

      {/* Vietnam land */}
      <VietnamLand />

      {/* Route */}
      <RoutePath positions={positions} currentMilestone={currentMilestone} />

      {/* City markers */}
      {milestones.map((m, i) => (
        <CityMarker
          key={m.name}
          position={positions[i]}
          name={m.name}
          icon={m.icon}
          color={m.color}
          active={i === currentMilestone}
          reached={i <= currentMilestone}
        />
      ))}

      {/* Tank */}
      <AnimatedTank
        fromPos={positions[tankFrom] ?? positions[0]}
        toPos={positions[tankTo] ?? positions[0]}
        phase={tankPhase}
        onArrived={onTankArrived}
      />

      {/* Burst */}
      <BurstParticles
        position={positions[currentMilestone] ?? positions[0]}
        trigger={!!showBurst}
      />

      {/* Camera */}
      <CameraController milestone={currentMilestone} positions={positions} gamePhase={gamePhase} />
    </>
  );
}

// ── Exported wrapper ─────────────────────────────────────────────────────────
export type VietnamMap3DProps = SceneProps & { className?: string };

export function VietnamMap3D({ className, ...sceneProps }: VietnamMap3DProps) {
  return (
    <div className={className ?? 'w-full h-full'}>
      <Canvas
        camera={{ position: [0.5, 20, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene {...sceneProps} />
      </Canvas>
    </div>
  );
}
