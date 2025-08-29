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
  Check,
  XCircle,
  Loader2,
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

/* =========================================================
   Aurora Canvas Background (optimized for performance)
   =======================================================*/
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

    // Performance detection
    const isCoarse = window.matchMedia && !window.matchMedia("(pointer: fine)").matches;
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;
    
    // Set performance level
    if (isLowEnd) performanceLevel.current = 0.5;
    else if (isMobile) performanceLevel.current = 0.75;
    else performanceLevel.current = 1;

  let stars: { x: number; y: number; r: number; z: number; p: number; baseY: number }[] = [];
  // Constellations removed

  // Cached star sprite for faster draws
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

  // Cached glow sprite for aurora glints
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
      
      // Constellations removed
    };

    // buildConstellations removed

    // Cached gradients
    const gradCache = {
      main: null as CanvasGradient | null,
      vignette: null as CanvasGradient | null,
      shimmer: null as CanvasGradient | null,
      radial: null as CanvasGradient | null,
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      
      // Adaptive DPI based on performance
  const cap = performanceLevel.current >= 1 ? 2 : performanceLevel.current >= 0.75 ? 1.5 : 1.25;
  dpr = Math.min(cap, window.devicePixelRatio || 1);
      
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Clear all caches on resize
      Object.keys(gradCache).forEach(key => {
        gradCache[key as keyof typeof gradCache] = null;
      });
      
      buildStars();
    };

    // Optimized resize handler
    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize, { passive: true });

  // Remove scroll timers: sample scroll in RAF with smoothing

    // Cached gradient functions
    // Quantized time-varying main gradient cache
    const gradMainCache = { key: -1, grad: null as CanvasGradient | null };
    const gradientMain = (t?: number) => {
      const steps = 16;
      const idx = t ? Math.round(((Math.sin(t * 0.00022) + 1) * 0.5) * steps) : 0;
      if (gradMainCache.grad && gradMainCache.key === idx) return gradMainCache.grad;
      const sway = (idx / steps - 0.5) * 2; // -1..1
      // Darker opacities so black background stays dominant
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

  // Shimmer removed entirely

  // Striations kept but disabled
  const SHOW_STRIATIONS = false;
  function striations() { /* disabled */ }

    // Optimized aurora drawing
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

  // Use cached radial gradient with slight breathing (darker)
  ctx.fillStyle = gradientRadial();
  const breath = 0.9 + 0.06 * Math.sin(t * 0.0003);
  ctx.globalAlpha = 0.85 * breath * (1 + burstRef.current * 0.6);
      ctx.fillRect(-w, -h, w * 2, h * 2);
      ctx.globalAlpha = 1;

      // Quantize time for control points to ~30Hz
      const tq = Math.floor(t / 33) * 33;
      const m = ctrls(tq, 0, 1);
      const X0 = -w * 0.28, X1 = w * 0.25, X2 = w * 0.6, X3 = w * 1.3;
      
      // Adaptive blur and width based on performance
      let WMAIN = Math.max(120, Math.min(185, w * 0.1)) * boost;
      let WECHO = Math.max(90, Math.min(130, w * 0.072)) * boost;
      let blurMain = Math.floor((28 * boost) * performanceLevel.current);
      let blurShimmer = Math.floor((18 * boost) * performanceLevel.current);
      let blurEcho = Math.floor((38 * boost) * performanceLevel.current);
      if (fast) {
        // Keep lines visible during fast scroll: reduce blur a bit but keep widths
        blurMain = Math.max(12, Math.floor(blurMain * 0.75));
        blurShimmer = Math.max(10, Math.floor(blurShimmer * 0.75));
        blurEcho = Math.max(14, Math.floor(blurEcho * 0.7));
      }

      ctx.globalCompositeOperation = "screen";

  // Main aurora path (reduced saturation)
  ctx.filter = `blur(${blurMain}px) saturate(${120 + burstRef.current * 50}%)`;
  ctx.strokeStyle = gradientMain(tq);
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN;
      ctx.stroke();

  // Shimmer layer removed to eliminate thin line and improve performance

      // Echo layer (dimmer)
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

  // Striations disabled

      // Lightweight glints along the path (kept minimal for performance)
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

  // Constellations removed

      // Vignette moved to CSS overlay to avoid per-frame fill
    }

    // RAF loop
    function frame(t: number) {
      // FPS limiting for performance
      if (t - lastFrameTime.current < frameInterval) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      // Smoothly sample scroll
      const targetScroll = window.scrollY || 0;
      scrollRef.current += (targetScroll - scrollRef.current) * 0.15;

      // Detect fast scroll and simplify effects briefly
      const dy = Math.abs(targetScroll - (lastScrollY.current || targetScroll));
      const dtScroll = t - (lastScrollT.current || t);
      if (dtScroll > 0) {
        const speed = dy / dtScroll; // px per ms
        if (speed > 2) fastScrollUntil.current = t + 180;
      }
      lastScrollY.current = targetScroll;
      lastScrollT.current = t;
      fastScrollRef.current = t < fastScrollUntil.current;

      // Perf sampling & dynamic adjustment
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
      // Always draw aurora each frame; rely on lower FPS + fast-scroll simplification
      drawAurora(t);

      rafRef.current = requestAnimationFrame(frame);
    }

    // Intersection Observer to pause when not visible
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
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`relative py-12 sm:py-16 md:py-20 ${className}`}>
      <Orbs />
      <Container>{children}</Container>
    </section>
  );
}

