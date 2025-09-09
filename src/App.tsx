import { FAQ } from "./components/faq/FAQ";
// Decorative background orbs for section visuals
import React from "react";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Play,
  Send,
  Building2,
  MonitorSpeaker,
  Printer,
  Bus,
  Video,
  Palette,
  Sparkles,
  Star,
  BadgeCheck,
} from "lucide-react";
import "./index.css";
import "./styles.css";
import { NEXT_EVENT, UPCOMING_EVENTS, PARTNER_LOGOS, FAQS, WORKS } from "./content";
import { ServiceCard } from "./components/ServiceCard";
import { WorkCard } from "./components/WorkCard";
import { Reveal } from "./components/common/Reveal";
import { ProcessSection } from "./components/process/ProcessSection";
import { Testimonials } from "./components/testimonials/Testimonials";
import { Container, Section } from "./components/layout/Layout";
import { ContactForm } from "./components/forms/ContactForm";
import { Nav } from "./components/layout/Nav";
import { BackToTop } from "./components/common/BackToTop";
import { CTADock } from "./components/common/CTADock";
import { ScrollProgressBar } from "./components/common/ScrollProgressBar";
import { Orbs } from "./components/common/Orbs";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useActiveSection } from "./hooks/useActiveSection";

function UnlockFX({ trigger }: { trigger: number }) {
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
      return {
        x: w / (2 * dpr),
        y: h / (2 * dpr),
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0,
        max: 70 + Math.random() * 30,
        color: `rgba(${186 + Math.random()*40},${137 + Math.random()*40},255,1)`
      };
    });

    const sparkleCount = window.innerWidth < 768 ? 8 : 14;
    const sparkles = Array.from({ length: sparkleCount }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 30 + Math.random() * 40;
      return {
        x: w / (2 * dpr),
        y: h / (2 * dpr),
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0,
        max: 40 + Math.random() * 20,
      };
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
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life++;
        const a = Math.max(0, 1 - p.life / p.max);
        if (a > 0.1) {
          ctx.save();
          ctx.globalAlpha = 0.7 * a;
          ctx.filter = `blur(${window.innerWidth < 768 ? 4 : 6}px)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8 + (1 - a) * 8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      }
      
      for (const s of sparkles) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.93;
        s.vy *= 0.93;
        s.life++;
        const a = Math.max(0, 1 - s.life / s.max);
        if (a > 0.1) {
          ctx.save();
          ctx.globalAlpha = 0.8 * a;
          ctx.filter = "blur(1px)";
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2 + (1 - a) * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,1)`;
          ctx.shadowColor = '#BA89FF';
          ctx.shadowBlur = 16;
          ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timeout = setTimeout(() => {
      cancelAnimationFrame(raf);
      setActive(false);
    }, 1700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [trigger]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[35] pointer-events-none">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 160,
          height: 160,
          background: "conic-gradient(from 0deg, #6CA4FF, #BA89FF, #FFA85E, #6CA4FF)",
          boxShadow: "0 0 80px 40px #BA89FF88, 0 0 180px 80px #6CA4FF44, 0 0 320px 120px #FFA85E22",
          border: "6px solid rgba(255,255,255,0.18)",
          animation: "ringExpand 1400ms cubic-bezier(.2,.65,.25,1) forwards",
          filter: "blur(0.5px) brightness(1.2)",
        }}
      >
        <style>{`
          @keyframes sparkleFade {
            0% { opacity: 1; transform: scale(1); }
            60% { opacity: 1; transform: scale(1.12); }
            100% { opacity: 0; transform: scale(0.7); }
          }
        `}</style>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <style>{`
        @keyframes flashFade { from { opacity: 1; } to { opacity: 0; } }
        @keyframes ringExpand { from { transform: translate(-50%,-50%) scale(0.2); opacity: 1; } to { transform: translate(-50%,-50%) scale(18); opacity: 0; } }
      `}</style>
    </div>
  );
}


