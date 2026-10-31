import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { DeviceTier } from "~/hooks/useDeviceTier";

/**
 * Neural Lattice: a slowly drifting network of nodes and connections with
 * orange signal pulses travelling along the edges, floating dust and a few
 * translucent "bubbles" for depth. Everything is procedural (no textures) and
 * deterministic (seeded), so it looks the same on every visit.
 *
 * Loaded lazily by HeroScene only on capable devices. The render loop stops
 * when the hero is off-screen or the tab is hidden (`active`).
 */

const ORANGE = new THREE.Color("#FF702E");
const SOFT = new THREE.Color("#FF9A55");
const WHITE = new THREE.Color("#F5F5F5");

type Config = {
  nodes: number;
  dust: number;
  pulses: number;
  bubbles: number;
  links: number;
};

const CONFIG: Record<Exclude<DeviceTier, "poster">, Config> = {
  full: { nodes: 150, dust: 520, pulses: 16, bubbles: 6, links: 3 },
  reduced: { nodes: 80, dust: 200, pulses: 8, bubbles: 3, links: 2 },
};

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraph(cfg: Config) {
  const rand = rng(7);
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < cfg.nodes; i++) {
    // A wide, shallow volume, denser toward the centre-right.
    const u = rand() * 2 - 1;
    const x = Math.sign(u) * Math.pow(Math.abs(u), 0.85) * 7.2 + 1.6;
    const y = (rand() * 2 - 1) * 3.6;
    const z = (rand() * 2 - 1) * 2.6;
    positions.push(new THREE.Vector3(x, y, z));
  }

  const edges: [number, number][] = [];
  const neighbours: number[][] = positions.map(() => []);
  const seen = new Set<string>();
  positions.forEach((p, i) => {
    const nearest = positions
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((n) => n.j !== i && n.d < 6.5)
      .sort((a, b) => a.d - b.d)
      .slice(0, cfg.links);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      neighbours[i]!.push(j);
      neighbours[j]!.push(i);
    }
  });

  // A few "output" nodes glow orange, echoing the logo.
  const accentNodes = new Set<number>();
  while (accentNodes.size < Math.max(3, Math.round(cfg.nodes * 0.04))) {
    accentNodes.add(Math.floor(rand() * cfg.nodes));
  }

  return { positions, edges, neighbours, accentNodes, rand };
}

const pointVertex = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
    vColor = aColor;
    vAlpha = uOpacity * smoothstep(-16.0, -6.0, mv.z);
  }
`;

const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float alpha = pow(core, 1.6) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.15 + aSeed * 6.28) * 0.35;
    p.x += cos(uTime * 0.1 + aSeed * 3.14) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed * 1.6) * uPixelRatio * (10.0 / -mv.z);
    vAlpha = uOpacity * (0.25 + 0.35 * sin(uTime * 0.6 + aSeed * 20.0) * 0.5 + 0.2);
  }
`;

const dustFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(0.96, 0.96, 0.96, a);
  }
`;

const bubbleVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const bubbleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
    gl_FragColor = vec4(uColor, rim * uOpacity);
  }
`;

/**
 * Owns every mutable part of the scene (buffers, pulses, materials) so React
 * only holds one stable instance and per-frame updates happen inside `step()`.
 */
class LatticeSimulation {
  readonly graph: ReturnType<typeof buildGraph>;
  readonly nodes: { pos: Float32Array; col: Float32Array; sz: Float32Array };
  readonly edges: Float32Array;
  readonly dust: { pos: Float32Array; seed: Float32Array };
  readonly pulse: { pos: Float32Array; col: Float32Array; sz: Float32Array };
  readonly bubbles: { pos: THREE.Vector3; r: number; phase: number; warm: boolean }[];
  readonly materials: {
    nodes: THREE.ShaderMaterial;
    pulse: THREE.ShaderMaterial;
    dust: THREE.ShaderMaterial;
    lines: THREE.LineBasicMaterial;
    bubbleWarm: THREE.ShaderMaterial;
    bubbleCool: THREE.ShaderMaterial;
  };
  private pulses: { from: number; to: number; t: number; speed: number }[];
  private fade = 0;

