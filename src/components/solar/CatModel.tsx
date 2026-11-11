import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sim } from "@/components/solar/sim";
import { useSolar } from "@/components/solar/store";

const fur = "#e5923c";
const furDark = "#c56a28";
const belly = "#f4d7b0";
const white = "#f6f2ea";
const spot = "#e2a24c";
const nose = "#e7a097";
const eye = "#140e0c";

function Ear({ side }: { side: -1 | 1 }) {
  const q = useMemo(() => {
    const dir = new THREE.Vector3(side * 0.62, 0.12, -0.78).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }, [side]);

  return (
    <group position={[side * 0.4, 0.86, 0.08]} quaternion={q}>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.2, 0.34, 4]} />
        <meshStandardMaterial color={furDark} roughness={0.8} emissive="#3a1d10" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0.15, 0.03]} scale={0.62}>
        <coneGeometry args={[0.18, 0.26, 4]} />
        <meshStandardMaterial color="#f0c2b6" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Whiskers({ side }: { side: -1 | 1 }) {
  const angles = [-0.35, 0.02, 0.32];
  return (
    <group position={[side * 0.2, 0.2, 1.18]}>
      {angles.map((a) => (
        <mesh key={a} position={[side * 0.28, a * 0.12, 0]} rotation={[0, 0, side * (Math.PI / 2) + a * 0.35]}>
          <cylinderGeometry args={[0.008, 0.008, 0.62, 4]} />
          <meshBasicMaterial color={white} />
        </mesh>
      ))}
    </group>
  );
}

function Eye({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.23, 0.58, 1.12]}>
      <mesh>
        <sphereGeometry args={[0.125, 20, 20]} />
        <meshStandardMaterial color={eye} roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh position={[side * -0.03, 0.035, 0.09]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshBasicMaterial color="#f7f8fb" />
      </mesh>
      <mesh position={[0, 0.07, 0.04]} scale={[1.05, 0.42, 0.7]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={fur} roughness={0.78} emissive="#3a1d10" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function CatModel() {
  const spin = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const wall = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const { paused, speed } = useSolar.getState();
    if (!paused) {
      const rate = 0.75 + 0.22 * Math.min(speed, 4);
      wall.current += d * rate;
    }
    const g = spin.current;
    if (!g) return;
    const w = wall.current;
    g.rotation.set(w * 1.65, w * 2.35, w * 1.15);
    if (mouth.current) {
      const open = 0.45 + Math.abs(Math.sin(w * 5.2)) * 0.85;
      mouth.current.scale.y = open;
    }
  });

  return (
    <group ref={spin} scale={1.05}>
      <mesh scale={[1.05, 0.92, 1.2]} position={[0, -0.05, -0.08]}>
        <sphereGeometry args={[0.58, 32, 24]} />
        <meshStandardMaterial color={fur} roughness={0.78} emissive="#3a1d10" emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, -0.22, 0.42]} scale={[0.62, 0.42, 0.36]}>
        <sphereGeometry args={[0.42, 20, 16]} />
        <meshStandardMaterial color={belly} roughness={0.8} emissive="#3a1d10" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0.18, 0.08, -0.95]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.05, 0.28, -1.12]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={fur} roughness={0.8} />
      </mesh>
      <mesh position={[-0.02, 0.42, -1.22]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.42, 0.52]}>
        <sphereGeometry args={[0.66, 36, 28]} />
        <meshStandardMaterial color={fur} roughness={0.76} emissive="#3a1d10" emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, 0.78, 0.78]} rotation={[0.45, 0, 0.15]} scale={[0.42, 0.08, 0.16]}>
        <sphereGeometry args={[0.45, 12, 10]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>
      <mesh position={[-0.12, 0.7, 0.86]} rotation={[0.4, 0, 0.7]} scale={[0.28, 0.06, 0.12]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.7, 0.86]} rotation={[0.4, 0, -0.7]} scale={[0.28, 0.06, 0.12]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>

      <Ear side={-1} />
      <Ear side={1} />

      <mesh position={[0, 0.24, 1.02]} scale={[0.92, 0.62, 0.48]}>
        <sphereGeometry args={[0.36, 24, 18]} />
        <meshStandardMaterial color={white} roughness={0.72} emissive="#2a241c" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[-0.15, 0.16, 1.22]} scale={[1.1, 0.7, 0.55]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={spot} roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.16, 1.22]} scale={[1.1, 0.7, 0.55]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={spot} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, 1.28]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial color={nose} roughness={0.45} />
      </mesh>
      <mesh ref={mouth} position={[0, 0.16, 1.26]} scale={[1, 0.5, 0.55]}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshStandardMaterial color="#3a2420" roughness={0.6} />
      </mesh>

      <Eye side={-1} />
      <Eye side={1} />
      <mesh position={[-0.22, 0.72, 1.02]} rotation={[0.2, 0, 0.45]} scale={[0.28, 0.06, 0.1]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.72, 1.02]} rotation={[0.2, 0, -0.45]} scale={[0.28, 0.06, 0.1]}>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial color={furDark} roughness={0.8} />
      </mesh>
      <Whiskers side={-1} />
      <Whiskers side={1} />

      <mesh position={[-0.22, -0.48, 0.32]}>
        <sphereGeometry args={[0.12, 12, 10]} />
        <meshStandardMaterial color={white} roughness={0.75} />
      </mesh>
      <mesh position={[0.22, -0.48, 0.32]}>
        <sphereGeometry args={[0.12, 12, 10]} />
        <meshStandardMaterial color={white} roughness={0.75} />
      </mesh>
    </group>
  );
}