const AuroraBackground = React.forwardRef(function AuroraBackground(_, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const scrollRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const burstRef = React.useRef(0);
  const lastFrameTime = React.useRef(0);
  const performanceLevel = React.useRef(1); // 0.5, 1, or 2
  const lastPerfSample = React.useRef(0);
  const perfSamples: number[] = [];
  let adjustCooldown = 0; // frames to wait before next perf adjustment
  const lastScrollY = React.useRef(0);
  const lastScrollT = React.useRef(0);
  const fastScrollUntil = React.useRef(0);
  const fastScrollRef = React.useRef(false);

  React.useImperativeHandle(ref, () => ({
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
    
    if (isLowEnd) performanceLevel.current = 0.5;
    else if (isMobile) performanceLevel.current = 0.75;
    else performanceLevel.current = 1;

  let stars: { x: number; y: number; r: number; z: number; p: number; baseY: number }[] = [];

  const starSprite = document.createElement("canvas");
  starSprite.width = 16;
  starSprite.height = 16;
  const sctx = starSprite.getContext("2d")!;
  const sg = sctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  sg.addColorStop(0, "rgba(255,255,255,1)");
  sg.addColorStop(0.6, "rgba(255,255,255,0.85)");
  sg.addColorStop(1, "rgba(255,255,255,0)");
  sctx.fillStyle = sg;
  sctx.beginPath();
  sctx.arc(8, 8, 8, 0, Math.PI * 2);
  sctx.fill();

  const glowSprite = document.createElement("canvas");
  glowSprite.width = 32;
  glowSprite.height = 32;
  const gctx = glowSprite.getContext("2d")!;
  const gg = gctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gg.addColorStop(0, "rgba(160,180,255,0.9)");
  gg.addColorStop(0.55, "rgba(160,140,255,0.55)");
  gg.addColorStop(1, "rgba(160,140,255,0)");
  gctx.fillStyle = gg;
  gctx.beginPath();
  gctx.arc(16, 16, 16, 0, Math.PI * 2);
  gctx.fill();

    const buildStars = () => {
      const baseDensity = Math.max(150, Math.floor((w * h) / 15000));
      const starCount = Math.floor(baseDensity * performanceLevel.current * (isCoarse ? 0.6 : 1));
      
      stars = Array.from({ length: starCount }, () => {
        const y = Math.random() * h;
        return {
          x: Math.random() * w,
          y,
          baseY: y,
          r: 0.4 + Math.random() * 1.0,
          z: 0.5 + Math.random() * 0.7,
          p: Math.random() * Math.PI * 2,
        };
      });
      
    };


    const gradCache = {
      main: null as CanvasGradient | null,
      vignette: null as CanvasGradient | null,
      shimmer: null as CanvasGradient | null,
      radial: null as CanvasGradient | null,
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      
  const cap = performanceLevel.current >= 1 ? 2 : performanceLevel.current >= 0.75 ? 1.5 : 1.25;
  dpr = Math.min(cap, window.devicePixelRatio || 1);
      
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      Object.keys(gradCache).forEach(key => {
        gradCache[key as keyof typeof gradCache] = null;
      });
      
      buildStars();
    };

    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });



    const gradMainCache = { key: -1, grad: null as CanvasGradient | null };
    const gradientMain = (t?: number) => {
      const steps = 16;
      const idx = t ? Math.round(((Math.sin(t * 0.00022) + 1) * 0.5) * steps) : 0;
      if (gradMainCache.grad && gradMainCache.key === idx) return gradMainCache.grad;
      const sway = (idx / steps - 0.5) * 2; // -1..1
      const a1 = Math.min(1, Math.max(0, 0.30 + 0.04 * sway));
      const a2 = Math.min(1, Math.max(0, 0.34 - 0.04 * sway));
      const a3 = Math.min(1, Math.max(0, 0.09 + 0.03 * (-sway)));
      const g = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.7);
      g.addColorStop(0.0, "rgba(108,164,255,0.00)");
      g.addColorStop(0.42, `rgba(108,164,255,${a1})`);
      g.addColorStop(0.7, `rgba(186,137,255,${a2})`);
      g.addColorStop(0.95, `rgba(255,168,94,${a3})`);
      g.addColorStop(1.0, "rgba(255,168,94,0.00)");
      gradMainCache.key = idx;
      gradMainCache.grad = g;
      return g;
    };

    const gradientVignette = () => {
      if (gradCache.vignette) return gradCache.vignette;
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.9);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.9)");
      gradCache.vignette = vg;
      return vg;
    };

    const gradientRadial = () => {
      if (gradCache.radial) return gradCache.radial;
      const lgx = -w * 0.4, lgy = h * 0.46;
    const lg = ctx.createRadialGradient(lgx, lgy, 0, lgx, lgy, Math.max(w, h) * 0.85);
    lg.addColorStop(0, `rgba(108,164,255,0.22)`);
      lg.addColorStop(1, "rgba(108,164,255,0.00)");
      gradCache.radial = lg;
      return lg;
    };

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
  // Lowered render FPS (smoother scroll, less CPU)
  const targetFPS = performanceLevel.current >= 0.75 ? 30 : 24;
  const frameInterval = 1000 / targetFPS;

    resize();

  // Removed per-frame skipping; rely on lower FPS and fast-scroll simplifications

    // Optimized star drawing with batching
    function drawStars(t: number) {
      ctx.save();
      const scrollOffset = scrollRef.current * 0.02;
      
      // Batch star operations
      ctx.globalCompositeOperation = "source-over";
      ctx.imageSmoothingEnabled = true;
      
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const f = 0.55 + 0.45 * Math.sin(s.p + t * 0.003);
        const y = s.baseY + scrollOffset * (1 - s.z);
        
        // Only draw stars that are visible
        if (y > -10 && y < h + 10 && s.x > -10 && s.x < w + 10) {
          // Slightly dimmer so black feels more dominant
          const alpha = 0.55 * s.z * f;
          if (alpha > 0.1) { // Skip very faint stars
            ctx.globalAlpha = alpha;
            const size = Math.max(1, (s.r * s.z) * 4);
            ctx.drawImage(starSprite, s.x - size / 2, y - size / 2, size, size);
          }
        }
        
  // Update position less frequently (adaptive)
  const stepDiv = performanceLevel.current >= 1 ? 3 : performanceLevel.current >= 0.75 ? 4 : 5;
  if (i % stepDiv === 0) {
          s.x += 0.012 * s.z * performanceLevel.current;
          if (s.x > w + 2) s.x = -2;
        }
      }
      ctx.restore();
    }

    // Simplified noise function with fewer calculations
    const noise = (x: number, t: number) =>
      Math.sin(x * 0.002 + t * 0.00065) * 22 +
      Math.sin(x * 0.004 + t * 0.00042) * 12;

    const ctrls = (t: number, shift = 0, amp = 1) => {
      const y0 = h * 0.3 + noise(0, t) * amp + shift;
      const y1 = h * 0.45 + noise(w * 0.25, t) * amp + shift;
      const y2 = h * 0.6 + noise(w * 0.45, t) * amp + shift;
      const y3 = h * 0.75 + noise(w, t) * amp + shift;
      return { y0, y1, y2, y3 };
    };


  const SHOW_STRIATIONS = false;
  function striations() { /* disabled */ }

  function drawAurora(t: number) {
      const fast = fastScrollRef.current;
      const parY = Math.min(90, scrollRef.current * 0.09);
      const boost = 1 + burstRef.current * 2.5;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5 + parY);
      const s = 1 + burstRef.current * 0.12;
      ctx.scale(s, s);
      ctx.rotate(-0.34);
      ctx.translate(-w * 0.75, -h * 0.5);

  ctx.fillStyle = gradientRadial();
  const breath = 0.9 + 0.06 * Math.sin(t * 0.0003);
  ctx.globalAlpha = 0.85 * breath * (1 + burstRef.current * 0.6);
      ctx.fillRect(-w, -h, w * 2, h * 2);
      ctx.globalAlpha = 1;

      const tq = Math.floor(t / 33) * 33;
      const m = ctrls(tq, 0, 1);
      const X0 = -w * 0.28, X1 = w * 0.25, X2 = w * 0.6, X3 = w * 1.3;
      
      let WMAIN = Math.max(120, Math.min(185, w * 0.1)) * boost;
      let WECHO = Math.max(90, Math.min(130, w * 0.072)) * boost;
      let blurMain = Math.floor((28 * boost) * performanceLevel.current);
      let blurShimmer = Math.floor((18 * boost) * performanceLevel.current);
      let blurEcho = Math.floor((38 * boost) * performanceLevel.current);
      if (fast) {
        blurMain = Math.max(12, Math.floor(blurMain * 0.75));
        blurShimmer = Math.max(10, Math.floor(blurShimmer * 0.75));
        blurEcho = Math.max(14, Math.floor(blurEcho * 0.7));
      }

      ctx.globalCompositeOperation = "screen";

  ctx.filter = `blur(${blurMain}px) saturate(${120 + burstRef.current * 50}%)`;
  ctx.strokeStyle = gradientMain(tq);
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN;
      ctx.stroke();

      {
        const e = ctrls(tq, 64, 0.9);
        ctx.filter = `blur(${blurEcho}px) saturate(${120 + burstRef.current * 45}%)`;
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = gradientMain(tq);
        ctx.beginPath();
        ctx.moveTo(X0, e.y0);
        ctx.bezierCurveTo(X1, e.y1, X2, e.y2, X3, e.y3);
        ctx.lineWidth = WECHO;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (!fast) {
        const count = performanceLevel.current >= 1 ? 6 : performanceLevel.current >= 0.75 ? 4 : 2;
        const cubic = (a: number, b: number, c: number, d: number, tt: number) => {
          const it = 1 - tt;
          return it * it * it * a + 3 * it * it * tt * b + 3 * it * tt * tt * c + tt * tt * tt * d;
        };
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < count; i++) {
          const p = (i / count + (t * 0.00008)) % 1;
          const gx = cubic(X0, X1, X2, X3, p);
          const gy = cubic(m.y0, m.y1, m.y2, m.y3, p);
          const size = 22 + 16 * Math.sin(t * 0.001 + i);
          ctx.globalAlpha = 0.08 + 0.12 * Math.max(0, Math.min(1, burstRef.current));
          ctx.filter = "blur(10px)";
          ctx.drawImage(glowSprite, gx - size / 2, gy - size / 2, size, size);
        }
        ctx.restore();
      }
      
      ctx.restore();


    }
    function frame(t: number) {
      if (t - lastFrameTime.current < frameInterval) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      const targetScroll = window.scrollY || 0;
      scrollRef.current += (targetScroll - scrollRef.current) * 0.15;

      const dy = Math.abs(targetScroll - (lastScrollY.current || targetScroll));
      const dtScroll = t - (lastScrollT.current || t);
      if (dtScroll > 0) {
        const speed = dy / dtScroll; // px per ms
        if (speed > 2) fastScrollUntil.current = t + 180;
      }
      lastScrollY.current = targetScroll;
      lastScrollT.current = t;
      fastScrollRef.current = t < fastScrollUntil.current;

      if (lastPerfSample.current) {
        const dt = t - lastPerfSample.current;
        perfSamples.push(dt);
        if (perfSamples.length > 40) perfSamples.shift();
        if (adjustCooldown > 0) adjustCooldown--;
        if (perfSamples.length >= 30 && adjustCooldown === 0) {
          const avg = perfSamples.reduce((a, b) => a + b, 0) / perfSamples.length;
          if (avg > 24 && performanceLevel.current > 0.5) {
            performanceLevel.current = performanceLevel.current >= 1 ? 0.75 : 0.5;
            resize();
            adjustCooldown = 120;
          } else if (avg < 17 && performanceLevel.current < 1) {
            performanceLevel.current = performanceLevel.current < 0.75 ? 0.75 : 1;
            resize();
            adjustCooldown = 160;
          }
        }
      }
      lastPerfSample.current = t;
      lastFrameTime.current = t;

      // Draw
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      drawAurora(t);

      rafRef.current = requestAnimationFrame(frame);
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!isVisible && rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        } else if (isVisible && !rafRef.current && !prefersReduced) {
          rafRef.current = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.1 }
    );

    if (c) observer.observe(c);

    if (!prefersReduced && isVisible) {
      rafRef.current = requestAnimationFrame(frame);
    } else {
      // Static render for reduced motion
      ctx.clearRect(0, 0, w, h);
      drawStars(0);
      drawAurora(0);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none will-change-transform" />
    </>
  );
});

