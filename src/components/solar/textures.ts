import * as THREE from "three";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new Error("2d");
  return { c, g };
}

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function asTexture(c: HTMLCanvasElement, wrap: THREE.Wrapping = THREE.ClampToEdgeWrapping) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = wrap;
  t.wrapT = wrap;
  t.anisotropy = 4;
  return t;
}

function noisePlanet(base: string, spot: string, amount: number) {
  const { c, g } = canvas(512, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = spot;
    g.globalAlpha = 0.18 + hash(i) * amount;
    g.beginPath();
    g.ellipse(hash(i + 1) * 512, hash(i + 2) * 256, 8 + hash(i + 3) * 28, 6 + hash(i + 4) * 16, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  return asTexture(c, THREE.RepeatWrapping);
}

function smoothBands(a: string, b: string) {
  const { c, g } = canvas(512, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, a);
  grd.addColorStop(0.45, b);
  grd.addColorStop(1, a);
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 256);
  g.globalAlpha = 0.18;
  for (let i = 0; i < 18; i++) {
    g.fillStyle = i % 2 ? "#ffffff" : "#5c5348";
    g.fillRect(0, (i / 18) * 256, 512, 6 + hash(i) * 10);
  }
  g.globalAlpha = 1;
  return asTexture(c, THREE.RepeatWrapping);
}

function sunTexture() {
  const { c, g } = canvas(512, 256);
  g.fillStyle = "#f6de9a";
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = i % 3 === 0 ? "#fff6d4" : "#e39a45";
    g.globalAlpha = 0.22 + hash(i) * 0.35;
    g.beginPath();
    g.ellipse(hash(i + 2) * 512, hash(i + 3) * 256, 30 + hash(i + 4) * 80, 12 + hash(i + 5) * 28, hash(i) * 3, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  return asTexture(c, THREE.RepeatWrapping);
}

function earthTexture() {
  const { c, g } = canvas(1024, 512);
  g.fillStyle = "#1c4e86";
  g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = "#163e70";
    g.globalAlpha = 0.35;
    g.beginPath();
    g.ellipse(hash(i) * 1024, hash(i + 8) * 512, 50 + hash(i + 2) * 90, 18 + hash(i + 3) * 24, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  const land = "#2f7d46";
  const landDark = "#24653a";
  const blobs: Array<[number, number, number, number, number]> = [
    [230, 210, 78, 120, 0.4],
    [250, 150, 46, 70, 0.2],
    [210, 280, 40, 50, -0.3],
    [190, 120, 36, 40, 0.5],
    [500, 170, 90, 50, 0.2],
    [560, 150, 70, 40, -0.4],
    [620, 190, 80, 46, 0.3],
    [700, 170, 60, 36, 0.1],
    [520, 250, 54, 70, 0.4],
    [500, 310, 36, 40, 0.2],
    [800, 330, 48, 28, 0.3],
    [840, 300, 30, 22, -0.2],
    [310, 70, 34, 22, 0.6],
  ];
  for (const [x, y, rx, ry, rot] of blobs) {
    g.fillStyle = land;
    g.beginPath();
    g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = landDark;
    g.globalAlpha = 0.45;
    g.beginPath();
    g.ellipse(x + 8, y + 4, rx * 0.45, ry * 0.4, rot, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 1;
  }
  g.fillStyle = "#e7eef2";
  g.fillRect(0, 0, 1024, 26);
  g.fillRect(0, 486, 1024, 26);
  return asTexture(c, THREE.RepeatWrapping);
}

function cloudTexture() {
  const { c, g } = canvas(1024, 512);
  g.clearRect(0, 0, 1024, 512);
  for (let i = 0; i < 60; i++) {
    g.fillStyle = "#ffffff";
    g.globalAlpha = 0.18 + hash(i + 20) * 0.35;
    g.beginPath();
    g.ellipse(hash(i + 4) * 1024, hash(i + 6) * 512, 40 + hash(i) * 110, 10 + hash(i + 1) * 18, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  const t = asTexture(c, THREE.RepeatWrapping);
  return t;
}

function marsTexture() {
  const { c, g } = canvas(512, 256);
  g.fillStyle = "#c46a45";
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = i % 2 ? "#a84e32" : "#d8885c";
    g.globalAlpha = 0.4;
    g.beginPath();
    g.ellipse(hash(i + 9) * 512, hash(i + 3) * 256, 20 + hash(i) * 50, 10 + hash(i + 2) * 18, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.fillStyle = "#f4f1ea";
  g.fillRect(0, 0, 512, 18);
  g.fillRect(0, 238, 512, 18);
  return asTexture(c, THREE.RepeatWrapping);
}

function jupiterTexture() {
  const { c, g } = canvas(1024, 512);
  const bands = ["#f0e0c4", "#d7b48a", "#f6ead2", "#c4926a", "#eddcc0", "#c98468", "#f3e6cf", "#a86a52", "#e7d3ae", "#f7efe0", "#c9ae86", "#efe2cc"];
  bands.forEach((color, i) => {
    const y = (i / bands.length) * 512;
    const h = 512 / bands.length + 2;
    g.fillStyle = color;
    g.fillRect(0, y, 1024, h);
    g.globalAlpha = 0.18;
    g.fillStyle = i % 2 ? "#fffaf2" : "#6a4030";
    for (let k = 0; k < 8; k++) {
      g.beginPath();
      g.ellipse((k * 140 + i * 30) % 1024, y + h * 0.5, 50, h * 0.28, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  });
  g.fillStyle = "#c45b4a";
  g.beginPath();
  g.ellipse(680, 310, 78, 38, -0.2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#a64438";
  g.beginPath();
  g.ellipse(690, 312, 42, 18, -0.2, 0, Math.PI * 2);
  g.fill();
  return asTexture(c, THREE.RepeatWrapping);
}

function saturnTexture() {
  return smoothBands("#f3e6c8", "#d9c49a");
}

function glowTexture() {
  const { c, g } = canvas(256, 256);
  const grd = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,236,200,0.7)");
  grd.addColorStop(0.55, "rgba(255,180,90,0.18)");
  grd.addColorStop(1, "rgba(255,160,60,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function starGlow() {
  const { c, g } = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.4, "rgba(255,244,220,0.45)");
  grd.addColorStop(1, "rgba(255,244,220,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeTextures() {
  return {
    sun: sunTexture(),
    glow: glowTexture(),
    point: starGlow(),
    mercury: noisePlanet("#8c857c", "#5e584f", 0.4),
    venus: smoothBands("#f0e2bf", "#d2b57a"),
    earth: earthTexture(),
    clouds: cloudTexture(),
    mars: marsTexture(),
    jupiter: jupiterTexture(),
    saturn: saturnTexture(),
    uranus: smoothBands("#d5eeea", "#7eb8b0"),
    neptune: smoothBands("#6d8fe0", "#243e86"),
    moon: noisePlanet("#c9c4bb", "#7e7a74", 0.55),
  };
}

export type TextureSet = ReturnType<typeof makeTextures>;

const MAP: Record<string, keyof TextureSet> = {
  mercury: "mercury",
  venus: "venus",
  earth: "earth",
  mars: "mars",
  jupiter: "jupiter",
  saturn: "saturn",
  uranus: "uranus",
  neptune: "neptune",
};

export function textureFor(textures: TextureSet, id: string) {
  const key = MAP[id];
  return key ? textures[key] : null;
}
