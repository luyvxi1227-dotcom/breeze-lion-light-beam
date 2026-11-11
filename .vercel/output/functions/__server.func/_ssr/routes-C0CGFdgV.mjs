import { i as __toESM } from "../_runtime.mjs";
import { A as require_react, k as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C0CGFdgV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var EARTH_A = 11;
var EARTH_PERIOD = 36;
function periodFor(a) {
	return EARTH_PERIOD * Math.pow(a / EARTH_A, 1.5);
}
var BODIES = [
	{
		id: "sun",
		name: "太阳",
		en: "Sun",
		kind: "star",
		swatch: "#f0d7a4",
		radius: 2.15,
		flatten: 1,
		a: 0,
		e: 0,
		inc: 0,
		node: 0,
		arg: 0,
		phase: 0,
		period: 1,
		retrograde: false,
		spin: .15,
		tilt: .12,
		focus: 16,
		hit: 3.1,
		rim: "#fff4d2",
		rimStrength: 0,
		diameter: "139.2 万 km",
		periodLabel: "赤道约 25 日",
		distance: "—",
		note: "光球，带一层日冕",
		blurb: "恒星。质量约占整个太阳系的 99.8%。画面里它仍然被缩小了，否则行星会小到看不见。"
	},
	{
		id: "mercury",
		name: "水星",
		en: "Mercury",
		kind: "planet",
		swatch: "#9a9288",
		radius: .32,
		flatten: 1,
		a: 5.4,
		e: .12,
		inc: .09,
		node: .7,
		arg: .4,
		phase: 1.2,
		period: periodFor(5.4),
		retrograde: false,
		spin: .35,
		tilt: .01,
		focus: 3.6,
		hit: .9,
		rim: "#c8c0b4",
		rimStrength: .35,
		diameter: "4,879 km",
		periodLabel: "88 日",
		distance: "0.39 AU",
		note: "几乎没有大气",
		blurb: "离太阳最近的行星，没有卫星，昼夜温差极端。"
	},
	{
		id: "venus",
		name: "金星",
		en: "Venus",
		kind: "planet",
		swatch: "#e2d0a4",
		radius: .52,
		flatten: 1,
		a: 7.6,
		e: .02,
		inc: .05,
		node: 1.4,
		arg: .2,
		phase: 2.4,
		period: periodFor(7.6),
		retrograde: false,
		spin: -.12,
		tilt: 3.09,
		focus: 4.6,
		hit: 1.05,
		rim: "#f0e2c0",
		rimStrength: .7,
		diameter: "12,104 km",
		periodLabel: "225 日",
		distance: "0.72 AU",
		note: "逆向自转",
		blurb: "厚厚的二氧化碳云层把表面盖住。它逆向自转，一天比一年还长。"
	},
	{
		id: "earth",
		name: "地球",
		en: "Earth",
		kind: "planet",
		swatch: "#6ea0d4",
		radius: .54,
		flatten: .996,
		a: EARTH_A,
		e: .017,
		inc: 0,
		node: 0,
		arg: .15,
		phase: .6,
		period: EARTH_PERIOD,
		retrograde: false,
		spin: 1.7,
		tilt: .41,
		focus: 5,
		hit: 1.15,
		rim: "#7eb6ff",
		rimStrength: .85,
		diameter: "12,742 km",
		periodLabel: "365.25 日",
		distance: "1.00 AU",
		note: "一颗卫星",
		blurb: "目前唯一确认有生命的行星。旁边跟着的小圆点是月球。"
	},
	{
		id: "mars",
		name: "火星",
		en: "Mars",
		kind: "planet",
		swatch: "#c47858",
		radius: .38,
		flatten: 1,
		a: 14.5,
		e: .07,
		inc: .04,
		node: .9,
		arg: 1.1,
		phase: 3.4,
		period: periodFor(14.5),
		retrograde: false,
		spin: 1.6,
		tilt: .44,
		focus: 4.2,
		hit: .95,
		rim: "#e0a080",
		rimStrength: .4,
		diameter: "6,779 km",
		periodLabel: "687 日",
		distance: "1.52 AU",
		note: "氧化铁把地表染红",
		blurb: "锈红色来自表面的氧化铁。这里有太阳系最高的火山，也有最长的峡谷。"
	},
	{
		id: "jupiter",
		name: "木星",
		en: "Jupiter",
		kind: "planet",
		swatch: "#d7b48a",
		radius: 1.38,
		flatten: .935,
		a: 22,
		e: .04,
		inc: .02,
		node: 1.8,
		arg: .5,
		phase: 4.5,
		period: periodFor(22),
		retrograde: false,
		spin: 3.1,
		tilt: .05,
		focus: 11,
		hit: 2.3,
		rim: "#f0ddc0",
		rimStrength: .28,
		diameter: "139,820 km",
		periodLabel: "11.9 年",
		distance: "5.20 AU",
		note: "大红斑是持久风暴",
		blurb: "气态巨行星，质量超过其他行星的总和。大红斑是一场持续了数百年的风暴。"
	},
	{
		id: "saturn",
		name: "土星",
		en: "Saturn",
		kind: "planet",
		swatch: "#e6d3a8",
		radius: 1.15,
		flatten: .9,
		a: 29.5,
		e: .05,
		inc: .04,
		node: 2.4,
		arg: .8,
		phase: 1.7,
		period: periodFor(29.5),
		retrograde: false,
		spin: 2.6,
		tilt: .47,
		focus: 13,
		hit: 2.6,
		rim: "#f3e6c8",
		rimStrength: .25,
		diameter: "116,460 km",
		periodLabel: "29.5 年",
		distance: "9.58 AU",
		note: "冰环与卡西尼环缝",
		blurb: "密度比水还小。环主要由冰粒组成，中间那道暗缝是卡西尼环缝。"
	},
	{
		id: "uranus",
		name: "天王星",
		en: "Uranus",
		kind: "planet",
		swatch: "#9fd0c8",
		radius: .78,
		flatten: .98,
		a: 38,
		e: .04,
		inc: .03,
		node: 3.1,
		arg: 1.4,
		phase: 5.2,
		period: periodFor(38),
		retrograde: false,
		spin: -1.7,
		tilt: 1.71,
		focus: 7.5,
		hit: 1.5,
		rim: "#c6ebe4",
		rimStrength: .45,
		diameter: "50,724 km",
		periodLabel: "84 年",
		distance: "19.2 AU",
		note: "自转轴倾角约 98°",
		blurb: "几乎是躺着公转的。青绿色来自大气里的甲烷。"
	},
	{
		id: "neptune",
		name: "海王星",
		en: "Neptune",
		kind: "planet",
		swatch: "#3f62b5",
		radius: .76,
		flatten: .98,
		a: 46,
		e: .01,
		inc: .03,
		node: 4.2,
		arg: .3,
		phase: 2.2,
		period: periodFor(46),
		retrograde: false,
		spin: 1.9,
		tilt: .49,
		focus: 7.2,
		hit: 1.45,
		rim: "#8eb0ee",
		rimStrength: .5,
		diameter: "49,244 km",
		periodLabel: "165 年",
		distance: "30.1 AU",
		note: "太阳系风速最快",
		blurb: "最外侧的巨行星。它的风比其他行星都快，环很暗，这里不画。"
	},
	{
		id: "maodie",
		name: "圆头耄耋",
		en: "Halley",
		kind: "comet",
		swatch: "#e0904a",
		radius: .9,
		flatten: 1,
		a: 27,
		e: .84,
		inc: .58,
		node: .85,
		arg: 1.15,
		phase: 2.15,
		period: periodFor(27),
		retrograde: true,
		spin: 0,
		tilt: 0,
		focus: 6.4,
		hit: 1.7,
		rim: "#ffb068",
		rimStrength: 0,
		diameter: "约 15 km（已放大）",
		periodLabel: "76 年",
		distance: "0.59–35 AU",
		note: "逆行，沿途翻滚",
		blurb: "哈雷彗星的猫咪核。真实彗星大约 76 年回来一次，逆行，轨道又扁又斜。这里把彗核换成圆头耄耋：橘毛、白脸、嘴边两枚对称黄点、耳朵贴在脑后。身子翻来覆去，彗尾却始终拖在身后。"
	}
];
var BODY_MAP = Object.fromEntries(BODIES.map((b) => [b.id, b]));
var ORBITERS = BODIES.filter((b) => b.kind !== "star");
var useSolar = create((set) => ({
	paused: false,
	speed: 1,
	showLabels: true,
	showOrbits: true,
	selected: null,
	simDays: 0,
	resetViewTick: 0,
	focusTick: 0,
	togglePaused: () => set((s) => ({ paused: !s.paused })),
	setSpeed: (speed) => set({ speed }),
	setShowLabels: (showLabels) => set({ showLabels }),
	setShowOrbits: (showOrbits) => set({ showOrbits }),
	select: (selected) => set((s) => ({
		selected,
		focusTick: s.focusTick + 1
	})),
	clearSelection: () => set({ selected: null }),
	setSimDays: (simDays) => set({ simDays }),
	requestReset: () => set((s) => ({
		selected: null,
		resetViewTick: s.resetViewTick + 1
	}))
}));
function formatEpoch(days) {
	const sign = days < 0 ? "-" : "";
	const abs = Math.abs(days);
	const years = abs / 365.25;
	if (years >= 1) return `${sign}${years.toFixed(2)} 年`;
	return `${sign}${Math.floor(abs)} 日`;
}
function Hud() {
	const paused = useSolar((s) => s.paused);
	const speed = useSolar((s) => s.speed);
	const showLabels = useSolar((s) => s.showLabels);
	const showOrbits = useSolar((s) => s.showOrbits);
	const selectedId = useSolar((s) => s.selected);
	const simDays = useSolar((s) => s.simDays);
	const togglePaused = useSolar((s) => s.togglePaused);
	const setSpeed = useSolar((s) => s.setSpeed);
	const setShowLabels = useSolar((s) => s.setShowLabels);
	const setShowOrbits = useSolar((s) => s.setShowOrbits);
	const select = useSolar((s) => s.select);
	const clearSelection = useSolar((s) => s.clearSelection);
	const requestReset = useSolar((s) => s.requestReset);
	const body = selectedId ? BODY_MAP[selectedId] : null;
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			if (target instanceof HTMLElement && target.closest("button, input, a, textarea")) return;
			if (e.code === "Space") {
				e.preventDefault();
				useSolar.getState().togglePaused();
			} else if (e.key === "Escape") useSolar.getState().requestReset();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Orbital watch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "圆轨" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint",
							children: "点选天体，镜头平滑聚焦"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "clock",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "星历" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatEpoch(simDays) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "roster",
				"aria-label": "天体",
				children: BODIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-current": selectedId === item.id ? "true" : void 0,
					onClick: () => select(item.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "swatch",
						style: { background: item.swatch }
					}), item.name]
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "dossier",
				"data-filled": body ? "true" : "false",
				"aria-live": "polite",
				children: body ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dossier-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: body.en
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: body.name })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-btn",
							"aria-label": "关闭",
							onClick: clearSelection,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								size: 18,
								strokeWidth: 1.75
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "blurb",
						children: body.blurb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "stats",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "直径" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: body.diameter })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: body.kind === "star" ? "自转" : "公转" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: body.periodLabel })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "距日" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: body.distance })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "备注" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: body.note })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "fine",
						children: body.kind === "comet" ? "真实倾角约 162°、偏心率 0.967。为了同屏看清，轨道略放平、略收圆，近日点不会扎进太阳。" : "画面轨道已压缩，公转快慢仍按开普勒关系。"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "empty-copy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "观测台" }), "八大行星沿轨道运行。拖拽旋转，滚轮或双指缩放。最扁的那条轨道上，圆头耄耋正翻来覆去。"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "transport",
				role: "toolbar",
				"aria-label": "模拟控制",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "primary",
						onClick: togglePaused,
						"aria-pressed": paused,
						children: paused ? "继续" : "暂停"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "speed",
						children: [
							"流速",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: .25,
								max: 8,
								step: .05,
								value: speed,
								"aria-valuetext": `${speed.toFixed(1)} 倍`,
								onChange: (e) => setSpeed(Number(e.target.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [speed.toFixed(1), "×"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toggle",
						"aria-pressed": showLabels,
						onClick: () => setShowLabels(!showLabels),
						children: "标签"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "toggle",
						"aria-pressed": showOrbits,
						onClick: () => setShowOrbits(!showOrbits),
						children: "轨道"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ghost",
						onClick: requestReset,
						children: "全景"
					})
				]
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const [View, setView] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		import("./System-VRh3EI7_.mjs").then((mod) => {
			if (alive) setView(() => mod.System);
		});
		return () => {
			alive = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "stage",
		children: [View ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(View, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "void" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {})]
	});
}
//#endregion
export { ORBITERS as a, BODY_MAP as i, useSolar as n, BODIES as r, routes_exports as t };