/* =========================================================
   Layout helpers
   =======================================================*/
// Container and Section moved to components/layout/Layout

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">{children}</div>
  );
}

/* =========================================================
   Micro-interactions (optimized)
   =======================================================*/
function useCountdown(targetISO: string) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = React.useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}
// useSmoothScroll and useActiveSection moved to hooks/

function useMagnetic() {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;
    
    let rafId: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.12}px, ${my * 0.12}px)`;
        rafId = null;
      });
    };
    const onLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = `translate(0,0)`;
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return ref;
}

function useTilt() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;
    
    const el = ref.current;
    if (!el) return;
    
    let rafId: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
        el.style.boxShadow = `0 20px 40px rgba(186,137,255,0.10)`;
        const ox = e.clientX - r.left;
        const oy = e.clientY - r.top;
        el.style.setProperty("--mx", `${ox}px`);
        el.style.setProperty("--my", `${oy}px`);
        rafId = null;
      });
    };
    const reset = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = "";
      el.style.boxShadow = "";
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return ref;
}

/* =========================================================
  Decorative Orbs (optimized)
  =======================================================*/
// Orbs moved to components/common/Orbs

/* =========================================================
   Back to top button
   =======================================================*/
// BackToTop moved to components/common/BackToTop

/* =========================================================
   Floating CTA Dock
   =======================================================*/
// CTADock moved to components/common/CTADock

/* =========================================================
   Process Timeline
   =======================================================*/
// ProcessSection moved to components/process/ProcessSection

/* =========================================================
   Testimonials
   =======================================================*/
// Testimonials moved to components/testimonials/Testimonials

/* =========================================================
   FAQ (Accordion)
   =======================================================*/
// FAQ moved to components/faq/FAQ

/* =========================================================
   Gradient Ring (hover)
   =======================================================*/
// GradientRing is imported from components/common/GradientRing

/* =========================================================
  Countdown Section
  =======================================================*/

function CountdownStat({ value, label }: { value: number; label: string }) {
  const v = label === "Days" ? String(value) : String(value).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center gap-2">
  <div className="absolute inset-0 -z-10 countdown-tile-glow" aria-hidden />
      <div className="leading-none">
        <GradientNumber value={value} pad={label === "Days" ? 1 : 2} />
      </div>
      <div className="mt-1 text-base sm:text-lg md:text-xl font-medium text-white/80">
        {label}
      </div>
      <span className="sr-only">{v} {label}</span>
    </div>
  );
}

function CountdownSection() {
  const { days, hours, minutes, seconds, diff } = useCountdown(NEXT_EVENT.dateISO);
  const scrollTo = useSmoothScroll();
  const dateObj = React.useMemo(() => new Date(NEXT_EVENT.dateISO), []);
  const dateLabel = React.useMemo(
    () => dateObj.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
    [dateObj]
  );

  return (
    <Section id="countdown" className="pt-4">
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <div className="mb-2"><Eyebrow>Next up</Eyebrow></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            {NEXT_EVENT.title}
          </h2>
          <div className="mt-1 text-white/70 flex flex-col sm:flex-row items-center gap-2">
            <span>{NEXT_EVENT.location}</span>
            <span className="hidden sm:inline">•</span>
            <time dateTime={NEXT_EVENT.dateISO}>{dateLabel}</time>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-start justify-items-center max-w-5xl w-full">
            <CountdownStat value={days} label="Days" />
            <CountdownStat value={hours} label="Hours" />
            <CountdownStat value={minutes} label="Minutes" />
            <CountdownStat value={seconds} label="Seconds" />
          </div>

          <div className="mt-8">
            {diff === 0 ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-black font-semibold">
                Live now
              </span>
            ) : (
              <button
                onClick={() => scrollTo("agenda")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90"
              >
                View agenda <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* =========================================================
   Upcoming Congresses (replaces sample agenda)
   =======================================================*/
function UpcomingSection() {
  const now = Date.now();
  const items = React.useMemo(() => UPCOMING_EVENTS
    .map(e => ({ ...e, ts: new Date(e.dateISO).getTime() }))
    .filter(e => e.ts > now - 1000 * 60 * 60 * 12)
    .sort((a,b) => a.ts - b.ts), []);

  return (
    <Section id="upcoming">
      <Reveal>
        <div className="mb-3">
          <Eyebrow>Upcoming</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Next congresses</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          {items.map((e) => {
            const dt = new Date(e.dateISO);
            const days = Math.max(0, Math.ceil((dt.getTime() - now) / (1000*60*60*24)));
            return (
              <div key={e.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-white/80">{dt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                <div className="mt-1 text-white/60">{e.location}</div>
                <div className="mt-3 text-xl font-semibold">{e.title}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-white/70 text-sm">Starts in <span className="font-semibold text-white">{days}</span> days</div>
                  {e.href ? (
                    <a href={e.href} className="text-sm text-black font-medium px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] hover:opacity-90">Details</a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
/* =========================================================
   Nav
   =======================================================*/
// Nav moved to components/layout/Nav

/* Cards moved to components/ServiceCard and components/WorkCard */

// Reveal moved to components/common/Reveal
function GradientNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const text = String(value).padStart(pad, "0");
  const id = React.useId().replace(/:/g, "");
  const width = text.length >= 3 ? 280 : 200;
  const height = 120;
  const cls = text.length >= 3 ? "gradient-number-3" : "gradient-number-2";
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className={`block ${cls}`}
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6CA4FF" />
          <stop offset="50%" stopColor="#BA89FF" />
          <stop offset="100%" stopColor="#FFA85E" />
        </linearGradient>
        <filter id={`f${id}`} x="-40%" y="-60%" width="180%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
        </filter>
      </defs>
      {/* Glow */}
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="none"
        stroke={`url(#g${id})`}
        strokeWidth={6}
        filter={`url(#f${id})`}
        className="gradient-number-text"
      >
        {text}
      </text>
      {/* Crisp stroke */}
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="none"
        stroke={`url(#g${id})`}
        strokeWidth={2.2}
        className="gradient-number-text"
      >
        {text}
      </text>
    </svg>
  );
}

