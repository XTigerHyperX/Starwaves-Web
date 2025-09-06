import React from "react";

export function UnlockFX({ trigger }: { trigger: number }) {
  const [active, setActive] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let w = (c.width = window.innerWidth * dpr);
    let h = (c.height = window.innerHeight * dpr);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const particleCount = window.innerWidth < 768 ? 30 : 45;
    const particles = Array.from({ length: particleCount }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 18 + Math.random() * 22;
      return { x: w / (2 * dpr), y: h / (2 * dpr), vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 0, max: 70 + Math.random() * 30 };
    });
    const sparkleCount = window.innerWidth < 768 ? 8 : 14;
    const sparkles = Array.from({ length: sparkleCount }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 30 + Math.random() * 40;
      return { x: w / (2 * dpr), y: h / (2 * dpr), vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 0, max: 40 + Math.random() * 20 };
    });
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w / dpr, h / dpr);
      ctx.globalCompositeOperation = "lighter";
      const layerCount = window.innerWidth < 768 ? 2 : 3;
      for (let i = 0; i < layerCount; i++) {
        ctx.save();
        ctx.globalAlpha = 0.18 - i * 0.05;
        const blurAmount = window.innerWidth < 768 ? 40 - i * 15 : 60 - i * 20;
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.beginPath();
        ctx.arc(w/(2*dpr), h/(2*dpr), 220 + i*80, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${108 + i*40},${164 + i*20},255,1)`;
        ctx.fill();
        ctx.restore();
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life++;
        const a = Math.max(0, 1 - p.life / p.max);
        if (a > 0.1) {
          ctx.save();
          ctx.globalAlpha = 0.7 * a;
          ctx.filter = `blur(${window.innerWidth < 768 ? 4 : 6}px)`;
          ctx.fillStyle = `rgba(186,137,255,1)`;
          ctx.beginPath();
          ctx.arc(p.x / dpr, p.y / dpr, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      for (const s of sparkles) {
        s.x += s.vx; s.y += s.vy; s.vx *= 0.92; s.vy *= 0.92; s.life++;
        const a = Math.max(0, 1 - s.life / s.max);
        if (a > 0.08) {
          ctx.save();
          ctx.globalAlpha = 0.9 * a;
          ctx.fillStyle = `rgba(255,168,94,1)`;
          ctx.beginPath();
          ctx.arc(s.x / dpr, s.y / dpr, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      if (particles.some(p => p.life < p.max) || sparkles.some(s => s.life < s.max)) raf = requestAnimationFrame(tick);
      else setActive(false);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />;
}
