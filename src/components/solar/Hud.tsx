import { useEffect } from "react";
import { X } from "lucide-react";
import { BODIES, BODY_MAP } from "@/components/solar/data";
import { useSolar } from "@/components/solar/store";

function formatEpoch(days: number) {
  const sign = days < 0 ? "-" : "";
  const abs = Math.abs(days);
  const years = abs / 365.25;
  if (years >= 1) return `${sign}${years.toFixed(2)} 年`;
  return `${sign}${Math.floor(abs)} 日`;
}

export function Hud() {
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest("button, input, a, textarea")) return;
      if (e.code === "Space") {
        e.preventDefault();
        useSolar.getState().togglePaused();
      } else if (e.key === "Escape") {
        useSolar.getState().requestReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hud">
      <header className="top">
        <div className="brand">
          <p className="eyebrow">Orbital watch</p>
          <h1>圆轨</h1>
          <p className="hint">点选天体，镜头平滑聚焦</p>
        </div>
        <div className="clock">
          <span>星历</span>
          <strong>{formatEpoch(simDays)}</strong>
        </div>
      </header>

      <nav className="roster" aria-label="天体">
        {BODIES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={selectedId === item.id ? "true" : undefined}
            onClick={() => select(item.id)}
          >
            <span className="swatch" style={{ background: item.swatch }} />
            {item.name}
          </button>
        ))}
      </nav>

      <section className="dossier" data-filled={body ? "true" : "false"} aria-live="polite">
        {body ? (
          <>
            <div className="dossier-head">
              <div>
                <p className="eyebrow">{body.en}</p>
                <h2>{body.name}</h2>
              </div>
              <button type="button" className="icon-btn" aria-label="关闭" onClick={clearSelection}>
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <p className="blurb">{body.blurb}</p>
            <dl className="stats">
              <div>
                <dt>直径</dt>
                <dd>{body.diameter}</dd>
              </div>
              <div>
                <dt>{body.kind === "star" ? "自转" : "公转"}</dt>
                <dd>{body.periodLabel}</dd>
              </div>
              <div>
                <dt>距日</dt>
                <dd>{body.distance}</dd>
              </div>
              <div>
                <dt>备注</dt>
                <dd>{body.note}</dd>
              </div>
            </dl>
            <p className="fine">
              {body.kind === "comet"
                ? "真实倾角约 162°、偏心率 0.967。为了同屏看清，轨道略放平、略收圆，近日点不会扎进太阳。"
                : "画面轨道已压缩，公转快慢仍按开普勒关系。"}
            </p>
          </>
        ) : (
          <div className="empty-copy">
            <strong>观测台</strong>
            八大行星沿轨道运行。拖拽旋转，滚轮或双指缩放。最扁的那条轨道上，圆头耄耋正翻来覆去。
          </div>
        )}
      </section>

      <div className="transport" role="toolbar" aria-label="模拟控制">
        <button type="button" className="primary" onClick={togglePaused} aria-pressed={paused}>
          {paused ? "继续" : "暂停"}
        </button>
        <label className="speed">
          流速
          <input
            type="range"
            min={0.25}
            max={8}
            step={0.05}
            value={speed}
            aria-valuetext={`${speed.toFixed(1)} 倍`}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <b>{speed.toFixed(1)}×</b>
        </label>
        <button type="button" className="toggle" aria-pressed={showLabels} onClick={() => setShowLabels(!showLabels)}>
          标签
        </button>
        <button type="button" className="toggle" aria-pressed={showOrbits} onClick={() => setShowOrbits(!showOrbits)}>
          轨道
        </button>
        <button type="button" className="ghost" onClick={requestReset}>
          全景
        </button>
      </div>
    </div>
  );
}