/* =========================================================
   Extras (optimized)
   =======================================================*/
// ScrollProgressBar moved to components/common/ScrollProgressBar

function CountUp({ to, label }: { to: number; label: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [val, setVal] = React.useState(0);
  const hasAnimated = React.useRef(false);
  
  React.useEffect(() => {
    if (hasAnimated.current) return;
    
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        obs.disconnect();
        
        const start = performance.now();
        const dur = 1200;
        const from = 0;
        
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setVal(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 px-4 sm:px-5 py-4 bg-white/5 backdrop-blur-sm text-center"
    >
      <div className="text-2xl sm:text-3xl font-semibold">
        {val.toLocaleString()}
      </div>
      <div className="text-white/70 text-xs sm:text-sm">{label}</div>
    </div>
  );
}

// UnlockFX extracted

/* Contact form extracted to components/forms/ContactForm.tsx */

/* =========================================================
   Footer
   =======================================================*/
// Footer moved to components/layout/Footer and used in RootLayout

/* =========================================================
   App
   =======================================================*/
function AnimatedHeadline() {
  const phrases = React.useMemo(
    () => [
      "we create worlds",
      "we shape experiences",
      "we stage congresses",
      "we craft stories",
    ],
    []
  );
  return (
    <span className="bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] bg-clip-text text-transparent inline-block">
      <TypeCycle phrases={phrases} />
    </span>
  );
}

function TypeCycle({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 45,
  pause = 1400,
  jitter = 12,
}: {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  jitter?: number;
}) {
  const [text, setText] = React.useState("");
  const [i, setI] = React.useState(0);
  const [del, setDel] = React.useState(false);
  const longest = React.useMemo(
    () => phrases.reduce((m, p) => Math.max(m, p.length), 0),
    [phrases]
  );

  React.useEffect(() => {
    const current = phrases[i % phrases.length];
    const done = text === current;
    const empty = text.length === 0;
    let t: number | undefined;

    const d = (base: number) => base + Math.floor(Math.random() * jitter);

    if (!del) {
      if (!done)
        t = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          d(typingSpeed)
        );
      else t = window.setTimeout(() => setDel(true), pause);
    } else {
      if (!empty)
        t = window.setTimeout(() => setText(text.slice(0, -1)), d(deletingSpeed));
      else {
        setDel(false);
        setI((v) => (v + 1) % phrases.length);
      }
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [text, del, i, phrases, typingSpeed, deletingSpeed, pause, jitter]);

  return (
    <span
      className="inline-flex items-center align-middle"
      style={{ minWidth: `${Math.ceil(longest * 0.62)}ch` }}
    >
      <span>{text}</span>
      <span className="ml-1 w-[2px] h-[1em] bg-white/80 animate-pulse" />
    </span>
  );
}

export default function App() {
  const scrollTo = useSmoothScroll();
  const mag1 = useMagnetic();
  const mag2 = useMagnetic();
  const [unlocking, setUnlocking] = React.useState(false);
  const [fxKey, setFxKey] = React.useState(0);
  const auroraRef = React.useRef<{ burst: () => void } | null>(null);

  const runUnlock = React.useCallback((targetId: string) => {
    if (unlocking) return;
    auroraRef.current?.burst?.();
    setFxKey((k) => k + 1);
    setUnlocking(true);
    window.setTimeout(() => {
      setUnlocking(false);
      requestAnimationFrame(() => scrollTo(targetId));
    }, 900);
  }, [unlocking, scrollTo]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#06070B]">
      <AuroraBackground ref={auroraRef} />
      <ScrollProgressBar />
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Nav />
      <CTADock onQuote={() => runUnlock("contact")} />
      <main id="content" className="relative z-10">
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-[calc(100vh-56px)] pt-14 md:pt-16 flex flex-col items-center justify-center text-center overflow-hidden"
        >
          <div className="absolute inset-x-0 top-14 z-[-1] h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]"
          />

          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <BadgeCheck className="w-4 h-4" />
                ISO-style ops, hotel brokerage, AV & media under one roof
              </div>
            </div>

            <div className="mt-5">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.08] md:leading-[1.05] max-w-6xl mx-auto">
                We don't organize events,
                <br className="hidden md:block" />
                <AnimatedHeadline />
              </h1>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto">
                Congress operations, hotel brokerage, AV production, transport, print, and media — under one roof.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  ref={mag1}
                  onClick={() => runUnlock("services")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition-all will-change-transform"
                >
                  Explore services <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  ref={mag2}
                  onClick={() => runUnlock("contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 transition-all will-change-transform"
                >
                  Get a quote <Mail className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl mx-auto">
                <CountUp to={120} label="Congress days / yr" />
                <CountUp to={20} label="Cities covered" />
                <CountUp to={45000} label="Guests hosted" />
              </div>
            </div>
          </Container>
        </section>

  {/* COUNTDOWN */}
  <CountdownSection />

        {/* SERVICES */}
        <Section id="services">
          <Reveal>
            <div className="flex items-center justify-between gap-6">
              <div>
                <Eyebrow>What we do</Eyebrow>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  Services
                </h2>
              </div>
              <div className="text-white/70 text-sm">
                End-to-end, modular, and accountable.
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            <Reveal delay={50}>
              <ServiceCard
                Icon={Building2}
                title="Hotel & Venue Brokerage"
                desc="Lock the right rooms and space at the right rates — contracting, allotments, attrition, and an onsite desk."
                points={[
                  "Citywide & resort destinations",
                  "Allotment & attrition strategy",
                  "Onsite front-desk integration",
                ]}
              />
            </Reveal>

            <Reveal delay={100}>
              <ServiceCard
                Icon={MonitorSpeaker}
                title="Production & AV"
                desc="Cinematic stages and crystal speech — LED, projection mapping, audio, lighting, and translation."
                points={[
                  "Stage design & CADs",
                  "LED / projection mapping",
                  "Hybrid & livestream",
                ]}
              />
            </Reveal>

            <Reveal delay={150}>
              <ServiceCard
                Icon={Printer}
                title="Print & Branding"
                desc="Wayfinding that guides and branding that pops — badges, backdrops, lanyards, and booths."
                points={[
                  "Large-format & eco inks",
                  "Brand guardianship",
                  "Onsite make-good team",
                ]}
              />
            </Reveal>

            <Reveal delay={200}>
              <ServiceCard
                Icon={Bus}
                title="Transport & Logistics"
                desc="Arrivals that feel effortless — fleet planning, manifests, dispatch, and last-mile ops."
                points={[
                  "Airport & VIP protocols",
                  "Shuttle routing & stewards",
                  "Risk & contingency playbooks",
                ]}
              />
            </Reveal>

            <Reveal delay={250}>
              <ServiceCard
                Icon={Video}
                title="Media & Content"
                desc="Stories people share — openers, recaps, speaker support, photography, and social clips."
                points={["Editorial boards", "Motion graphics", "Same-day edits"]}
              />
            </Reveal>

            <Reveal delay={300}>
              <ServiceCard
                Icon={Palette}
                title="Experience Design"
                desc="Journeys that flow — mapping, scenography, and meaningful touchpoints."
                points={[
                  "Flows & service design",
                  "Installations & micro-wow",
                  "Inclusive & accessible",
                ]}
              />
            </Reveal>
          </div>
        </Section>

        {/* PARTNERS */}
        <Section id="partners" className="pt-4">
          <Reveal>
            <div className="mb-6">
              <Eyebrow>Who we serve</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Trusted by chapters & institutions
              </h2>
            </div>
            <div className="relative overflow-hidden group partners-mask">
              <div data-marq className="flex gap-16 items-center animate-[marq_35s_linear_infinite] group-hover:[animation-play-state:paused]">
                {PARTNER_LOGOS.map((p, i) => (
                  <img
                    key={i}
                    src={p.src}
                    alt={p.alt}
                    className="h-12 sm:h-14 md:h-16 object-contain opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                {PARTNER_LOGOS.map((p, i) => (
                  <img
                    key={`dup-${i}`}
                    src={p.src}
                    alt={p.alt}
                    className="h-12 sm:h-14 md:h-16 object-contain opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* AGENDA (Upcoming Congresses) */}
        <Section id="agenda">
          <Reveal>
            <div className="mb-3">
              <Eyebrow>Upcoming congresses</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">What's next on our calendar</h2>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {UPCOMING_EVENTS
                .slice()
                .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
                .map((ev) => {
                  const d = new Date(ev.dateISO);
                  const dateText = d.toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  });
                  const timeText = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={`${ev.title}-${ev.dateISO}`} className="grad-ring grad-ring--light rounded-2xl group">
                      <div className="rounded-[14px] md:rounded-[16px] border border-white/10 bg-white/5 p-6">
                        <div className="text-sm text-white/70">{ev.location}</div>
                        <div className="text-lg sm:text-xl font-semibold mt-1">{ev.title}</div>
                        <div className="mt-3 flex items-center gap-3 text-white/80">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg bg-black/30 border border-white/10 text-xs">
                            {dateText}
                          </span>
                          <span className="text-white/60">{timeText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Reveal>
        </Section>

        {/* WORK */}
        <Section id="work">
          <Reveal>
            <div className="flex items-center justify-between gap-6">
              <div>
                <Eyebrow>Case studies</Eyebrow>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  Our Worlds
                </h2>
              </div>
              <div className="text-white/70 text-sm">
                Highlights from conferences & festivals.
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {WORKS.map((w, i) => (
              <Reveal key={w.title} delay={50 + i * 50}>
                <WorkCard role={w.role} title={w.title} tags={w.tags} caseStudy={w.caseStudy} />
              </Reveal>
            ))}
          </div>
        </Section>

  {/* PROCESS */}
  <ProcessSection />

        {/* CONTACT */}
        <Section id="contact">
          <Reveal>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  Let's plan your next congress
                </h2>
                <p className="text-white/80">
                  Tell us dates, city, headcount, and anything special. We'll
                  reply with a venue short-list and draft budget.
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <a href="tel:+21612345678" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" /> +216 12 345 678
                  </a>
                  <a href="mailto:hello@starwaves.tn" className="mt-2 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" /> hello@starwaves.tn
                  </a>
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" /> Tunis • Sousse • Hammamet
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Section>
  </main>

  <BackToTop />

  {/* FX */}
  {unlocking && <UnlockFX trigger={fxKey} />}
    </div>
  );
}