import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------ shared inputs ----------------------------- */

const pointer = { x: 0, y: 0 };
const smoothPointer = { x: 0, y: 0 };
const scroll = { p: 0 };

function useGlobalInputs() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/* ------------------------------ keyframe path ----------------------------- */

type Key = { p: number; x: number; y: number; z: number; s: number; o: number };

// Hero -> About (side) -> Events (shrink/back) -> Timeline (gone) -> Final CTA (large)
const KEYS: Key[] = [
  { p: 0.0, x: 0, y: 0, z: 0, s: 1, o: 1 },
  { p: 0.12, x: 0.4, y: -0.2, z: -0.5, s: 1.05, o: 1 },
  { p: 0.24, x: 4.6, y: 0.5, z: -2.5, s: 0.8, o: 1 },
  { p: 0.42, x: 3.0, y: 0.8, z: -9, s: 0.5, o: 0.7 },
  { p: 0.58, x: 0.5, y: 2.6, z: -14, s: 0.3, o: 0 },
  { p: 0.74, x: 0, y: 0.4, z: -10, s: 0.6, o: 0 },
  { p: 0.88, x: 0, y: -0.6, z: -4.5, s: 1.15, o: 0.85 },
  { p: 1.0, x: 0, y: -1.1, z: -2.5, s: 1.5, o: 0.95 },
];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

function sample(p: number): Key {
  let a = KEYS[0]!;
  let b = KEYS[KEYS.length - 1]!;
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (p >= KEYS[i]!.p && p <= KEYS[i + 1]!.p) {
      a = KEYS[i]!;
      b = KEYS[i + 1]!;
      break;
    }
    if (p > KEYS[KEYS.length - 1]!.p) a = b = KEYS[KEYS.length - 1]!;
  }
  const span = b.p - a.p || 1;
  const t = smoothstep(Math.min(1, Math.max(0, (p - a.p) / span)));
  const l = (k: keyof Omit<Key, "p">) => a[k] + (b[k] - a[k]) * t;
  return { p, x: l("x"), y: l("y"), z: l("z"), s: l("s"), o: l("o") };
}

const damp = (current: number, target: number, k: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-k * dt));

/* --------------------------------- rings ---------------------------------- */

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  const d = useRef<THREE.Mesh>(null);

  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    if (a.current) a.current.rotation.z += dt * 0.5;
    if (b.current) b.current.rotation.y += dt * 0.7;
    if (c.current) c.current.rotation.x += dt * 0.4;
    if (d.current) {
      d.current.rotation.y -= dt * 0.3;
      d.current.rotation.x += dt * 0.15;
    }
  });

  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.75, 0.014, 3, 128]} />
        <meshBasicMaterial color="#22d3ee" toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[2.15, 0.01, 3, 128]} />
        <meshBasicMaterial color="#a855f7" toneMapped={false} />
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[2.6, 0.008, 3, 128]} />
        <meshBasicMaterial color="#4f7cff" toneMapped={false} />
      </mesh>
      <mesh ref={d} rotation={[Math.PI / 2.6, 0.6, 0]}>
        <torusGeometry args={[3.1, 0.006, 3, 128]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} />
      </mesh>
    </>
  );
}

/* ---------------------------------- core ---------------------------------- */

function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const mats = useRef<THREE.Material[]>([]);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = state.clock.elapsedTime;
    const k = sample(scroll.p);
    const g = group.current;
    if (!g) return;
    // keep the core clear of the copy on narrow screens
    const narrow = state.viewport.width < 7;
    const fit = narrow ? 0.46 : 1;
    const lift = narrow ? 2.05 * (1 - Math.min(scroll.p * 3, 1)) : 0;

    g.position.x = damp(g.position.x, k.x + smoothPointer.x * 0.45, 3, dt);
    g.position.y = damp(g.position.y, k.y + lift + smoothPointer.y * 0.3 + Math.sin(t * 0.6) * 0.08, 3, dt);
    g.position.z = damp(g.position.z, k.z, 3, dt);

    const s = k.s * fit * (1 + Math.sin(t * 1.4) * 0.025);
    const cs = damp(g.scale.x, s, 4, dt);
    g.scale.setScalar(cs);

    g.rotation.y += dt * (0.25 + scroll.p * 0.35);
    g.rotation.x = damp(g.rotation.x, smoothPointer.y * -0.4, 2.5, dt);
    g.rotation.z = damp(g.rotation.z, smoothPointer.x * 0.15, 2.5, dt);

    g.visible = k.o > 0.02;
    for (const m of mats.current) {
      const mm = m as THREE.Material & { opacity: number; userData: { base?: number } };
      const base = (mm.userData['base'] as number | undefined) ?? 1;
      mm.opacity = base * k.o;
    }

    if (inner.current) {
      inner.current.rotation.y -= dt * 0.6;
      inner.current.rotation.z += dt * 0.2;
    }
    if (shell.current) shell.current.rotation.y += dt * 0.12;
    if (halo.current) halo.current.scale.setScalar(1.45 + Math.sin(t * 1.1) * 0.05);
  });

  const collect = (m: THREE.Material | null, base: number) => {
    if (m && !mats.current.includes(m)) {
      m.transparent = true;
      m.userData['base'] = base;
      mats.current.push(m);
    }
  };

  return (
    <group ref={group} onUpdate={(g) => g.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.material) collect(mesh.material as THREE.Material, (mesh.material as THREE.Material).opacity);
    })}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#0af0ff"
          emissive="#00d9ff"
          emissiveIntensity={1.6}
          roughness={0.15}
          metalness={0.9}
          wireframe
        />
      </mesh>
      <mesh ref={shell} scale={0.72}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#160c33"
          emissive="#7b2cff"
          emissiveIntensity={1.3}
          roughness={0.2}
          metalness={0.75}
        />
      </mesh>
      <mesh scale={0.42}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#c9f6ff" toneMapped={false} />
      </mesh>
      <mesh ref={halo} scale={1.45}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
      <Rings />
    </group>
  );
}