/* =========================================================
   Micro-interactions (optimized)
   =======================================================*/
function useSmoothScroll() {
  const ease = React.useCallback(
    (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    []
  );

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = 56;
    const target = el.getBoundingClientRect().top + window.scrollY - header;

    if (reduced) {
      window.scrollTo(0, target);
      return;
    }

    const start = window.scrollY;
    const duration = 800;
    let startTime: number | null = null;

    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const p = Math.min(1, (ts - startTime) / duration);
      const y = start + (target - start) * ease(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [ease, reduced]);
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0]);
  React.useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

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
function Orbs() {
  return null;
}

/* =========================================================
   Back to top button
   =======================================================*/
function BackToTop() {
  const [show, setShow] = React.useState(false);
  const scrollTo = useSmoothScroll();
  
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShow((window.scrollY || 0) > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  if (!show) return null;
  return (
    <button
      onClick={() => scrollTo("home")}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-30 rounded-full bg-white text-black shadow-lg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 w-12 h-12 grid place-items-center will-change-transform"
    >
      ↑
    </button>
  );
}

/* =========================================================
   Floating CTA Dock
   =======================================================*/
function CTADock({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm will-change-transform">
      <button
        onClick={onQuote}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black text-sm font-medium hover:opacity-90"
      >
        <Mail className="w-3.5 h-3.5" /> Get a quote
      </button>
      <a
        href="tel:+21612345678"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm"
      >
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <a
        href="mailto:hello@starwaves.tn"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm"
      >
        <Send className="w-3.5 h-3.5" /> Email
      </a>
    </div>
  );
}

/* =========================================================
   Process Timeline
   =======================================================*/
function StepCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  return (
    <div className="relative group">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#6CA4FF]/80 to-[#BA89FF]/80 text-black font-semibold grid place-items-center">
            <span className="text-black">{index}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="mt-1 text-white/80 text-sm">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessSection() {
  const steps = [
    { title: "Discovery", desc: "Objectives, stakeholders, constraints, and KPIs." },
    { title: "Design", desc: "Experience mapping, scenography, media plan, and budgets." },
    { title: "Pre‑production", desc: "Vendors, CADs, run‑of‑show, logistics & risk playbooks." },
    { title: "Onsite ops", desc: "Hotel desk, stage & AV, transport, and branding install." },
    { title: "Wrap & report", desc: "Strike, reconciliation, and post‑event media delivery." },
  ];
  return (
    <Section id="process">
      <Reveal>
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">How we work</h2>
          <div className="text-white/70 text-sm">Structured, accountable, repeatable.</div>
        </div>
      </Reveal>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <StepCard title={s.title} desc={s.desc} index={i + 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =========================================================
   Testimonials
   =======================================================*/
function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="relative group">
      <GradientRing />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        {/* decorative radial removed */}
        <div className="relative">
          <div className="text-white/90 italic">"{quote}"</div>
          <div className="mt-4 text-sm text-white/70">{author} — {role}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const items = [
    { quote: "Flawless operations and a creative team we could trust.", author: "Chapter Chair", role: "Medical Society" },
    { quote: "From venues to media, everything was coordinated and clear.", author: "Program Director", role: "Gov Forum" },
    { quote: "Attendees loved the production value and pace.", author: "Event Manager", role: "Expo" },
  ];
  return (
    <Section id="testimonials">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">What clients say</h2>
        <div className="text-white/70">Signals from recent congresses & expos.</div>
      </Reveal>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <Reveal key={i} delay={i * 60}>
            <TestimonialCard {...t} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* =========================================================
   FAQ (Accordion)
   =======================================================*/
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <button
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-white/5 rounded-xl transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-white/80 text-sm">{a}</div>
      )}
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "How fast can you quote?", a: "Typically within 48 hours with at least one venue option and draft budget." },
    { q: "Do you work outside Tunisia?", a: "Yes, via partner networks; brokerage and media remain in-house." },
    { q: "Minimum event size?", a: "We tailor to scope; from 150 pax breakouts to 2,000+ plenaries." },
    { q: "Do you support hybrid/streaming?", a: "Yes — multi-cam, hybrid stages, and multilingual streaming." },
    { q: "Can you handle branding & expo booths?", a: "Full print ecosystem, wayfinding, lanyards, booths, and overnight installs." },
  ];
  return (
    <Section id="faq">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">Frequently asked</h2>
        <div className="text-white/70">Quick answers to common questions.</div>
      </Reveal>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {faqs.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </Section>
  );
}

/* =========================================================
   Gradient Ring (hover)
   =======================================================*/
function GradientRing() {
  return (
    <span
      data-test="grad-ring"
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      style={{
        background: "linear-gradient(90deg, #6CA4FF, #BA89FF, #FFA85E)",
        padding: "1px",
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        borderRadius: "1rem",
      }}
    />
  );
}

/* =========================================================
   Nav
   =======================================================*/
function Nav() {
  const scrollTo = useSmoothScroll();
  const active = useActiveSection([
    "home",
    "services",
    "partners",
    "work",
    "about",
    "contact",
  ]);
  const [open, setOpen] = React.useState(false);

  const link = (id: string) => (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOpen(false);
    scrollTo(id);
  };

  const linkClass = (id: string) =>
    `hover:text-white relative transition-colors ${
      active === id
        ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70"
        : "text-white/80"
    }`;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-20 border-b border-white/10 backdrop-blur-md bg-transparent">
        <Container className="flex items-center justify-between h-14">
          <a
            href="#home"
            onClick={link("home")}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="Starwaves"
              className="block w-36 sm:w-40 md:w-44 h-auto"
              loading="eager"
              decoding="async"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#home" onClick={link("home")} className={linkClass("home")}>
              Home
            </a>
            <a
              href="#services"
              onClick={link("services")}
              className={linkClass("services")}
            >
              Services
            </a>
            <a
              href="#partners"
              onClick={link("partners")}
              className={linkClass("partners")}
            >
              Partners
            </a>
            <a href="#work" onClick={link("work")} className={linkClass("work")}>
              Work
            </a>
            <a
              href="#about"
              onClick={link("about")}
              className={linkClass("about")}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={link("contact")}
              className={linkClass("contact")}
            >
              Contact
            </a>
          </nav>

          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Menu</span>
            <span className="block w-5 h-0.5 bg-white/90" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
          </button>
        </Container>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-md">
          <Container className="pt-20">
            <div className="flex justify-between items-center mb-6">
              <img src="/logo.png" alt="Starwaves" className="w-36 h-auto" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col text-lg space-y-4 text-white/90">
              <a href="#home" onClick={link("home")} className="hover:text-white transition-colors">
                Home
              </a>
              <a
                href="#services"
                onClick={link("services")}
                className="hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#partners"
                onClick={link("partners")}
                className="hover:text-white transition-colors"
              >
                Partners
              </a>
              <a href="#work" onClick={link("work")} className="hover:text-white transition-colors">
                Work
              </a>
              <a
                href="#about"
                onClick={link("about")}
                className="hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={link("contact")}
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}

/* =========================================================
   Cards
   =======================================================*/
function ServiceCard({
  title,
  desc,
  points,
  Icon,
}: {
  title: string;
  desc: string;
  points?: string[];
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative group" data-test="service-card">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 md:p-8 backdrop-blur-sm transition-shadow hover:shadow-[0_0_40px_0_rgba(186,137,255,0.12)]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-2">
            <Icon className="w-6 h-6 text-white/90" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm md:text-base text-white/80">{desc}</p>
          </div>
        </div>
        {points?.length ? (
          <ul className="mt-4 space-y-1.5 text-sm text-white/70">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-white/60" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function WorkCard({
  title,
  role,
  tags = [],
}: {
  title: string;
  role: string;
  tags?: string[];
}) {
  const tiltRef = useTilt();
  return (
    <div className="relative group" data-test="work-card">
      <GradientRing />
      <div
        ref={tiltRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 sm:p-7 md:p-8 backdrop-blur-[2px] hover:from-white/10 transition-all will-change-transform"
      >
  {/* decorative radials removed */}
        <div className="relative">
          <div className="text-sm text-white/70">{role}</div>
          <div className="text-xl sm:text-2xl font-semibold">{title}</div>
          {tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Reveal (optimized)
   =======================================================*/
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);
  
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18, rootMargin: "50px" }
    );
    
    io.observe(el);
    return () => io.disconnect();
  }, []);
  
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 translate-y-6 scale-[.98] will-change-transform transition duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0 scale-100" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   Extras (optimized)
   =======================================================*/
function ScrollProgressBar({ show = true }: { show?: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!show) return;
    const el = ref.current!;
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.body.scrollHeight - window.innerHeight;
          const p = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, max)));
          if (el) el.style.transform = `scaleX(${p})`;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show]);
  
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[30] h-[3px] bg-transparent">
      <div
        ref={ref}
        className="origin-left h-full bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] scale-x-0 will-change-transform"
      />
    </div>
  );
}

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

