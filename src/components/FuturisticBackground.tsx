import { useEffect, useRef } from "react";

type Props = {
  /** Opacity of the background canvas to calibrate readability (default 0.75) */
  intensity?: number;
  /** Whether to show geometric wireframe nodes */
  showGeometry?: boolean;
};

/**
 * 2026 AI Futuristic Living Digital Background
 * High-performance, GPU-accelerated canvas engine.
 * Renders:
 * - Visibly moving flowing energy waves & harmonic ribbons
 * - Dynamic shifting multi-point cybernetic light fields
 * - Neural constellation nodes with synaptic pulses
 * - Drifting geometric wireframe shards
 * - Layered depth particle streams
 */
export function FuturisticBackground({ intensity = 0.85, showGeometry = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle nodes for depth layers
    const particleCount = 65;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      phase: number;
    }[] = [];

    const colors = ["#00e5ff", "#38bdf8", "#818cf8", "#f59e0b", "#fbbf24"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.2 - Math.random() * 0.5, // gentle upward drift
        size: 1.2 + Math.random() * 2.4,
        alpha: 0.25 + Math.random() * 0.6,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Geometric floating polyhedra shards
    const shapes = [
      { x: 0.15, y: 0.25, size: 45, rot: 0, rotSpeed: 0.008, color: "rgba(0, 229, 255, 0.25)" },
      { x: 0.85, y: 0.22, size: 55, rot: 0.5, rotSpeed: -0.006, color: "rgba(245, 158, 11, 0.22)" },
      { x: 0.12, y: 0.78, size: 38, rot: 1.2, rotSpeed: 0.007, color: "rgba(56, 189, 248, 0.2)" },
      { x: 0.88, y: 0.82, size: 48, rot: 0.8, rotSpeed: -0.005, color: "rgba(129, 140, 248, 0.22)" },
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      time += dt;

      // 1. Deep Cosmic Cybernetic Void
      ctx.fillStyle = "#070a11";
      ctx.fillRect(0, 0, width, height);

      // 2. Dynamic Moving Light Fields (Vibrant shifting color blooms)
      const light1X = width * (0.35 + Math.sin(time * 0.45) * 0.2);
      const light1Y = height * (0.3 + Math.cos(time * 0.35) * 0.15);
      const grad1 = ctx.createRadialGradient(light1X, light1Y, 0, light1X, light1Y, width * 0.55);
      grad1.addColorStop(0, "rgba(14, 116, 200, 0.22)");
      grad1.addColorStop(0.5, "rgba(6, 44, 92, 0.12)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const light2X = width * (0.75 + Math.cos(time * 0.4) * 0.18);
      const light2Y = height * (0.7 + Math.sin(time * 0.3) * 0.18);
      const grad2 = ctx.createRadialGradient(light2X, light2Y, 0, light2X, light2Y, width * 0.5);
      grad2.addColorStop(0, "rgba(212, 175, 55, 0.18)"); // Warm corporate gold accent
      grad2.addColorStop(0.6, "rgba(70, 40, 10, 0.06)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Light Field 3: Luminous cybernetic crown bloom
      const light3X = width * (0.5 + Math.sin(time * 0.25) * 0.25);
      const light3Y = height * (0.15 + Math.cos(time * 0.2) * 0.08);
      const grad3 = ctx.createRadialGradient(light3X, light3Y, 0, light3X, light3Y, width * 0.45);
      grad3.addColorStop(0, "rgba(0, 229, 255, 0.14)");
      grad3.addColorStop(0.5, "rgba(2, 56, 110, 0.06)");
      grad3.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 3. Continuous Flowing Energy Wave Ribbons (3 harmonic sine ribbons)
      const ribbonCount = 4;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const baseH = height * (0.28 + r * 0.22);
        const waveSpeed = 1.1 + r * 0.3;
        const waveFreq = 0.003 - r * 0.0004;
        const waveAmp = 42 + r * 14;

        ctx.strokeStyle =
          r % 2 === 0
            ? `rgba(0, 229, 255, ${0.18 + r * 0.04})`
            : `rgba(245, 158, 11, ${0.14 + r * 0.03})`;
        ctx.lineWidth = 1.5 + (r % 2);

        for (let x = 0; x <= width; x += 18) {
          const y =
            baseH +
            Math.sin(x * waveFreq + time * waveSpeed) * waveAmp +
            Math.cos(x * 0.0015 - time * 0.8) * (waveAmp * 0.45);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 4. Drifting Geometric Wireframe Shards (Octahedra / Diamonds)
      if (showGeometry) {
        shapes.forEach((s) => {
          s.rot += s.rotSpeed;
          const sx = s.x * width + Math.sin(time * 0.6 + s.rot) * 20;
          const sy = s.y * height + Math.cos(time * 0.5 + s.rot) * 15;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(s.rot);

          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1.2;

          // Outer diamond
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.7, 0);
          ctx.lineTo(0, s.size);
          ctx.lineTo(-s.size * 0.7, 0);
          ctx.closePath();
          ctx.stroke();

          // Inner crosshairs
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(0, s.size);
          ctx.moveTo(-s.size * 0.7, 0);
          ctx.lineTo(s.size * 0.7, 0);
          ctx.stroke();

          ctx.restore();
        });
      }

      // 5. Streaming Synaptic Particles & Connective Filaments
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const pulseAlpha = p.alpha * (0.7 + Math.sin(time * 2.5 + p.phase) * 0.3);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulseAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle neural threads
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = (1 - dist / 110) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1.0;

      // 6. Contrast Vignette (Guarantees 100% card & text readability)
      const vigGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.25,
        width * 0.5,
        height * 0.5,
        width * 0.75,
      );
      vigGrad.addColorStop(0, "rgba(7, 10, 17, 0.25)");
      vigGrad.addColorStop(0.7, "rgba(7, 10, 17, 0.72)");
      vigGrad.addColorStop(1, "rgba(5, 7, 12, 0.92)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [showGeometry]);

  return (
    <canvas
      ref={canvasRef}
      className="futuristic-bg-canvas"
      style={{ opacity: intensity }}
      aria-hidden="true"
    />
  );
}