/* -------------------------------- particles -------------------------------- */

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;
    }
    return arr;
  }, [count]);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = ref.current;
    if (!g) return;
    g.rotation.y += dt * 0.05;
    g.position.y = damp(g.position.y, -scroll.p * 3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2, 2, dt);
    g.position.x = damp(g.position.x, smoothPointer.x * -0.6, 1.5, dt);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#8be9ff"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------------------- floating geometry ---------------------------- */

type Shard = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  kind: number;
  depth: number;
  speed: number;
  color: string;
};

function Shards({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo<Shard[]>(() => {
    const colors = ["#22d3ee", "#a855f7", "#4f7cff", "#67e8f9"];
    return Array.from({ length: count }, (_, i) => {
      const depth = -2 - Math.random() * 10;
      return {
        pos: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, depth] as [number, number, number],
        rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [number, number, number],
        scale: 0.14 + Math.random() * 0.3,
        kind: i % 4,
        depth,
        speed: 0.15 + Math.random() * 0.4,
        color: colors[i % colors.length]!,
      };
    });
  }, [count]);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const it = items[i]!;
      child.rotation.x += dt * it.speed * 0.5;
      child.rotation.y += dt * it.speed;
      // depth-based parallax: closer objects travel further with scroll
      const parallax = (12 + it.depth) * 0.5;
      child.position.y = it.pos[1] + Math.sin(t * it.speed + i) * 0.35 + scroll.p * parallax;
      child.position.x = it.pos[0] + smoothPointer.x * (0.9 - it.depth * -0.05);
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot} scale={it.scale}>
          {it.kind === 0 ? (
            <octahedronGeometry args={[1, 0]} />
          ) : it.kind === 1 ? (
            <tetrahedronGeometry args={[1, 0]} />
          ) : it.kind === 2 ? (
            <torusGeometry args={[0.8, 0.18, 8, 24]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          <meshBasicMaterial color={it.color} wireframe transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------- neon grid -------------------------------- */

const gridVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float line(float v, float w) {
    float g = abs(fract(v - 0.5) - 0.5) / fwidth(v);
    return 1.0 - smoothstep(0.0, w, g);
  }

  void main() {
    vec2 uv = vUv;
    float scrollY = uv.y * 40.0 + uTime * 1.2;
    float gx = line(uv.x * 40.0, 1.0);
    float gy = line(scrollY, 1.0);
    float g = max(gx, gy);

    float fade = smoothstep(0.0, 0.45, uv.y) * smoothstep(1.0, 0.6, uv.y);
    float pulse = 0.75 + 0.25 * sin(uTime * 0.8 + uv.y * 6.0);
    vec3 col = mix(uColorA, uColorB, uv.y);
    gl_FragColor = vec4(col * g * pulse, g * fade * 0.55);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

function NeonGrid() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const grp = useRef<THREE.Group>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#22d3ee") },
      uColorB: { value: new THREE.Color("#7b2cff") },
    }),
    [],
  );

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    if (mat.current) mat.current.uniforms['uTime']!.value = state.clock.elapsedTime;
    if (grp.current) {
      grp.current.position.y = damp(grp.current.position.y, -4 + scroll.p * 5, 2, dt);
      grp.current.rotation.z = damp(grp.current.rotation.z, smoothPointer.x * 0.05, 2, dt);
    }
  });

  return (
    <group ref={grp} position={[0, -4, -6]}>
      <mesh rotation={[-Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={gridVertex}
          fragmentShader={gridFragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* --------------------------------- camera --------------------------------- */

function CameraRig() {
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    smoothPointer.x = damp(smoothPointer.x, pointer.x, 3, dt);
    smoothPointer.y = damp(smoothPointer.y, pointer.y, 3, dt);

    const cam = state.camera;
    const p = scroll.p;
    const targetX = smoothPointer.x * 1.1;
    const targetY = smoothPointer.y * 0.7 - p * 0.8;
    const targetZ = 7 + Math.sin(p * Math.PI) * 2.2;

    cam.position.x = damp(cam.position.x, targetX, 2, dt);
    cam.position.y = damp(cam.position.y, targetY, 2, dt);
    cam.position.z = damp(cam.position.z, targetZ, 2, dt);
    cam.lookAt(0, targetY * 0.3, 0);
  });
  return null;
}

/* --------------------------------- canvas --------------------------------- */

export function SceneCanvas() {
  useGlobalInputs();
  const [tier, setTier] = useState<"low" | "high">("high");

  useEffect(() => {
    const small = window.matchMedia("(max-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTier(small || reduce ? "low" : "high");
  }, []);

  const low = tier === "low";

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={low ? [1, 1.2] : [1, 1.6]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 4, 5]} intensity={70} color="#22d3ee" />
        <pointLight position={[-5, -3, -4]} intensity={50} color="#a855f7" />
        <Suspense fallback={null}>
          <CameraRig />
          <NeonGrid />
          <Core />
          <Particles count={low ? 320 : 800} />
          <Shards count={low ? 8 : 18} />
          {!low && (
            <EffectComposer enableNormalPass={false}>
              <Bloom intensity={0.85} luminanceThreshold={0.22} luminanceSmoothing={0.25} mipmapBlur radius={0.7} />
              <Vignette eskil={false} offset={0.25} darkness={0.75} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default SceneCanvas;