  constructor(cfg: Config, pixelRatio: number) {
    const graph = buildGraph(cfg);
    this.graph = graph;

    const pos = new Float32Array(cfg.nodes * 3);
    const col = new Float32Array(cfg.nodes * 3);
    const sz = new Float32Array(cfg.nodes);
    graph.positions.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3);
      const accent = graph.accentNodes.has(i);
      (accent ? ORANGE : WHITE).toArray(col, i * 3);
      sz[i] = accent ? 10 : 4.2 + graph.rand() * 3.2;
    });
    this.nodes = { pos, col, sz };

    this.edges = new Float32Array(graph.edges.length * 6);
    graph.edges.forEach(([a, b], i) => {
      const p = graph.positions[a]!;
      const q = graph.positions[b]!;
      this.edges.set([p.x, p.y, p.z, q.x, q.y, q.z], i * 6);
    });

    const dustRand = rng(21);
    const dustPos = new Float32Array(cfg.dust * 3);
    const dustSeed = new Float32Array(cfg.dust);
    for (let i = 0; i < cfg.dust; i++) {
      dustPos.set(
        [
          (dustRand() * 2 - 1) * 11,
          (dustRand() * 2 - 1) * 6,
          (dustRand() * 2 - 1) * 5 - 1,
        ],
        i * 3,
      );
      dustSeed[i] = dustRand();
    }
    this.dust = { pos: dustPos, seed: dustSeed };

    const pulseRand = rng(99);
    this.pulses = Array.from({ length: cfg.pulses }, () => {
      const from = Math.floor(pulseRand() * cfg.nodes);
      const options = graph.neighbours[from] ?? [];
      return {
        from,
        to: options.length ? options[Math.floor(pulseRand() * options.length)]! : from,
        t: pulseRand(),
        speed: 0.35 + pulseRand() * 0.45,
      };
    });
    const pulseCol = new Float32Array(cfg.pulses * 3);
    const pulseSz = new Float32Array(cfg.pulses).fill(13);
    for (let i = 0; i < cfg.pulses; i++)
      (i % 3 === 0 ? SOFT : ORANGE).toArray(pulseCol, i * 3);
    this.pulse = { pos: new Float32Array(cfg.pulses * 3), col: pulseCol, sz: pulseSz };

    const bubbleRand = rng(5);
    this.bubbles = Array.from({ length: cfg.bubbles }, (_, i) => ({
      pos: new THREE.Vector3(
        (bubbleRand() * 2 - 1) * 6 + 2,
        (bubbleRand() * 2 - 1) * 2.8,
        (bubbleRand() * 2 - 1) * 2 - 0.5,
      ),
      r: 0.35 + bubbleRand() * 0.9,
      phase: bubbleRand() * Math.PI * 2,
      warm: i % 2 === 0,
    }));

    const points = () =>
      new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        uniforms: { uPixelRatio: { value: pixelRatio }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
    const bubble = (warm: boolean) =>
      new THREE.ShaderMaterial({
        vertexShader: bubbleVertex,
        fragmentShader: bubbleFragment,
        uniforms: { uColor: { value: warm ? SOFT : WHITE }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
      });
    this.materials = {
      nodes: points(),
      pulse: points(),
      dust: new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
      }),
      lines: new THREE.LineBasicMaterial({
        color: WHITE,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      bubbleWarm: bubble(true),
      bubbleCool: bubble(false),
    };
  }

  /** Advances fades and pulses; returns the eased fade-in value (0–1). */
  step(dt: number, t: number) {
    this.fade = Math.min(1, this.fade + dt * 0.7);
    const f = this.fade * this.fade * (3 - 2 * this.fade);
    const m = this.materials;
    m.nodes.uniforms.uOpacity!.value = 0.95 * f;
    m.pulse.uniforms.uOpacity!.value = f;
    m.dust.uniforms.uOpacity!.value = f;
    m.dust.uniforms.uTime!.value = t;
    m.lines.opacity = 0.11 * f;
    m.bubbleWarm.uniforms.uOpacity!.value = 0.22 * f;
    m.bubbleCool.uniforms.uOpacity!.value = 0.14 * f;

    const { positions, neighbours, rand } = this.graph;
    this.pulses.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const options = (neighbours[p.to] ?? []).filter((n) => n !== p.from);
        const next = options.length
          ? options[Math.floor(rand() * options.length)]!
          : p.from;
        p.from = p.to;
        p.to = next;
        p.t = 0;
      }
      const a = positions[p.from]!;
      const b = positions[p.to]!;
      this.pulse.pos[i * 3] = a.x + (b.x - a.x) * p.t;
      this.pulse.pos[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
      this.pulse.pos[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
    });
    return f;
  }

  dispose() {
    Object.values(this.materials).forEach((m) => m.dispose());
  }
}

