import { useContext, useEffect, useLayoutEffect, useMemo, useRef, createContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { BODIES, BODY_MAP, ORBITERS, type BodyDef } from "@/components/solar/data";
import { bodyPosition, orbitPoint } from "@/components/solar/orbit";
import { sim } from "@/components/solar/sim";
import { useSolar } from "@/components/solar/store";
import { makeTextures, textureFor, type TextureSet } from "@/components/solar/textures";
import { CatModel } from "@/components/solar/CatModel";
import { labelBridge } from "@/components/solar/labels";

const TexCtx = createContext<TextureSet | null>(null);

function useTex() {
  const v = useContext(TexCtx);
  if (!v) throw new Error("textures");
  return v;
}

const ATMOS_VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOS_FRAG = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uStrength;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.15);
    gl_FragColor = vec4(uColor, fres * uStrength);
  }
`;

function Atmosphere({ radius, color, strength }: { radius: number; color: string; strength: number }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uStrength: { value: strength },
    }),
    [color, strength],
  );
  if (strength <= 0) return null;
  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 32, 24]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={ATMOS_VERT}
        fragmentShader={ATMOS_FRAG}
      />
    </mesh>
  );
}

function SimClock() {
  const stamp = useRef(0);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const { paused, speed } = useSolar.getState();
    if (!paused) sim.t += d * speed;
    stamp.current += delta;
    if (stamp.current > 0.2) {
      stamp.current = 0;
      const days = (sim.t / 36) * 365.25;
      if (Math.abs(days - useSolar.getState().simDays) > 0.05) {
        useSolar.getState().setSimDays(days);
      }
    }
  });
  return null;
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  const get = useThree((s) => s.get);
  const mode = useRef<"idle" | "glide" | "track">("idle");
  const lastFocus = useRef(0);
  const lastReset = useRef(0);
  const prev = useRef(new THREE.Vector3());
  const goal = useRef(new THREE.Vector3(12, 22, 48));
  const tmp = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const camGoal = useRef(new THREE.Vector3());

  useEffect(() => {
    let stop = false;
    let raf = 0;
    let detach: (() => void) | null = null;
    const attach = () => {
      if (stop) return;
      const controls = get().controls as OrbitControlsImpl | null;
      if (!controls) {
        raf = requestAnimationFrame(attach);
        return;
      }
      const onStart = () => {
        if (mode.current === "glide" && useSolar.getState().selected) mode.current = "track";
      };
      controls.addEventListener("start", onStart);
      detach = () => controls.removeEventListener("start", onStart);
    };
    attach();
    return () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
      detach?.();
    };
  }, [get]);

  useFrame((_, delta) => {
    const controls = get().controls as OrbitControlsImpl | null;
    if (!controls) return;
    const d = Math.min(delta, 0.05);
    const { selected, resetViewTick, focusTick } = useSolar.getState();
    const target = desired.current;

    if (resetViewTick !== lastReset.current) {
      lastReset.current = resetViewTick;
      lastFocus.current = focusTick;
      mode.current = "glide";
      goal.current.set(12, 22, 48);
    } else if (focusTick !== lastFocus.current) {
      lastFocus.current = focusTick;
      if (selected) {
        mode.current = "glide";
        const dist = BODY_MAP[selected].focus;
        const dir = tmp.current.copy(camera.position).sub(controls.target);
        if (dir.lengthSq() < 0.25) dir.set(0.45, 0.38, 1);
        dir.normalize();
        if (dir.y < 0.22) dir.y = 0.36;
        dir.normalize().multiplyScalar(dist);
        goal.current.copy(dir);
      }
    } else if (!selected && mode.current === "track") {
      mode.current = "idle";
    }

    if (selected && mode.current !== "idle") bodyPosition(BODY_MAP[selected], sim.t, target);
    else target.set(0, 0, 0);

    if (mode.current === "track" && selected) {
      const deltaPos = tmp.current.copy(target).sub(prev.current);
      camera.position.add(deltaPos);
      controls.target.copy(target);
      prev.current.copy(target);
      return;
    }

    if (mode.current !== "glide") return;

    const k = 1 - Math.exp(-3.3 * d);
    controls.target.lerp(target, 1 - Math.exp(-7 * d));
    camGoal.current.copy(controls.target).add(goal.current);
    camera.position.lerp(camGoal.current, k);
    prev.current.copy(target);
    if (camera.position.distanceTo(camGoal.current) < 0.45 && controls.target.distanceTo(target) < 0.35) {
      mode.current = selected ? "track" : "idle";
      controls.target.copy(target);
      prev.current.copy(target);
    }
  }, -1);

  return null;
}

function OrbitLines() {
  const show = useSolar((s) => s.showOrbits);
  const lines = useMemo(() => {
    return ORBITERS.map((def) => {
      const pts: THREE.Vector3[] = [];
      const tmp = new THREE.Vector3();
      const steps = def.kind === "comet" ? 220 : 128;
      for (let i = 0; i <= steps; i++) {
        orbitPoint(def, (i / steps) * Math.PI * 2, tmp);
        pts.push(tmp.clone());
      }
      return { id: def.id, pts, comet: def.kind === "comet" };
    });
  }, []);
  if (!show) return null;
  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.pts}
          color={line.comet ? "#b7a394" : "#8e97a6"}
          lineWidth={1}
          transparent
          opacity={line.comet ? 0.7 : 0.38}
          raycast={() => null}
        />
      ))}
    </>
  );
}

function LabelBridge() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  labelBridge.camera = camera;
  labelBridge.width = size.width;
  labelBridge.height = size.height;
  return null;
}

function pick(id: string) {
  useSolar.getState().select(id);
}

function BodyMesh({ def }: { def: BodyDef }) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const clouds = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3());
  const textures = useTex();
  const map = textureFor(textures, def.id);
  const selected = useSolar((s) => s.selected === def.id);

  useFrame(() => {
    bodyPosition(def, sim.t, pos.current);
    if (root.current) root.current.position.copy(pos.current);
    if (spin.current) spin.current.rotation.y = sim.t * def.spin;
    if (clouds.current) clouds.current.rotation.y = sim.t * 0.22;
    if (moon.current) {
      const a = sim.t * 1.35;
      moon.current.position.set(Math.cos(a) * 1.45, 0.1, Math.sin(a) * 1.45);
    }
  });

  const onOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    document.body.style.cursor = "";
  };

  return (
    <group ref={root}>
      <group rotation={[0, 0, def.tilt]}>
        <group ref={spin}>
          <mesh
            scale={[def.radius, def.radius * def.flatten, def.radius]}
            onClick={(e) => {
              e.stopPropagation();
              pick(def.id);
            }}
            onPointerOver={onOver}
            onPointerOut={onOut}
          >
            <sphereGeometry args={[1, def.radius > 1 ? 48 : 32, def.radius > 1 ? 32 : 24]} />
            <meshStandardMaterial map={map ?? undefined} color="#ffffff" roughness={0.86} metalness={0.02} />
          </mesh>
          {def.id === "earth" ? (
            <group ref={clouds}>
              <mesh scale={def.radius * 1.035}>
                <sphereGeometry args={[1, 32, 24]} />
                <meshStandardMaterial
                  map={textures.clouds}
                  transparent
                  opacity={0.42}
                  depthWrite={false}
                  roughness={1}
                />
              </mesh>
            </group>
          ) : null}
        </group>
        <Atmosphere radius={def.radius * 1.12} color={def.rim} strength={def.rimStrength} />
        {def.id === "saturn" ? (
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[def.radius * 1.35, def.radius * 1.72, 80]} />
              <meshStandardMaterial
                color="#e6d7b8"
                side={THREE.DoubleSide}
                transparent
                opacity={0.78}
                roughness={0.62}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[def.radius * 1.86, def.radius * 2.28, 80]} />
              <meshStandardMaterial
                color="#cbb892"
                side={THREE.DoubleSide}
                transparent
                opacity={0.62}
                roughness={0.7}
              />
            </mesh>
          </group>
        ) : null}
      </group>
      {def.id === "earth" ? (
        <group ref={moon}>
          <mesh>
            <sphereGeometry args={[0.14, 20, 16]} />
            <meshStandardMaterial map={textures.moon} roughness={0.95} />
          </mesh>
        </group>
      ) : null}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          pick(def.id);
        }}
        onPointerOver={onOver}
        onPointerOut={onOut}
      >
        <sphereGeometry args={[def.hit, 10, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[def.hit * 1.05, def.hit * 1.16, 64]} />
          <meshBasicMaterial color="#d7dbe3" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      ) : null}
          </group>
  );
}

function Sun() {
  const def = BODY_MAP.sun;
  const textures = useTex();
  const spin = useRef<THREE.Group>(null);
  const selected = useSolar((s) => s.selected === "sun");
  useFrame(() => {
    if (spin.current) spin.current.rotation.y = sim.t * def.spin;
  });
  return (
    <group>
      <group ref={spin}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            pick("sun");
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <sphereGeometry args={[def.radius, 48, 32]} />
          <meshBasicMaterial map={textures.sun} />
        </mesh>
      </group>
      <sprite scale={[11, 11, 1]}>
        <spriteMaterial
          map={textures.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
          color="#fff1cc"
        />
      </sprite>
      {selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.3, 3.5, 64]} />
          <meshBasicMaterial color="#d7dbe3" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      ) : null}
            <pointLight position={[0, 0, 0]} color="#fff3dd" intensity={280} distance={0} decay={2} />
    </group>
  );
}

function Belt() {
  const count = 180;
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.92 }), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (i % 5) * 0.02;
      const r = 17.4 + ((i * 17) % 23) * 0.09;
      p.set(Math.cos(a) * r, (((i * 13) % 11) - 5) * 0.06, Math.sin(a) * r);
      q.setFromEuler(new THREE.Euler(i * 0.4, i * 0.2, i * 0.7));
      s.setScalar(0.045 + (i % 6) * 0.012);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.setHSL(0.07, 0.08, 0.32 + (i % 5) * 0.05));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const { paused, speed } = useSolar.getState();
    if (paused || !ref.current) return;
    ref.current.rotation.y += d * speed * 0.012;
  });
  useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);
  return <instancedMesh ref={ref} args={[geo, mat, count]} />;
}

const TAIL = 220;

function CometTail() {
  const textures = useTex();
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TAIL * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(TAIL * 3), 3));
    return g;
  }, []);
  const ionGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TAIL * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(TAIL * 3), 3));
    return g;
  }, []);
  const dust = useMemo(() => {
    const m = new THREE.PointsMaterial({
      size: 0.42,
      map: textures.point,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    return new THREE.Points(dustGeo, m);
  }, [dustGeo, textures.point]);
  const ion = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(ionGeo, m);
    line.frustumCulled = false;
    return line;
  }, [ionGeo]);
  const tmp = useRef(new THREE.Vector3());
  const radial = useRef(new THREE.Vector3());
  const side = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    return () => {
      dustGeo.dispose();
      ionGeo.dispose();
      (dust.material as THREE.Material).dispose();
      (ion.material as THREE.Material).dispose();
    };
  }, [dust, dustGeo, ion, ionGeo]);

  useFrame(() => {
    const def = BODY_MAP.maodie;
    const head = tmp.current;
    bodyPosition(def, sim.t, head);
    const dist = head.length();
    const activity = THREE.MathUtils.clamp(1.35 - dist / 34, 0.22, 1);
    const span = 5 + activity * 14;
    const dPos = dustGeo.getAttribute("position") as THREE.BufferAttribute;
    const dCol = dustGeo.getAttribute("color") as THREE.BufferAttribute;
    const iPos = ionGeo.getAttribute("position") as THREE.BufferAttribute;
    const iCol = ionGeo.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < TAIL; i++) {
      const u = i / (TAIL - 1);
      const age = 1 - u;
      bodyPosition(def, sim.t - age * span, head);
      radial.current.copy(head);
      if (radial.current.lengthSq() < 1e-4) radial.current.set(0, 1, 0);
      radial.current.normalize();
      side.current.crossVectors(radial.current, up.current);
      if (side.current.lengthSq() < 1e-4) side.current.set(1, 0, 0);
      side.current.normalize();
      const jitter = (hash(i) - 0.5) * age * (0.35 + activity);
      const lift = (hash(i + 40) - 0.5) * age * 0.45;
      const dx = head.x + side.current.x * jitter + radial.current.x * age * 0.4;
      const dy = head.y + lift * 0.35;
      const dz = head.z + side.current.z * jitter + radial.current.z * age * 0.4;
      dPos.setXYZ(i, dx, dy, dz);
      const hot = u * u;
      dCol.setXYZ(i, 0.25 + hot * 0.75, 0.08 + hot * 0.62, 0.03 + hot * 0.28);
      const ix = head.x + radial.current.x * age * (2.2 + activity * 6);
      const iy = head.y + radial.current.y * age * (2.2 + activity * 6);
      const iz = head.z + radial.current.z * age * (2.2 + activity * 6);
      iPos.setXYZ(i, ix, iy, iz);
      iCol.setXYZ(i, hot * 0.55, hot * 0.7, hot * 0.95);
    }
    dPos.needsUpdate = true;
    dCol.needsUpdate = true;
    iPos.needsUpdate = true;
    iCol.needsUpdate = true;
  });

  return (
    <>
      <primitive object={dust} />
      <primitive object={ion} />
    </>
  );
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 19.19) * 43758.5453;
  return x - Math.floor(x);
}

function Comet() {
  const def = BODY_MAP.maodie;
  const root = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3());
  const textures = useTex();
  const selected = useSolar((s) => s.selected === def.id);
  const coma = useRef<THREE.Sprite>(null);

  useFrame(() => {
    bodyPosition(def, sim.t, pos.current);
    if (root.current) root.current.position.copy(pos.current);
    if (coma.current) {
      const dist = pos.current.length();
      const activity = THREE.MathUtils.clamp(1.4 - dist / 32, 0.35, 1.15);
      const s = 2.4 + activity * 2.2;
      coma.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={root}>
      <sprite ref={coma} scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          map={textures.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.55}
          color="#ffb068"
        />
      </sprite>
      <pointLight color="#ffc39a" intensity={8} distance={14} decay={2} />
      <CatModel />
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          pick(def.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[def.hit, 12, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {selected ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.85, 2.02, 48]} />
          <meshBasicMaterial color="#d7dbe3" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      ) : null}
          </group>
  );
}

function Scene() {
  const textures = useMemo(() => makeTextures(), []);
  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);
  const planets = BODIES.filter((b) => b.kind === "planet");
  return (
    <TexCtx.Provider value={textures}>
      <color attach="background" args={["#07080c"]} />
      <hemisphereLight args={["#243044", "#07080c", 0.38]} />
      <ambientLight intensity={0.22} />
      <SimClock />
      <CameraRig />
      <LabelBridge />
      <Stars radius={220} depth={70} count={3200} factor={2.6} fade saturation={0} speed={0.15} />
      <Sun />
      <Belt />
      {planets.map((def) => (
        <BodyMesh key={def.id} def={def} />
      ))}
      <OrbitLines />
      <Comet />
      <CometTail />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={1.4}
        maxDistance={150}
        rotateSpeed={0.7}
        zoomSpeed={0.65}
      />
    </TexCtx.Provider>
  );
}

function LabelOverlay() {
  const layer = useRef<HTMLDivElement>(null);
  const tmp = useRef(new THREE.Vector3());

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const root = layer.current;
      const camera = labelBridge.camera;
      if (!root || !camera) return;
      const { showLabels, selected } = useSolar.getState();
      const { width, height } = labelBridge;
      const nodes = root.children;
      for (let i = 0; i < BODIES.length; i++) {
        const def = BODIES[i];
        const el = nodes[i] as HTMLElement | undefined;
        if (!el) continue;
        if (!showLabels && selected !== def.id) {
          el.style.display = "none";
          continue;
        }
        bodyPosition(def, sim.t, tmp.current);
        tmp.current.y += def.radius * 1.45 + 0.28;
        tmp.current.project(camera);
        if (tmp.current.z > 1) {
          el.style.display = "none";
          continue;
        }
        const x = (tmp.current.x * 0.5 + 0.5) * width;
        const y = (-tmp.current.y * 0.5 + 0.5) * height;
        el.style.display = "block";
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -120%)`;
        el.dataset.hot = selected === def.id ? "true" : "false";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={layer} className="labels" aria-hidden="true">
      {BODIES.map((body) => (
        <div key={body.id} className="tag">
          {body.name}
        </div>
      ))}
    </div>
  );
}

export function System() {
  return (
    <>
      <Canvas
        className="stage-canvas"
        dpr={[1, 1.6]}
        camera={{ position: [12, 22, 48], fov: 40, near: 0.08, far: 700 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#07080c");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
        }}
      >
        <Scene />
      </Canvas>
      <LabelOverlay />
    </>
  );
}