/* =========================================================
   Unlock FX (optimized)
   =======================================================*/
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
    
    // Lower resolution for FX canvas
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    let w = (c.width = window.innerWidth * dpr);
    let h = (c.height = window.innerHeight * dpr);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fewer particles for better performance
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
      
      // Simplified aurora burst layers
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
      
      // Draw particles with reduced blur
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
      
      // Draw sparkles with minimal blur
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
  {/* decorative radial removed */}
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
  {/* sparkle dots removed */}
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

/* =========================================================
   Contact Form
   =======================================================*/
function ContactForm() {
  type FormState = {
    name: string;
    email: string;
    phone: string;
    city: string;
    dates: string;
    headcount: string;
    rooms: string;
    budget: string;
    av: string;
    message: string;
    honey: string;
  };
  
  const ids = React.useMemo(() => ({
    name: "cf_name",
    email: "cf_email",
    phone: "cf_phone",
    city: "cf_city",
    dates: "cf_dates",
    headcount: "cf_headcount",
    rooms: "cf_rooms",
    budget: "cf_budget",
    av: "cf_av",
    message: "cf_message",
  } as const), []);

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    phone: "",
    city: "",
    dates: "",
    headcount: "",
    rooms: "",
    budget: "",
    av: "",
    message: "",
    honey: "",
  });

  const [touched, setTouched] = React.useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    city: false,
    dates: false,
    headcount: false,
    rooms: false,
    budget: false,
    av: false,
    message: false,
    honey: false,
  });

  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [globalMsg, setGlobalMsg] = React.useState<string>("");

  const validEmail = (v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v.trim());
  const required = (v: string) => v.trim().length > 0;

  const formatTN = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    if (digits.startsWith("216")) {
      const rest = digits.slice(3);
      return (
        "+216 " +
        rest.replace(
          /(\d{2})(\d{3})(\d{3})?/,
          (_m, a, b, c) => [a, b, c].filter(Boolean).join(" ")
        )
      );
    }
    if (digits.startsWith("00216")) {
      const rest = digits.slice(5);
      return (
        "+216 " +
        rest.replace(
          /(\d{2})(\d{3})(\d{3})?/,
          (_m, a, b, c) => [a, b, c].filter(Boolean).join(" ")
        )
      );
    }
    if (v.startsWith("+")) return "+" + digits;
    return digits;
  };

  const onField = <K extends keyof FormState>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.currentTarget?.value ?? "";
    const v = k === "phone" ? formatTN(raw) : raw;
    setForm((s) => ({ ...s, [k]: v }));
  };

  const onBlur = <K extends keyof FormState>(k: K) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const errorFor = (k: keyof FormState): string | null => {
    if (k === "name" && touched.name && !required(form.name))
      return "Name is required";
    if (k === "email" && touched.email && !validEmail(form.email))
      return "Enter a valid email";
    if (k === "message" && touched.message && !required(form.message))
      return "Tell us a few details";
    return null;
  };

  const hasError = (k: keyof FormState) => Boolean(errorFor(k));
  const isOK = (k: keyof FormState) =>
    touched[k] && !hasError(k) && required((form[k] as string) ?? "");

  const leftChars = 1200 - form.message.length;
  const messageTooLong = form.message.length > 1200;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((t) => ({ ...t, name: true, email: true, message: true }));
    if (form.honey) return;

    if (
      !required(form.name) ||
      !validEmail(form.email) ||
      !required(form.message) ||
      messageTooLong
    ) {
      setStatus("error");
      setGlobalMsg(
        messageTooLong
          ? "Your message is a bit long — please shorten it."
          : "Please fix the highlighted fields."
      );
      return;
    }

    setStatus("sending");
    setGlobalMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      setGlobalMsg(
        "Thanks! We'll reply within 48h with a venue short-list & draft budget."
      );
    } catch {
      const subject = encodeURIComponent(
        `Event inquiry from ${form.name} — ${form.city || ""}`
      );
      const body = encodeURIComponent(
        `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
City: ${form.city}
Dates: ${form.dates}
Headcount: ${form.headcount}
Rooms/night: ${form.rooms}
Budget: ${form.budget}
AV: ${form.av}

Message:
${form.message}

Sent via starwaves.tn`
      );
      window.location.href = `mailto:hello@starwaves.tn?subject=${subject}&body=${body}`;
      setStatus("sent");
      setGlobalMsg("Thanks! Your email client should open with the details.");
    }
  };

  const Field = ({
    label,
    name,
    requiredField,
    hint,
    ok,
    error,
    children,
  }: {
    label: string;
    name: string;
    requiredField?: boolean;
    hint?: string;
    ok?: boolean;
    error?: string | null;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-xs text-white/70">
          {label}{" "}
          {requiredField ? (
            <span className="text-white/40">(required)</span>
          ) : null}
        </label>
        <div className="h-5">
          {ok ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : error ? (
            <XCircle className="w-4 h-4 text-rose-300" />
          ) : null}
        </div>
      </div>
      {children}
      <div className="min-h-[1rem] text-[11px] leading-4">
        {error ? (
          <span className="text-rose-300">{error}</span>
        ) : hint ? (
          <span className="text-white/50">{hint}</span>
        ) : null}
      </div>
    </div>
  );

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 md:p-8 text-left"
      noValidate
    >
      <div className="sr-only" aria-live="polite">
        {globalMsg}
      </div>

      <input
        type="text"
        name="company"
        value={form.honey}
        onChange={onField("honey")}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
      />

      {status === "sent" && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/60 text-center p-8">
          <div>
            <div className="text-2xl font-semibold mb-2">Thank you!</div>
            <p className="text-white/80">
              {globalMsg || "We'll be in touch shortly."}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Field
          label="Name"
          name="name"
          requiredField
          ok={isOK("name")}
          error={errorFor("name")}
        >
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={onField("name")}
            onBlur={onBlur("name")}
            placeholder="Your full name"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="name"
          />
        </Field>

        <Field
          label="Email"
          name="email"
          requiredField
          ok={isOK("email") && validEmail(form.email)}
          error={errorFor("email")}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onField("email")}
            onBlur={onBlur("email")}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone" name="phone" hint="Optional">
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onField("phone")}
            onBlur={onBlur("phone")}
            placeholder="+216 12 345 678"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="tel"
            inputMode="tel"
          />
        </Field>

        <Field label="City" name="city" hint="Where the event happens">
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={onField("city")}
            onBlur={onBlur("city")}
            placeholder="Tunis, Hammamet, Sousse..."
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="address-level2"
          />
        </Field>

        <Field label="Dates" name="dates" hint="e.g., 12–14 Oct 2025">
          <input
            id="dates"
            name="dates"
            value={form.dates}
            onChange={onField("dates")}
            onBlur={onBlur("dates")}
            placeholder="e.g., 12–14 Oct 2025"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
        </Field>

        <Field label="Headcount" name="headcount" hint="Approximate total">
          <input
            id="headcount"
            name="headcount"
            value={form.headcount}
            onChange={onField("headcount")}
            onBlur={onBlur("headcount")}
            placeholder="e.g., 400"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </Field>

        <Field label="Rooms / night" name="rooms" hint="Hotel block estimate">
          <input
            id="rooms"
            name="rooms"
            value={form.rooms}
            onChange={onField("rooms")}
            onBlur={onBlur("rooms")}
            placeholder="e.g., 120"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </Field>

        <Field label="Budget" name="budget" hint="Rough range is fine">
          <input
            id="budget"
            name="budget"
            value={form.budget}
            onChange={onField("budget")}
            onBlur={onBlur("budget")}
            placeholder="e.g., 80,000 TND"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            label="AV / Stage needs"
            name="av"
            hint="LED / projection / streaming / translation…"
          >
            <input
              id="av"
              name="av"
              value={form.av}
              onChange={onField("av")}
              onBlur={onBlur("av")}
              placeholder="LED / projection / streaming / translation..."
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label="Message"
            name="message"
            requiredField
            ok={touched.message && !messageTooLong && required(form.message)}
            error={
              messageTooLong
                ? "Max 1200 characters"
                : touched.message && !required(form.message)
                ? "Tell us a few details"
                : null
            }
          >
            <textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={onField("message")}
              onBlur={onBlur("message")}
              rows={6}
              placeholder="Tell us about your congress..."
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
              maxLength={1400}
            />
            <div className="mt-1 text-[11px] text-white/50 text-right">
              {Math.max(0, leftChars)} / 1200
            </div>
          </Field>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-4 text-sm text-rose-300" aria-live="polite">
          {globalMsg || "Please check the fields above."}
        </div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-all"
        >
          {status === "sending" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="text-xs text-white/50">
          We usually reply within 48h.
        </span>
      </div>
    </form>
  );
}