function Lattice({ cfg, onReady }: { cfg: Config; onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const pulseGeom = useRef<THREE.BufferGeometry>(null);
  const bubbleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const { gl, size } = useThree();
  const sim = useMemo(() => new LatticeSimulation(cfg, gl.getPixelRatio()), [cfg, gl]);

  useEffect(() => {
    onReady();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      sim.dispose();
    };
  }, [sim, onReady]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    sim.step(Math.min(delta, 0.05), t);

    const g = group.current;
    if (g) {
      g.rotation.y +=
        (pointer.current.x * 0.12 + Math.sin(t * 0.05) * 0.12 - g.rotation.y) * 0.03;
      g.rotation.x += (pointer.current.y * 0.06 - g.rotation.x) * 0.03;
    }
    const attr = pulseGeom.current?.getAttribute("position");
    if (attr) attr.needsUpdate = true;
    sim.bubbles.forEach((b, i) => {
      const mesh = bubbleRefs.current[i];
      if (mesh) mesh.position.y = b.pos.y + Math.sin(t * 0.35 + b.phase) * 0.35;
    });
  });

  // Shift the lattice right on wide screens so the headline stays clear.
  const offsetX = size.width >= 1024 ? 1.6 : 0;
  const m = sim.materials;

  return (
    <group ref={group} position={[offsetX, 0, 0]}>
      <lineSegments material={m.lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sim.edges, 3]} />
        </bufferGeometry>
      </lineSegments>
      <points material={m.nodes}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sim.nodes.pos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[sim.nodes.col, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sim.nodes.sz, 1]} />
        </bufferGeometry>
      </points>
      <points material={m.pulse}>
        <bufferGeometry ref={pulseGeom}>
          <bufferAttribute attach="attributes-position" args={[sim.pulse.pos, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[sim.pulse.col, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sim.pulse.sz, 1]} />
        </bufferGeometry>
      </points>
      <points material={m.dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sim.dust.pos, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[sim.dust.seed, 1]} />
        </bufferGeometry>
      </points>
      {sim.bubbles.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            bubbleRefs.current[i] = el;
          }}
          position={b.pos}
          material={b.warm ? m.bubbleWarm : m.bubbleCool}
        >
          <sphereGeometry args={[b.r, 32, 24]} />
        </mesh>
      ))}
    </group>
  );
}

export default function NeuralLatticeScene({
  tier,
  active,
  onReady,
}: {
  tier: Exclude<DeviceTier, "poster">;
  active: boolean;
  onReady: () => void;
}) {
  const cfg = CONFIG[tier];
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={tier === "full" ? [1, 1.5] : [1, 1.25]}
      camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 50 }}
      gl={{ antialias: tier === "full", alpha: true, powerPreference: "low-power" }}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    >
      <Lattice cfg={cfg} onReady={onReady} />
    </Canvas>
  );
}
