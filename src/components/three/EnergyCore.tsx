import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function useMouse() {
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  useFrame(({ pointer }) => {
    mouse.current.x = pointer.x;
    mouse.current.y = pointer.y;
  });
  return { mouse, size };
}

function Core({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const { mouse } = useMouse();

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += dt * 0.25;
      const tx = mouse.current.y * 0.35;
      const ty = mouse.current.x * 0.5;
      group.current.rotation.x += (tx - group.current.rotation.x) * (1 - Math.exp(-3 * dt));
      group.current.position.x += (ty * 0.6 - group.current.position.x) * (1 - Math.exp(-2 * dt));
      const s = scale * (1 + Math.sin(t * 1.4) * 0.03);
      group.current.scale.setScalar(s);
    }
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.6;
      inner.current.rotation.z += dt * 0.2;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#0af0ff"
          emissive="#00d9ff"
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.9}
          wireframe
        />
      </mesh>
      <mesh scale={0.72}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#1b1040"
          emissive="#7b2cff"
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
      <mesh scale={1.45}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <Rings />
    </group>
  );
}

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (a.current) a.current.rotation.z += dt * 0.5;
    if (b.current) b.current.rotation.y += dt * 0.7;
    if (c.current) c.current.rotation.x += dt * 0.4;
  });

  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.8, 0.012, 12, 128]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh ref={b} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.2, 0.008, 12, 128]} />
        <meshBasicMaterial color="#a855f7" />
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[2.6, 0.006, 12, 128]} />
        <meshBasicMaterial color="#4f7cff" />
      </mesh>
    </>
  );
}

function Particles({ count = 700 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (ref.current) {
      ref.current.rotation.y += dt * 0.05;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#8be9ff"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function EnergyCore({
  scale = 1,
  className = "",
  dpr = [1, 1.6],
}: {
  scale?: number;
  className?: string;
  dpr?: [number, number];
}) {
  return (
    <div className={className}>
      <Canvas dpr={dpr} camera={{ position: [0, 0, 7], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 4, 5]} intensity={60} color="#22d3ee" />
        <pointLight position={[-5, -3, -4]} intensity={45} color="#a855f7" />
        <Suspense fallback={null}>
          <Core scale={scale} />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default EnergyCore;
