import * as THREE from "three";
import type { BodyDef } from "@/components/solar/data";

const axisY = new THREE.Vector3(0, 1, 0);
const axisX = new THREE.Vector3(1, 0, 0);

function wrapPi(angle: number) {
  const x = (angle + Math.PI) % (Math.PI * 2);
  const w = x < 0 ? x + Math.PI * 2 : x;
  return w - Math.PI;
}

function solveKepler(mean: number, e: number) {
  const M = wrapPi(mean);
  let E = e < 0.8 ? M : Math.PI;
  if (e < 1e-6) return M;
  for (let i = 0; i < 10; i++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    E -= f / fp;
  }
  return E;
}

function place(def: BodyDef, E: number, out: THREE.Vector3) {
  const x = def.a * (Math.cos(E) - def.e);
  const z = def.a * Math.sqrt(Math.max(0, 1 - def.e * def.e)) * Math.sin(E);
  out.set(x, 0, z);
  out.applyAxisAngle(axisY, def.arg);
  out.applyAxisAngle(axisX, def.inc);
  out.applyAxisAngle(axisY, def.node);
  return out;
}

export function bodyPosition(def: BodyDef, t: number, out: THREE.Vector3) {
  if (def.a === 0) return out.set(0, 0, 0);
  const n = (Math.PI * 2) / def.period;
  const M = (def.retrograde ? -1 : 1) * n * t + def.phase;
  return place(def, solveKepler(M, def.e), out);
}

export function orbitPoint(def: BodyDef, E: number, out: THREE.Vector3) {
  return place(def, E, out);
}
