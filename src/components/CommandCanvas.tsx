import { useEffect, useRef } from "react";
import type { OsMode } from "../lib/hooks";

interface CommandCanvasProps {
  mode: OsMode;
}

const PALETTES: Record<OsMode, string[]> = {
  neural: ["#34f5d0", "#7c5cff", "#ff5ea8", "#a6ff5e"],
  orbital: ["#4db8ff", "#ffb020", "#5effc8", "#ff5e6c"],
  os: ["#b98cff", "#35e0ff", "#ff7edb", "#8affc0"],
};

/**
 * Unified generative background:
 *  - NEURAL: drifting neurons with distance-based synapse links + firing pulses
 *  - ORBITAL: concentric radar rings, rotating sweep, orbiting satellites, star field
 *  - OS: parallax depth field of holographic particles reacting to the cursor
 * One canvas, one rAF loop, pauses when tab hidden. Pointer-reactive.
 */
export function CommandCanvas({ mode }: CommandCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<OsMode>(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = Math.max(window.innerHeight, 700);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: width / 2, y: height * 0.4, tx: width / 2, ty: height * 0.4 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Shared node pool reused across modes
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      z: number;
      r: number;
      pulse: number;
      color: string;
    }

    const COUNT = window.innerWidth < 768 ? 42 : 78;
    const nodes: Node[] = [];
    const palette = PALETTES[modeRef.current];
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        z: Math.random() * 1 + 0.25,
        r: Math.random() * 1.8 + 1,
        pulse: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    let raf = 0;
    let t = 0;
    let running = true;

    const onVis = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const hexA = (hex: string, a: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };

    const loop = () => {
      if (!running) return;
      t += 1;
      const m = modeRef.current;
      const pal = PALETTES[m];

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      if (m === "orbital") {
        // ---- Radar command view ----
        const cx = width * 0.5;
        const cy = height * 0.4;
        const maxR = Math.min(width, height) * 0.42;

        // rings
        for (let i = 1; i <= 4; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, (maxR / 4) * i, 0, Math.PI * 2);
          ctx.strokeStyle = hexA(pal[0], 0.1);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // crosshair
        ctx.strokeStyle = hexA(pal[0], 0.08);
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        // sweep
        if (!reduced) {
          const sweep = (t * 0.012) % (Math.PI * 2);
          const grad = ctx.createConicGradient
            ? ctx.createConicGradient(sweep, cx, cy)
            : null;
          if (grad) {
            grad.addColorStop(0, hexA(pal[0], 0.32));
            grad.addColorStop(0.08, hexA(pal[0], 0));
            grad.addColorStop(1, hexA(pal[0], 0));
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, maxR, sweep - 0.5, sweep);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
          }
        }

        // orbiting satellites / blips as nodes on rings
        nodes.forEach((n, i) => {
          const ring = (i % 4) + 1;
          const rad = (maxR / 4) * ring;
          const speed = reduced ? 0 : 0.004 / ring;
          const ang = n.pulse + t * speed * (i % 2 === 0 ? 1 : -1);
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad;
          ctx.beginPath();
          ctx.arc(px, py, n.r, 0, Math.PI * 2);
          ctx.fillStyle = hexA(pal[i % pal.length], 0.85);
          ctx.shadowColor = pal[i % pal.length];
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else {
        // ---- Neural / OS particle-link view ----
        const linkDist = m === "neural" ? 140 : 120;
        for (const n of nodes) {
          if (!reduced) {
            n.x += n.vx * n.z;
            n.y += n.vy * n.z;
          }
          // cursor gravity (organic in neural, parallax in os)
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            const f = (220 - dist) / 220;
            if (m === "neural") {
              n.x += (dx / dist) * f * 0.4;
              n.y += (dy / dist) * f * 0.4;
            } else {
              n.x -= (dx / dist) * f * 0.5 * n.z;
              n.y -= (dy / dist) * f * 0.5 * n.z;
            }
          }
          if (n.x < 0) n.x = width;
          if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          if (n.y > height) n.y = 0;
          n.pulse += 0.03;
        }

        // synapse / window links
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < linkDist) {
              const alpha = (1 - d / linkDist) * 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              if (m === "neural") {
                // curved dendrite
                const mx = (a.x + b.x) / 2 + Math.sin(t * 0.02 + i) * 6;
                const my = (a.y + b.y) / 2 + Math.cos(t * 0.02 + j) * 6;
                ctx.quadraticCurveTo(mx, my, b.x, b.y);
              } else {
                ctx.lineTo(b.x, b.y);
              }
              ctx.strokeStyle = hexA(pal[0], alpha);
              ctx.lineWidth = m === "neural" ? 1 : 0.7;
              ctx.stroke();
            }
          }
        }

        // nodes + firing pulse
        for (const n of nodes) {
          const glow = m === "neural" ? (Math.sin(n.pulse) + 1) / 2 : 0.6;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + glow * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = hexA(n.color, 0.9);
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 6 + glow * 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full opacity-70" />
      {/* mode-tinted vignette + grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, color-mix(in srgb, var(--c-primary) 8%, transparent), transparent 60%), radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c-secondary) 10%, transparent), transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 85%)",
        }}
      />
    </div>
  );
}
