import { i as __toESM } from "../_runtime.mjs";
import { A as require_react, C as PointsMaterial, D as Vector3, E as SRGBColorSpace, S as Points, T as RepeatWrapping, _ as Line$1, b as Matrix4, c as useThree, d as BufferGeometry, f as CanvasTexture, g as Euler, h as DodecahedronGeometry, i as Html, k as require_jsx_runtime, m as Color, n as OrbitControls, o as Canvas, p as ClampToEdgeWrapping, r as Line, s as useFrame, t as Stars, u as BufferAttribute, v as LineBasicMaterial, w as Quaternion, x as MeshStandardMaterial, y as MathUtils } from "../_libs/@react-three/drei+[...].mjs";
import { a as ORBITERS, i as BODY_MAP, n as useSolar, r as BODIES } from "./routes-C0CGFdgV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/System-VRh3EI7_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var axisY = new Vector3(0, 1, 0);
var axisX = new Vector3(1, 0, 0);
function wrapPi(angle) {
	const x = (angle + Math.PI) % (Math.PI * 2);
	return (x < 0 ? x + Math.PI * 2 : x) - Math.PI;
}
function solveKepler(mean, e) {
	const M = wrapPi(mean);
	let E = e < .8 ? M : Math.PI;
	if (e < 1e-6) return M;
	for (let i = 0; i < 10; i++) {
		const f = E - e * Math.sin(E) - M;
		const fp = 1 - e * Math.cos(E);
		E -= f / fp;
	}
	return E;
}
function place(def, E, out) {
	const x = def.a * (Math.cos(E) - def.e);
	const z = def.a * Math.sqrt(Math.max(0, 1 - def.e * def.e)) * Math.sin(E);
	out.set(x, 0, z);
	out.applyAxisAngle(axisY, def.arg);
	out.applyAxisAngle(axisX, def.inc);
	out.applyAxisAngle(axisY, def.node);
	return out;
}
function bodyPosition(def, t, out) {
	if (def.a === 0) return out.set(0, 0, 0);
	const n = Math.PI * 2 / def.period;
	return place(def, solveKepler((def.retrograde ? -1 : 1) * n * t + def.phase, def.e), out);
}
function orbitPoint(def, E, out) {
	return place(def, E, out);
}
var sim = { t: 0 };
function canvas(w, h) {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const g = c.getContext("2d");
	if (!g) throw new Error("2d");
	return {
		c,
		g
	};
}
function hash$1(n) {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
function asTexture(c, wrap = ClampToEdgeWrapping) {
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	t.wrapS = wrap;
	t.wrapT = wrap;
	t.anisotropy = 4;
	return t;
}
function noisePlanet(base, spot, amount) {
	const { c, g } = canvas(512, 256);
	g.fillStyle = base;
	g.fillRect(0, 0, 512, 256);
	for (let i = 0; i < 90; i++) {
		g.fillStyle = spot;
		g.globalAlpha = .18 + hash$1(i) * amount;
		g.beginPath();
		g.ellipse(hash$1(i + 1) * 512, hash$1(i + 2) * 256, 8 + hash$1(i + 3) * 28, 6 + hash$1(i + 4) * 16, 0, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	return asTexture(c, RepeatWrapping);
}
function smoothBands(a, b) {
	const { c, g } = canvas(512, 256);
	const grd = g.createLinearGradient(0, 0, 0, 256);
	grd.addColorStop(0, a);
	grd.addColorStop(.45, b);
	grd.addColorStop(1, a);
	g.fillStyle = grd;
	g.fillRect(0, 0, 512, 256);
	g.globalAlpha = .18;
	for (let i = 0; i < 18; i++) {
		g.fillStyle = i % 2 ? "#ffffff" : "#5c5348";
		g.fillRect(0, i / 18 * 256, 512, 6 + hash$1(i) * 10);
	}
	g.globalAlpha = 1;
	return asTexture(c, RepeatWrapping);
}
function sunTexture() {
	const { c, g } = canvas(512, 256);
	g.fillStyle = "#f6de9a";
	g.fillRect(0, 0, 512, 256);
	for (let i = 0; i < 70; i++) {
		g.fillStyle = i % 3 === 0 ? "#fff6d4" : "#e39a45";
		g.globalAlpha = .22 + hash$1(i) * .35;
		g.beginPath();
		g.ellipse(hash$1(i + 2) * 512, hash$1(i + 3) * 256, 30 + hash$1(i + 4) * 80, 12 + hash$1(i + 5) * 28, hash$1(i) * 3, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	return asTexture(c, RepeatWrapping);
}
function earthTexture() {
	const { c, g } = canvas(1024, 512);
	g.fillStyle = "#1c4e86";
	g.fillRect(0, 0, 1024, 512);
	for (let i = 0; i < 40; i++) {
		g.fillStyle = "#163e70";
		g.globalAlpha = .35;
		g.beginPath();
		g.ellipse(hash$1(i) * 1024, hash$1(i + 8) * 512, 50 + hash$1(i + 2) * 90, 18 + hash$1(i + 3) * 24, 0, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	const land = "#2f7d46";
	const landDark = "#24653a";
	for (const [x, y, rx, ry, rot] of [
		[
			230,
			210,
			78,
			120,
			.4
		],
		[
			250,
			150,
			46,
			70,
			.2
		],
		[
			210,
			280,
			40,
			50,
			-.3
		],
		[
			190,
			120,
			36,
			40,
			.5
		],
		[
			500,
			170,
			90,
			50,
			.2
		],
		[
			560,
			150,
			70,
			40,
			-.4
		],
		[
			620,
			190,
			80,
			46,
			.3
		],
		[
			700,
			170,
			60,
			36,
			.1
		],
		[
			520,
			250,
			54,
			70,
			.4
		],
		[
			500,
			310,
			36,
			40,
			.2
		],
		[
			800,
			330,
			48,
			28,
			.3
		],
		[
			840,
			300,
			30,
			22,
			-.2
		],
		[
			310,
			70,
			34,
			22,
			.6
		]
	]) {
		g.fillStyle = land;
		g.beginPath();
		g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
		g.fill();
		g.fillStyle = landDark;
		g.globalAlpha = .45;
		g.beginPath();
		g.ellipse(x + 8, y + 4, rx * .45, ry * .4, rot, 0, Math.PI * 2);
		g.fill();
		g.globalAlpha = 1;
	}
	g.fillStyle = "#e7eef2";
	g.fillRect(0, 0, 1024, 26);
	g.fillRect(0, 486, 1024, 26);
	return asTexture(c, RepeatWrapping);
}
function cloudTexture() {
	const { c, g } = canvas(1024, 512);
	g.clearRect(0, 0, 1024, 512);
	for (let i = 0; i < 60; i++) {
		g.fillStyle = "#ffffff";
		g.globalAlpha = .18 + hash$1(i + 20) * .35;
		g.beginPath();
		g.ellipse(hash$1(i + 4) * 1024, hash$1(i + 6) * 512, 40 + hash$1(i) * 110, 10 + hash$1(i + 1) * 18, 0, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	return asTexture(c, RepeatWrapping);
}
function marsTexture() {
	const { c, g } = canvas(512, 256);
	g.fillStyle = "#c46a45";
	g.fillRect(0, 0, 512, 256);
	for (let i = 0; i < 40; i++) {
		g.fillStyle = i % 2 ? "#a84e32" : "#d8885c";
		g.globalAlpha = .4;
		g.beginPath();
		g.ellipse(hash$1(i + 9) * 512, hash$1(i + 3) * 256, 20 + hash$1(i) * 50, 10 + hash$1(i + 2) * 18, 0, 0, Math.PI * 2);
		g.fill();
	}
	g.globalAlpha = 1;
	g.fillStyle = "#f4f1ea";
	g.fillRect(0, 0, 512, 18);
	g.fillRect(0, 238, 512, 18);
	return asTexture(c, RepeatWrapping);
}
function jupiterTexture() {
	const { c, g } = canvas(1024, 512);
	const bands = [
		"#f0e0c4",
		"#d7b48a",
		"#f6ead2",
		"#c4926a",
		"#eddcc0",
		"#c98468",
		"#f3e6cf",
		"#a86a52",
		"#e7d3ae",
		"#f7efe0",
		"#c9ae86",
		"#efe2cc"
	];
	bands.forEach((color, i) => {
		const y = i / bands.length * 512;
		const h = 512 / bands.length + 2;
		g.fillStyle = color;
		g.fillRect(0, y, 1024, h);
		g.globalAlpha = .18;
		g.fillStyle = i % 2 ? "#fffaf2" : "#6a4030";
		for (let k = 0; k < 8; k++) {
			g.beginPath();
			g.ellipse((k * 140 + i * 30) % 1024, y + h * .5, 50, h * .28, 0, 0, Math.PI * 2);
			g.fill();
		}
		g.globalAlpha = 1;
	});
	g.fillStyle = "#c45b4a";
	g.beginPath();
	g.ellipse(680, 310, 78, 38, -.2, 0, Math.PI * 2);
	g.fill();
	g.fillStyle = "#a64438";
	g.beginPath();
	g.ellipse(690, 312, 42, 18, -.2, 0, Math.PI * 2);
	g.fill();
	return asTexture(c, RepeatWrapping);
}
function saturnTexture() {
	return smoothBands("#f3e6c8", "#d9c49a");
}
function glowTexture() {
	const { c, g } = canvas(256, 256);
	const grd = g.createRadialGradient(128, 128, 8, 128, 128, 128);
	grd.addColorStop(0, "rgba(255,255,255,1)");
	grd.addColorStop(.25, "rgba(255,236,200,0.7)");
	grd.addColorStop(.55, "rgba(255,180,90,0.18)");
	grd.addColorStop(1, "rgba(255,160,60,0)");
	g.fillStyle = grd;
	g.fillRect(0, 0, 256, 256);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function starGlow() {
	const { c, g } = canvas(128, 128);
	const grd = g.createRadialGradient(64, 64, 2, 64, 64, 64);
	grd.addColorStop(0, "rgba(255,255,255,1)");
	grd.addColorStop(.4, "rgba(255,244,220,0.45)");
	grd.addColorStop(1, "rgba(255,244,220,0)");
	g.fillStyle = grd;
	g.fillRect(0, 0, 128, 128);
	const t = new CanvasTexture(c);
	t.colorSpace = SRGBColorSpace;
	return t;
}
function makeTextures() {
	return {
		sun: sunTexture(),
		glow: glowTexture(),
		point: starGlow(),
		mercury: noisePlanet("#8c857c", "#5e584f", .4),
		venus: smoothBands("#f0e2bf", "#d2b57a"),
		earth: earthTexture(),
		clouds: cloudTexture(),
		mars: marsTexture(),
		jupiter: jupiterTexture(),
		saturn: saturnTexture(),
		uranus: smoothBands("#d5eeea", "#7eb8b0"),
		neptune: smoothBands("#6d8fe0", "#243e86"),
		moon: noisePlanet("#c9c4bb", "#7e7a74", .55)
	};
}
var MAP = {
	mercury: "mercury",
	venus: "venus",
	earth: "earth",
	mars: "mars",
	jupiter: "jupiter",
	saturn: "saturn",
	uranus: "uranus",
	neptune: "neptune"
};
function textureFor(textures, id) {
	const key = MAP[id];
	return key ? textures[key] : null;
}
var fur = "#e5923c";
var furDark = "#c56a28";
var belly = "#f4d7b0";
var white = "#f6f2ea";
var spot = "#e2a24c";
var nose = "#e7a097";
var eye = "#140e0c";
function Ear({ side }) {
	const q = (0, import_react.useMemo)(() => {
		const dir = new Vector3(side * .62, .12, -.78).normalize();
		return new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir);
	}, [side]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			side * .4,
			.86,
			.08
		],
		quaternion: q,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.16,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.2,
				.34,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: furDark,
				roughness: .8,
				emissive: "#3a1d10",
				emissiveIntensity: .25
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.15,
				.03
			],
			scale: .62,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.18,
				.26,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f0c2b6",
				roughness: .7
			})]
		})]
	});
}
function Whiskers({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			side * .2,
			.2,
			1.18
		],
		children: [
			-.35,
			.02,
			.32
		].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				side * .28,
				a * .12,
				0
			],
			rotation: [
				0,
				0,
				side * (Math.PI / 2) + a * .35
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.008,
				.008,
				.62,
				4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: white })]
		}, a))
	});
}
function Eye({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			side * .23,
			.58,
			1.12
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.125,
				20,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: eye,
				roughness: .2,
				metalness: .05
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					side * -.03,
					.035,
					.09
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.032,
					10,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#f7f8fb" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.07,
					.04
				],
				scale: [
					1.05,
					.42,
					.7
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.13,
					16,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: fur,
					roughness: .78,
					emissive: "#3a1d10",
					emissiveIntensity: .2
				})]
			})
		]
	});
}
function CatModel() {
	const spin = (0, import_react.useRef)(null);
	const mouth = (0, import_react.useRef)(null);
	const wall = (0, import_react.useRef)(0);
	useFrame((_, delta) => {
		const d = Math.min(delta, .05);
		const { paused, speed } = useSolar.getState();
		if (!paused) {
			const rate = .75 + .22 * Math.min(speed, 4);
			wall.current += d * rate;
		}
		const g = spin.current;
		if (!g) return;
		const w = wall.current;
		g.rotation.set(w * 1.65, w * 2.35, w * 1.15);
		if (mouth.current) {
			const open = .45 + Math.abs(Math.sin(w * 5.2)) * .85;
			mouth.current.scale.y = open;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: spin,
		scale: 1.05,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				scale: [
					1.05,
					.92,
					1.2
				],
				position: [
					0,
					-.05,
					-.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.58,
					32,
					24
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: fur,
					roughness: .78,
					emissive: "#3a1d10",
					emissiveIntensity: .32
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.22,
					.42
				],
				scale: [
					.62,
					.42,
					.36
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.42,
					20,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: belly,
					roughness: .8,
					emissive: "#3a1d10",
					emissiveIntensity: .12
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.18,
					.08,
					-.95
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.14,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.05,
					.28,
					-1.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.1,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: fur,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.02,
					.42,
					-1.22
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.07,
					10,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.42,
					.52
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.66,
					36,
					28
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: fur,
					roughness: .76,
					emissive: "#3a1d10",
					emissiveIntensity: .32
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.78,
					.78
				],
				rotation: [
					.45,
					0,
					.15
				],
				scale: [
					.42,
					.08,
					.16
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.45,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.12,
					.7,
					.86
				],
				rotation: [
					.4,
					0,
					.7
				],
				scale: [
					.28,
					.06,
					.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.4,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.12,
					.7,
					.86
				],
				rotation: [
					.4,
					0,
					-.7
				],
				scale: [
					.28,
					.06,
					.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.4,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, { side: -1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, { side: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.24,
					1.02
				],
				scale: [
					.92,
					.62,
					.48
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.36,
					24,
					18
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: white,
					roughness: .72,
					emissive: "#2a241c",
					emissiveIntensity: .12
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.15,
					.16,
					1.22
				],
				scale: [
					1.1,
					.7,
					.55
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.07,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: spot,
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.15,
					.16,
					1.22
				],
				scale: [
					1.1,
					.7,
					.55
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.07,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: spot,
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.3,
					1.28
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.065,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: nose,
					roughness: .45
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: mouth,
				position: [
					0,
					.16,
					1.26
				],
				scale: [
					1,
					.5,
					.55
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.055,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#3a2420",
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { side: -1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { side: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.22,
					.72,
					1.02
				],
				rotation: [
					.2,
					0,
					.45
				],
				scale: [
					.28,
					.06,
					.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.4,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.22,
					.72,
					1.02
				],
				rotation: [
					.2,
					0,
					-.45
				],
				scale: [
					.28,
					.06,
					.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.4,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: furDark,
					roughness: .8
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Whiskers, { side: -1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Whiskers, { side: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.22,
					-.48,
					.32
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.12,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: white,
					roughness: .75
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.22,
					-.48,
					.32
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.12,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: white,
					roughness: .75
				})]
			})
		]
	});
}
var TexCtx = (0, import_react.createContext)(null);
function useTex() {
	const v = (0, import_react.useContext)(TexCtx);
	if (!v) throw new Error("textures");
	return v;
}
var ATMOS_VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
var ATMOS_FRAG = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uStrength;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.15);
    gl_FragColor = vec4(uColor, fres * uStrength);
  }
`;
function Atmosphere({ radius, color, strength }) {
	const uniforms = (0, import_react.useMemo)(() => ({
		uColor: { value: new Color(color) },
		uStrength: { value: strength }
	}), [color, strength]);
	if (strength <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		scale: radius,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			32,
			24
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("shaderMaterial", {
			transparent: true,
			depthWrite: false,
			blending: 2,
			uniforms,
			vertexShader: ATMOS_VERT,
			fragmentShader: ATMOS_FRAG
		})]
	});
}
function SimClock() {
	const stamp = (0, import_react.useRef)(0);
	useFrame((_, delta) => {
		const d = Math.min(delta, .05);
		const { paused, speed } = useSolar.getState();
		if (!paused) sim.t += d * speed;
		stamp.current += delta;
		if (stamp.current > .2) {
			stamp.current = 0;
			const days = sim.t / 36 * 365.25;
			if (Math.abs(days - useSolar.getState().simDays) > .05) useSolar.getState().setSimDays(days);
		}
	});
	return null;
}
function CameraRig() {
	const camera = useThree((s) => s.camera);
	const get = useThree((s) => s.get);
	const mode = (0, import_react.useRef)("idle");
	const lastFocus = (0, import_react.useRef)(0);
	const lastReset = (0, import_react.useRef)(0);
	const prev = (0, import_react.useRef)(new Vector3());
	const goal = (0, import_react.useRef)(new Vector3(12, 22, 48));
	const tmp = (0, import_react.useRef)(new Vector3());
	const desired = (0, import_react.useRef)(new Vector3());
	const camGoal = (0, import_react.useRef)(new Vector3());
	(0, import_react.useEffect)(() => {
		let stop = false;
		let raf = 0;
		let detach = null;
		const attach = () => {
			if (stop) return;
			const controls = get().controls;
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
		const controls = get().controls;
		if (!controls) return;
		const d = Math.min(delta, .05);
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
				if (dir.lengthSq() < .25) dir.set(.45, .38, 1);
				dir.normalize();
				if (dir.y < .22) dir.y = .36;
				dir.normalize().multiplyScalar(dist);
				goal.current.copy(dir);
			}
		} else if (!selected && mode.current === "track") mode.current = "idle";
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
		if (camera.position.distanceTo(camGoal.current) < .45 && controls.target.distanceTo(target) < .35) {
			mode.current = selected ? "track" : "idle";
			controls.target.copy(target);
			prev.current.copy(target);
		}
	}, -1);
	return null;
}
function OrbitLines() {
	const show = useSolar((s) => s.showOrbits);
	const lines = (0, import_react.useMemo)(() => {
		return ORBITERS.map((def) => {
			const pts = [];
			const tmp = new Vector3();
			const steps = def.kind === "comet" ? 220 : 128;
			for (let i = 0; i <= steps; i++) {
				orbitPoint(def, i / steps * Math.PI * 2, tmp);
				pts.push(tmp.clone());
			}
			return {
				id: def.id,
				pts,
				comet: def.kind === "comet"
			};
		});
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
		points: line.pts,
		color: line.comet ? "#b7a394" : "#8e97a6",
		lineWidth: 1,
		transparent: true,
		opacity: line.comet ? .7 : .38,
		raycast: () => null
	}, line.id)) });
}
function Label({ def }) {
	const show = useSolar((s) => s.showLabels);
	const hot = useSolar((s) => s.selected === def.id);
	if (!show && !hot) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		position: [
			0,
			def.hit * .72 + .25,
			0
		],
		center: true,
		distanceFactor: 18,
		zIndexRange: [12, 0],
		pointerEvents: "none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tag",
			"data-hot": hot ? "true" : "false",
			children: def.name
		})
	});
}
function pick(id) {
	useSolar.getState().select(id);
}
function BodyMesh({ def }) {
	const root = (0, import_react.useRef)(null);
	const spin = (0, import_react.useRef)(null);
	const clouds = (0, import_react.useRef)(null);
	const moon = (0, import_react.useRef)(null);
	const pos = (0, import_react.useRef)(new Vector3());
	const textures = useTex();
	const map = textureFor(textures, def.id);
	const selected = useSolar((s) => s.selected === def.id);
	useFrame(() => {
		bodyPosition(def, sim.t, pos.current);
		if (root.current) root.current.position.copy(pos.current);
		if (spin.current) spin.current.rotation.y = sim.t * def.spin;
		if (clouds.current) clouds.current.rotation.y = sim.t * .22;
		if (moon.current) {
			const a = sim.t * 1.35;
			moon.current.position.set(Math.cos(a) * 1.45, .1, Math.sin(a) * 1.45);
		}
	});
	const onOver = (e) => {
		e.stopPropagation();
		document.body.style.cursor = "pointer";
	};
	const onOut = () => {
		document.body.style.cursor = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				rotation: [
					0,
					0,
					def.tilt
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						ref: spin,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
							scale: [
								def.radius,
								def.radius * def.flatten,
								def.radius
							],
							onClick: (e) => {
								e.stopPropagation();
								pick(def.id);
							},
							onPointerOver: onOver,
							onPointerOut: onOut,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
								1,
								def.radius > 1 ? 48 : 32,
								def.radius > 1 ? 32 : 24
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
								map: map ?? void 0,
								color: "#ffffff",
								roughness: .86,
								metalness: .02
							})]
						}), def.id === "earth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
							ref: clouds,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								scale: def.radius * 1.035,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									1,
									32,
									24
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									map: textures.clouds,
									transparent: true,
									opacity: .42,
									depthWrite: false,
									roughness: 1
								})]
							})
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {
						radius: def.radius * 1.12,
						color: def.rim,
						strength: def.rimStrength
					}),
					def.id === "saturn" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						rotation: [
							Math.PI / 2,
							0,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
							def.radius * 1.35,
							def.radius * 1.72,
							80
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#e6d7b8",
							side: 2,
							transparent: true,
							opacity: .78,
							roughness: .62
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
							def.radius * 1.86,
							def.radius * 2.28,
							80
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#cbb892",
							side: 2,
							transparent: true,
							opacity: .62,
							roughness: .7
						})] })]
					}) : null
				]
			}),
			def.id === "earth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
				ref: moon,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.14,
					20,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: textures.moon,
					roughness: .95
				})] })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					pick(def.id);
				},
				onPointerOver: onOver,
				onPointerOut: onOut,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					def.hit,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					transparent: true,
					opacity: 0,
					depthWrite: false,
					colorWrite: false
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
					def.hit * 1.05,
					def.hit * 1.16,
					64
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#d7dbe3",
					side: 2,
					transparent: true,
					opacity: .85
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { def })
		]
	});
}
function Sun() {
	const def = BODY_MAP.sun;
	const textures = useTex();
	const spin = (0, import_react.useRef)(null);
	const selected = useSolar((s) => s.selected === "sun");
	useFrame(() => {
		if (spin.current) spin.current.rotation.y = sim.t * def.spin;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: spin,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					pick("sun");
				},
				onPointerOver: () => {
					document.body.style.cursor = "pointer";
				},
				onPointerOut: () => {
					document.body.style.cursor = "";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					def.radius,
					48,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { map: textures.sun })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
			scale: [
				11,
				11,
				1
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
				map: textures.glow,
				transparent: true,
				depthWrite: false,
				blending: 2,
				opacity: .85,
				color: "#fff1cc"
			})
		}),
		selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				3.3,
				3.5,
				64
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#d7dbe3",
				side: 2,
				transparent: true,
				opacity: .8
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { def }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				0,
				0,
				0
			],
			color: "#fff3dd",
			intensity: 280,
			distance: 0,
			decay: 2
		})
	] });
}
function Belt() {
	const count = 180;
	const ref = (0, import_react.useRef)(null);
	const geo = (0, import_react.useMemo)(() => new DodecahedronGeometry(1, 0), []);
	const mat = (0, import_react.useMemo)(() => new MeshStandardMaterial({
		color: "#ffffff",
		roughness: .92
	}), []);
	(0, import_react.useLayoutEffect)(() => {
		const mesh = ref.current;
		if (!mesh) return;
		const m = new Matrix4();
		const q = new Quaternion();
		const s = new Vector3();
		const p = new Vector3();
		const c = new Color();
		for (let i = 0; i < count; i++) {
			const a = i / count * Math.PI * 2 + i % 5 * .02;
			const r = 17.4 + i * 17 % 23 * .09;
			p.set(Math.cos(a) * r, (i * 13 % 11 - 5) * .06, Math.sin(a) * r);
			q.setFromEuler(new Euler(i * .4, i * .2, i * .7));
			s.setScalar(.045 + i % 6 * .012);
			m.compose(p, q, s);
			mesh.setMatrixAt(i, m);
			mesh.setColorAt(i, c.setHSL(.07, .08, .32 + i % 5 * .05));
		}
		mesh.instanceMatrix.needsUpdate = true;
		if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
	}, []);
	useFrame((_, delta) => {
		const d = Math.min(delta, .05);
		const { paused, speed } = useSolar.getState();
		if (paused || !ref.current) return;
		ref.current.rotation.y += d * speed * .012;
	});
	(0, import_react.useEffect)(() => {
		return () => {
			geo.dispose();
			mat.dispose();
		};
	}, [geo, mat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		ref,
		args: [
			geo,
			mat,
			count
		]
	});
}
var TAIL = 220;
function CometTail() {
	const textures = useTex();
	const dustGeo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new BufferAttribute(/* @__PURE__ */ new Float32Array(660), 3));
		g.setAttribute("color", new BufferAttribute(/* @__PURE__ */ new Float32Array(660), 3));
		return g;
	}, []);
	const ionGeo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new BufferAttribute(/* @__PURE__ */ new Float32Array(660), 3));
		g.setAttribute("color", new BufferAttribute(/* @__PURE__ */ new Float32Array(660), 3));
		return g;
	}, []);
	const dust = (0, import_react.useMemo)(() => {
		const m = new PointsMaterial({
			size: .42,
			map: textures.point,
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			blending: 2,
			sizeAttenuation: true
		});
		return new Points(dustGeo, m);
	}, [dustGeo, textures.point]);
	const ion = (0, import_react.useMemo)(() => {
		const m = new LineBasicMaterial({
			vertexColors: true,
			transparent: true,
			depthWrite: false,
			blending: 2
		});
		const line = new Line$1(ionGeo, m);
		line.frustumCulled = false;
		return line;
	}, [ionGeo]);
	const tmp = (0, import_react.useRef)(new Vector3());
	const radial = (0, import_react.useRef)(new Vector3());
	const side = (0, import_react.useRef)(new Vector3());
	const up = (0, import_react.useRef)(new Vector3(0, 1, 0));
	(0, import_react.useEffect)(() => {
		return () => {
			dustGeo.dispose();
			ionGeo.dispose();
			dust.material.dispose();
			ion.material.dispose();
		};
	}, [
		dust,
		dustGeo,
		ion,
		ionGeo
	]);
	useFrame(() => {
		const def = BODY_MAP.maodie;
		const head = tmp.current;
		bodyPosition(def, sim.t, head);
		const dist = head.length();
		const activity = MathUtils.clamp(1.35 - dist / 34, .22, 1);
		const span = 5 + activity * 14;
		const dPos = dustGeo.getAttribute("position");
		const dCol = dustGeo.getAttribute("color");
		const iPos = ionGeo.getAttribute("position");
		const iCol = ionGeo.getAttribute("color");
		for (let i = 0; i < TAIL; i++) {
			const u = i / 219;
			const age = 1 - u;
			bodyPosition(def, sim.t - age * span, head);
			radial.current.copy(head);
			if (radial.current.lengthSq() < 1e-4) radial.current.set(0, 1, 0);
			radial.current.normalize();
			side.current.crossVectors(radial.current, up.current);
			if (side.current.lengthSq() < 1e-4) side.current.set(1, 0, 0);
			side.current.normalize();
			const jitter = (hash(i) - .5) * age * (.35 + activity);
			const lift = (hash(i + 40) - .5) * age * .45;
			const dx = head.x + side.current.x * jitter + radial.current.x * age * .4;
			const dy = head.y + lift * .35;
			const dz = head.z + side.current.z * jitter + radial.current.z * age * .4;
			dPos.setXYZ(i, dx, dy, dz);
			const hot = u * u;
			dCol.setXYZ(i, .25 + hot * .75, .08 + hot * .62, .03 + hot * .28);
			const ix = head.x + radial.current.x * age * (2.2 + activity * 6);
			const iy = head.y + radial.current.y * age * (2.2 + activity * 6);
			const iz = head.z + radial.current.z * age * (2.2 + activity * 6);
			iPos.setXYZ(i, ix, iy, iz);
			iCol.setXYZ(i, hot * .55, hot * .7, hot * .95);
		}
		dPos.needsUpdate = true;
		dCol.needsUpdate = true;
		iPos.needsUpdate = true;
		iCol.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: dust }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: ion })] });
}
function hash(n) {
	const x = Math.sin(n * 127.1 + 19.19) * 43758.5453;
	return x - Math.floor(x);
}
function Comet() {
	const def = BODY_MAP.maodie;
	const root = (0, import_react.useRef)(null);
	const pos = (0, import_react.useRef)(new Vector3());
	const textures = useTex();
	const selected = useSolar((s) => s.selected === def.id);
	const coma = (0, import_react.useRef)(null);
	useFrame(() => {
		bodyPosition(def, sim.t, pos.current);
		if (root.current) root.current.position.copy(pos.current);
		if (coma.current) {
			const dist = pos.current.length();
			const s = 2.4 + MathUtils.clamp(1.4 - dist / 32, .35, 1.15) * 2.2;
			coma.current.scale.set(s, s, 1);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: root,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sprite", {
				ref: coma,
				scale: [
					3.2,
					3.2,
					1
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spriteMaterial", {
					map: textures.glow,
					transparent: true,
					depthWrite: false,
					blending: 2,
					opacity: .55,
					color: "#ffb068"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color: "#ffc39a",
				intensity: 8,
				distance: 14,
				decay: 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatModel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				onClick: (e) => {
					e.stopPropagation();
					pick(def.id);
				},
				onPointerOver: () => {
					document.body.style.cursor = "pointer";
				},
				onPointerOut: () => {
					document.body.style.cursor = "";
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					def.hit,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					transparent: true,
					opacity: 0,
					depthWrite: false,
					colorWrite: false
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
					1.85,
					2.02,
					48
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#d7dbe3",
					side: 2,
					transparent: true,
					opacity: .85
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { def })
		]
	});
}
function Scene() {
	const textures = (0, import_react.useMemo)(() => makeTextures(), []);
	(0, import_react.useEffect)(() => {
		return () => {
			Object.values(textures).forEach((t) => t.dispose());
		};
	}, [textures]);
	const planets = BODIES.filter((b) => b.kind === "planet");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TexCtx.Provider, {
		value: textures,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#07080c"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
				"#243044",
				"#07080c",
				.38
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .22 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimClock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
				radius: 220,
				depth: 70,
				count: 3200,
				factor: 2.6,
				fade: true,
				saturation: 0,
				speed: .15
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Belt, {}),
			planets.map((def) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyMesh, { def }, def.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitLines, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CometTail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
				makeDefault: true,
				enableDamping: true,
				dampingFactor: .08,
				enablePan: false,
				minDistance: 1.4,
				maxDistance: 150,
				rotateSpeed: .7,
				zoomSpeed: .65
			})
		]
	});
}
function System() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		className: "stage-canvas",
		dpr: [1, 1.6],
		camera: {
			position: [
				12,
				22,
				48
			],
			fov: 40,
			near: .08,
			far: 700
		},
		gl: {
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		},
		onCreated: ({ gl }) => {
			gl.setClearColor("#07080c");
			gl.toneMapping = 4;
			gl.toneMappingExposure = 1.12;
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
	});
}
//#endregion
export { System };