/* =========================================================
   Footer
   =======================================================*/
function Footer() {
  const scrollTo = useSmoothScroll();
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <footer id="footer" className="relative z-10 mt-16 border-t border-white/10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E]" />
      <Container className="py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <img
              src="/logo.png"
              alt="Starwaves"
              className="w-36 sm:w-40 md:w-44 h-auto"
            />
            <p className="mt-4 text-white/70 text-sm">
              Discover cinematic congress operations across Tunisia. We
              orchestrate hotels, transport, AV, print, and media into one
              smooth system.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.facebook.com/Starwaves"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href="#home"
                  onClick={go("home")}
                  className="hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={go("about")}
                  className="hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  onClick={go("work")}
                  className="hover:text-white transition-colors"
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={go("contact")}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Hotel & Venue Brokerage
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Production & AV
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Print & Branding
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Transport & Logistics
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Media & Content
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={go("services")}
                  className="hover:text-white transition-colors"
                >
                  Experience Design
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a
                  href="#contact"
                  onClick={go("contact")}
                  className="hover:text-white transition-colors"
                >
                  Get a quote
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={go("contact")}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <span className="text-white/40">FAQs (coming soon)</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-white/60">
          <div>
            © {new Date().getFullYear()} Starwaves Events & Congresses — SARL •
            Capital 5,000 TND
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" onClick={go("home")} className="hover:text-white transition-colors">
              Back to top
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}

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
      <Nav />
      <CTADock onQuote={() => runUnlock("contact")} />
      <main className="relative z-10">
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
                Event & Congress Management • Hotel Brokerage • Media &
                Experience Design
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

        {/* SERVICES */}
        <Section id="services">
          <Reveal>
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Services
              </h2>
              <div className="text-white/70 text-sm">
                End-to-end, modular, and accountable.
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Reveal delay={50}>
              <ServiceCard
                Icon={Building2}
                title="Hotel & Venue Brokerage"
                desc="Contracting, rooming lists, allotments, attrition, and onsite desk."
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
                desc="Stagecraft, LED, projection, audio, lighting, simultaneous translation."
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
                desc="Wayfinding, lanyards, badges, backdrops, booths — installed overnight."
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
                desc="Fleet planning, manifests, arrivals, dispatch, last-mile ops."
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
                desc="Openers, recaps, titles, speaker support, photography, social clips."
                points={["Editorial boards", "Motion graphics", "Same-day edits"]}
              />
            </Reveal>

            <Reveal delay={300}>
              <ServiceCard
                Icon={Palette}
                title="Experience Design"
                desc="Attendee journey mapping, scenography, gamified touchpoints."
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
              Trusted by chapters & institutions
            </h2>
            <div
              className="relative overflow-hidden group"
              style={{
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
                maskImage:
                  "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
              }}
            >
              <div className="flex gap-16 items-center animate-[marq_35s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[
                  "/logos/ENIT SB.png",
                  "/logos/iip esprit.png",
                  "/logos/ESPRIT SB.svg",
                  "/logos/sec.png",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Partner logo"
                    className="h-12 sm:h-14 md:h-16 object-contain opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                {[
                  "/logos/ENIT SB.png",
                  "/logos/iip esprit.png",
                  "/logos/ESPRIT SB.svg",
                  "/logos/sec.png",
                ].map((src, i) => (
                  <img
                    key={`dup-${i}`}
                    src={src}
                    alt="Partner logo"
                    className="h-12 sm:h-14 md:h-16 object-contain opacity-90"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
              <style>{`
                @keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              `}</style>
            </div>
          </Reveal>
        </Section>

        {/* WORK */}
        <Section id="work">
          <Reveal>
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Our Worlds
              </h2>
              <div className="text-white/70 text-sm">
                Highlights from conferences & festivals.
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Reveal delay={50}>
              <WorkCard
                role="Congress operations"
                title="IASTAM 5.0 2025"
                tags={["1,800 pax", "4 hotels", "2 live stages"]}
              />
            </Reveal>
            <Reveal delay={100}>
              <WorkCard
                role="Congress operations"
                title="WIE ACT 4.0"
                tags={["6K sqm", "Booth build", "Wayfinding"]}
              />
            </Reveal>
            <Reveal delay={150}>
              <WorkCard
                role="Media & broadcast"
                title="Gov Innovation Forum"
                tags={["3-cam studio", "Live captions", "Multilang stream"]}
              />
            </Reveal>
          </div>
        </Section>

        {/* PROCESS */}
        <ProcessSection />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* ABOUT */}
        <Section id="about">
          <div className="grid lg:grid-cols-2 gap-8">
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h3 className="text-xl font-semibold">Why Starwaves</h3>
                <p className="mt-3 text-white/80">
                  We run congresses like productions: one schedule, one budget,
                  one accountable team. Our ops fuse hospitality, broadcast, and
                  brand design so attendees feel guided — and clients feel
                  safe.
                </p>
                <ul className="mt-4 space-y-2 text-white/70 text-sm">
                  <li className="flex gap-2">
                    <Star className="w-4 h-4 mt-0.5" />
                    Cost control & transparent quotes
                  </li>
                  <li className="flex gap-2">
                    <Star className="w-4 h-4 mt-0.5" />
                    Backup plans & risk playbooks
                  </li>
                  <li className="flex gap-2">
                    <Star className="w-4 h-4 mt-0.5" />
                    Inclusive & accessible experiences
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h3 className="text-xl font-semibold">At a glance</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-2xl font-semibold">+10yrs</div>
                    <div className="text-xs text-white/70">Track record</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-2xl font-semibold">Tier-1</div>
                    <div className="text-xs text-white/70">Hotel partners</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-2xl font-semibold">In-house</div>
                    <div className="text-xs text-white/70">Media team</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-2xl font-semibold">Turnkey</div>
                    <div className="text-xs text-white/70">A→Z delivery</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* FAQ */}
        <FAQ />

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
                  <div className="flex items-center gap-2 text-white/80">
                    <Phone className="w-4 h-4" /> +216 12 345 678
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <Mail className="w-4 h-4" /> hello@starwaves.tn
                  </div>
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

      <Footer />
      <BackToTop />

      {/* FX */}
      {unlocking && <UnlockFX trigger={fxKey} />}
    </div>
  );
}