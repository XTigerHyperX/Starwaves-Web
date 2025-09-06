import React from "react";

export const AuroraBackground = React.forwardRef(function AuroraBackground(_: unknown, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const scrollRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const burstRef = React.useRef(0);
  const lastFrameTime = React.useRef(0);
  const performanceLevel = React.useRef(1);
  const lastPerfSample = React.useRef(0);
  const perfSamples: number[] = [];
  let adjustCooldown = 0;
  const lastScrollY = React.useRef(0);
  const lastScrollT = React.useRef(0);
  const fastScrollUntil = React.useRef(0);
  const fastScrollRef = React.useRef(false);

  React.useImperativeHandle(ref as any, () => ({
    burst: () => {
      burstRef.current = 2.5;
      const start = performance.now();
      const dur = 1600;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        burstRef.current = 2.5 * (1 - p);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
  }));

  React.useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, dpr = 1;
    const isCoarse = window.matchMedia && !window.matchMedia("(pointer: fine)").matches;
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;
    if (isLowEnd) performanceLevel.current = 0.5; else if (isMobile) performanceLevel.current = 0.75; else performanceLevel.current = 1;

    let stars: { x: number; y: number; r: number; z: number; p: number; baseY: number }[] = [];
    const starSprite = document.createElement("canvas");
    starSprite.width = 16; starSprite.height = 16;
    const sctx = starSprite.getContext("2d")!;
    const sg = sctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    sg.addColorStop(0, "rgba(255,255,255,1)");
    sg.addColorStop(0.6, "rgba(255,255,255,0.85)");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = sg; sctx.beginPath(); sctx.arc(8,8,8,0,Math.PI*2); sctx.fill();

    const glowSprite = document.createElement("canvas");
    glowSprite.width = 32; glowSprite.height = 32;
    const gctx = glowSprite.getContext("2d")!;
    const gg = gctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gg.addColorStop(0, "rgba(160,180,255,0.9)");
    gg.addColorStop(0.55, "rgba(160,140,255,0.55)");
    gg.addColorStop(1, "rgba(160,140,255,0)");
    gctx.fillStyle = gg; gctx.beginPath(); gctx.arc(16,16,16,0,Math.PI*2); gctx.fill();

    const buildStars = () => {
      const baseDensity = Math.max(150, Math.floor((w * h) / 15000));
      const starCount = Math.floor(baseDensity * performanceLevel.current * (isCoarse ? 0.6 : 1));
      stars = Array.from({ length: starCount }, () => {
        const y = Math.random() * h;
        return { x: Math.random() * w, y, baseY: y, r: 0.4 + Math.random() * 1.0, z: 0.5 + Math.random() * 0.7, p: Math.random() * Math.PI * 2 };
      });
    };

    const gradCache = { main: null as CanvasGradient | null, vignette: null as CanvasGradient | null, radial: null as CanvasGradient | null };
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      const cap = performanceLevel.current >= 1 ? 2 : performanceLevel.current >= 0.75 ? 1.5 : 1.25;
      dpr = Math.min(cap, window.devicePixelRatio || 1);
      c.style.width = w + "px"; c.style.height = h + "px"; c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      gradCache.main = gradCache.vignette = gradCache.radial = null; buildStars();
    };
    let resizeTimeout: number | null = null;
    const onResize = () => { if (resizeTimeout) window.clearTimeout(resizeTimeout); resizeTimeout = window.setTimeout(resize, 150); };
    window.addEventListener("resize", onResize, { passive: true });

    const gradMainCache = { key: -1, grad: null as CanvasGradient | null };
    const gradientMain = (t?: number) => {
      const steps = 16; const idx = t ? Math.round(((Math.sin(t * 0.00022) + 1) * 0.5) * steps) : 0;
      if (gradMainCache.grad && gradMainCache.key === idx) return gradMainCache.grad;
      const sway = (idx / steps - 0.5) * 2;
      const a1 = Math.min(1, Math.max(0, 0.30 + 0.04 * sway));
      const a2 = Math.min(1, Math.max(0, 0.34 - 0.04 * sway));
      const a3 = Math.min(1, Math.max(0, 0.09 + 0.03 * (-sway)));
      const g = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.7);
      g.addColorStop(0.0, "rgba(108,164,255,0.00)");
      g.addColorStop(0.42, `rgba(108,164,255,${a1})`);
      g.addColorStop(0.7, `rgba(186,137,255,${a2})`);
      g.addColorStop(0.95, `rgba(255,168,94,${a3})`);
      g.addColorStop(1.0, "rgba(255,168,94,0.00)");
      gradMainCache.key = idx; gradMainCache.grad = g; return g;
    };

    const gradientRadial = () => {
      if (gradCache.radial) return gradCache.radial;
      const lgx = -w * 0.4, lgy = h * 0.46;
      const lg = ctx.createRadialGradient(lgx, lgy, 0, lgx, lgy, Math.max(w, h) * 0.85);
      lg.addColorStop(0, `rgba(108,164,255,0.22)`);
      lg.addColorStop(1, "rgba(108,164,255,0.00)");
      gradCache.radial = lg; return lg;
    };

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetFPS1 = performanceLevel.current >= 0.75 ? 30 : 24;
  const frameInterval1 = 1000 / targetFPS1;
    resize();

    function drawStars(t: number) {
      ctx.save();
      const scrollOffset = scrollRef.current * 0.02;
      ctx.globalCompositeOperation = "source-over"; ctx.imageSmoothingEnabled = true;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const f = 0.55 + 0.45 * Math.sin(s.p + t * 0.003);
        const y = s.baseY + scrollOffset * (1 - s.z);
        if (y > -10 && y < h + 10 && s.x > -10 && s.x < w + 10) {
          const alpha = 0.55 * s.z * f;
          if (alpha > 0.1) { ctx.globalAlpha = alpha; const size = Math.max(1, (s.r * s.z) * 4); ctx.drawImage(starSprite, s.x - size / 2, y - size / 2, size, size); }
        }
        const stepDiv = performanceLevel.current >= 1 ? 3 : performanceLevel.current >= 0.75 ? 4 : 5;
        if (i % stepDiv === 0) { s.x += 0.012 * s.z * performanceLevel.current; if (s.x > w + 2) s.x = -2; }
      }
      ctx.restore();
    }

    const noise = (x: number, t: number) => Math.sin(x * 0.002 + t * 0.00065) * 22 + Math.sin(x * 0.004 + t * 0.00042) * 12;
    const ctrls = (t: number, shift = 0, amp = 1) => {
      const y0 = h * 0.3 + noise(0, t) * amp + shift;
      const y1 = h * 0.45 + noise(w * 0.25, t) * amp + shift;
      const y2 = h * 0.6 + noise(w * 0.45, t) * amp + shift;
      const y3 = h * 0.75 + noise(w, t) * amp + shift;
      return { y0, y1, y2, y3 };
    };

    function drawAurora(t: number) {
      const fast = fastScrollRef.current;
      const parY = Math.min(90, scrollRef.current * 0.09);
      const boost = 1 + burstRef.current * 2.5;
      ctx.save(); ctx.translate(w * 0.5, h * 0.5 + parY);
      const s = 1 + burstRef.current * 0.12; ctx.scale(s, s); ctx.rotate(-0.34); ctx.translate(-w * 0.75, -h * 0.5);
      ctx.fillStyle = gradientRadial();
      const breath = 0.9 + 0.06 * Math.sin(t * 0.0003);
      ctx.globalAlpha = 0.85 * breath * (1 + burstRef.current * 0.6);
      ctx.fillRect(-w, -h, w * 2, h * 2); ctx.globalAlpha = 1;
      const tq = Math.floor(t / 33) * 33; const m = ctrls(tq, 0, 1);
      const X0 = -w * 0.28, X1 = w * 0.25, X2 = w * 0.6, X3 = w * 1.3;
      let WMAIN = Math.max(120, Math.min(185, w * 0.1)) * boost;
      let WECHO = Math.max(90, Math.min(130, w * 0.072)) * boost;
      let blurMain = Math.floor((28 * boost) * performanceLevel.current);
      let blurEcho = Math.floor((38 * boost) * performanceLevel.current);
      if (fast) { blurMain = Math.max(12, Math.floor(blurMain * 0.75)); blurEcho = Math.max(14, Math.floor(blurEcho * 0.7)); }
      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${blurMain}px) saturate(${120 + burstRef.current * 50}%)`;
      ctx.strokeStyle = gradientMain(tq);
      ctx.beginPath(); ctx.moveTo(X0, m.y0); ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3); ctx.lineWidth = WMAIN; ctx.stroke();
      {
        const e = ctrls(tq, 64, 0.9);
        ctx.filter = `blur(${Math.floor((38 * boost) * performanceLevel.current)}px) saturate(${120 + burstRef.current * 45}%)`;
        ctx.globalAlpha = 0.25; ctx.strokeStyle = gradientMain(tq);
        ctx.beginPath(); ctx.moveTo(X0, e.y0); ctx.bezierCurveTo(X1, e.y1, X2, e.y2, X3, e.y3); ctx.lineWidth = WECHO; ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (!fast) {
        const count = performanceLevel.current >= 1 ? 6 : performanceLevel.current >= 0.75 ? 4 : 2;
        const cubic = (a: number, b: number, c: number, d: number, tt: number) => { const it = 1 - tt; return it*it*it*a + 3*it*it*tt*b + 3*it*tt*tt*c + tt*tt*tt*d; };
        ctx.save(); ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < count; i++) {
          const p = (i / count + (t * 0.00008)) % 1;
          const gx = cubic(X0, X1, X2, X3, p); const gy = cubic(m.y0, m.y1, m.y2, m.y3, p);
          const size = 22 + 16 * Math.sin(t * 0.001 + i);
          ctx.globalAlpha = 0.08 + 0.12 * Math.max(0, Math.min(1, burstRef.current));
          ctx.filter = "blur(10px)"; ctx.drawImage(glowSprite, gx - size / 2, gy - size / 2, size, size);
        }
        ctx.restore();
      }
      ctx.restore();
    }

  const targetFPS = performanceLevel.current >= 0.75 ? 30 : 24;
  const frameInterval = 1000 / targetFPS;
    function frame(t: number) {
      if (t - lastFrameTime.current < frameInterval) { rafRef.current = requestAnimationFrame(frame); return; }
      const targetScroll = window.scrollY || 0; scrollRef.current += (targetScroll - scrollRef.current) * 0.15;
      const dy = Math.abs(targetScroll - (lastScrollY.current || targetScroll)); const dtScroll = t - (lastScrollT.current || t);
      if (dtScroll > 0) { const speed = dy / dtScroll; if (speed > 2) fastScrollUntil.current = t + 180; }
      lastScrollY.current = targetScroll; lastScrollT.current = t; fastScrollRef.current = t < fastScrollUntil.current;
      if (lastPerfSample.current) {
        const dt = t - lastPerfSample.current; perfSamples.push(dt); if (perfSamples.length > 40) perfSamples.shift(); if (adjustCooldown > 0) adjustCooldown--;
        if (perfSamples.length >= 30 && adjustCooldown === 0) {
          const avg = perfSamples.reduce((a, b) => a + b, 0) / perfSamples.length;
          if (avg > 24 && performanceLevel.current > 0.5) { performanceLevel.current = performanceLevel.current >= 1 ? 0.75 : 0.5; resize(); adjustCooldown = 120; }
          else if (avg < 17 && performanceLevel.current < 1) { performanceLevel.current = performanceLevel.current < 0.75 ? 0.75 : 1; resize(); adjustCooldown = 160; }
        }
      }
      lastPerfSample.current = t; lastFrameTime.current = t;
      ctx.filter = "none"; ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, w, h); drawStars(t); drawAurora(t);
      rafRef.current = requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting;
      if (!isVisible && rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      else if (isVisible && !rafRef.current && !prefersReduced) { rafRef.current = requestAnimationFrame(frame); }
    }, { threshold: 0.1 });
    if (c) observer.observe(c);
    if (!prefersReduced) { rafRef.current = requestAnimationFrame(frame); }
    return () => { window.removeEventListener("resize", onResize); observer.disconnect(); if (rafRef.current != null) cancelAnimationFrame(rafRef.current); if (resizeTimeout) clearTimeout(resizeTimeout!); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none will-change-transform" />;
});

export type AuroraBackgroundHandle = { burst: () => void };
