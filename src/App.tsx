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
   Performance Monitor
   =======================================================*/
const usePerformanceMonitor = () => {
  const [quality, setQuality] = React.useState(1);
  const frameTimesRef = React.useRef<number[]>([]);
  const lastFrameRef = React.useRef(0);

  const recordFrame = React.useCallback(() => {
    const now = performance.now();
    if (lastFrameRef.current) {
      const frameTime = now - lastFrameRef.current;
      frameTimesRef.current.push(frameTime);
      
      // Keep only last 60 frames
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }
      
      // Adjust quality every 30 frames
      if (frameTimesRef.current.length >= 30 && frameTimesRef.current.length % 30 === 0) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = 1000 / avgFrameTime;
        
        if (fps < 45 && quality > 0.5) {
          setQuality(prev => Math.max(0.5, prev - 0.1));
        } else if (fps > 55 && quality < 1) {
          setQuality(prev => Math.min(1, prev + 0.05));
        }
      }
    }
    lastFrameRef.current = now;
  }, [quality]);

  return { quality, recordFrame };
};

/* =========================================================
   Aurora Canvas Background (optimized)
   =======================================================*/
const AuroraBackground = React.memo(React.forwardRef<{ burst: () => void }>(function AuroraBackground(_, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const scrollRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const burstRef = React.useRef(0);
  const lastFrameRef = React.useRef(0);
  const { quality, recordFrame } = usePerformanceMonitor();

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
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

    let stars: { x: number; y: number; r: number; z: number; p: number }[] = [];

    const isCoarse = window.matchMedia && !window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const buildStars = () => {
      const base = Math.max(220, Math.floor((w * h) / 12000));
      const starCount = Math.floor(base * (isCoarse ? 0.4 : 0.7) * quality);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.0,
        z: 0.5 + Math.random() * 0.7,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const gradCache: { main: CanvasGradient | null; vignette: CanvasGradient | null } = { main: null, vignette: null };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
            dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      gradCache.main = null;
      gradCache.vignette = null;
    };

    let resizeTimeout: number | null = null;
    const onResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

  // We'll read scroll position in the frame loop to avoid quantization flicker

    const gradientMain = () => {
      if (gradCache.main) return gradCache.main;
      const g = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.7);
      g.addColorStop(0.0, "rgba(108,164,255,0.00)");
      g.addColorStop(0.42, "rgba(108,164,255,0.38)");
      g.addColorStop(0.7, "rgba(186,137,255,0.42)");
      g.addColorStop(0.95, "rgba(255,168,94,0.14)");
      g.addColorStop(1.0, "rgba(255,168,94,0.00)");
      gradCache.main = g;
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

    resize();

    // Pause rendering when tab is hidden
    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current == null && !prefersReduced) {
        lastFrameRef.current = 0;
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    function drawStars(t: number) {
      const step = Math.max(1, Math.floor(1 / quality));
      for (let i = 0; i < stars.length; i += step) {
        const s = stars[i];
        const f = 0.55 + 0.45 * Math.sin(s.p + t * 0.003);
        const y = s.y + scrollRef.current * 0.02 * (1 - s.z);
        ctx.fillStyle = `rgba(255,255,255,${0.58 * s.z * f})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
        s.x += 0.012 * s.z;
        if (s.x > w + 2) s.x = -2;
      }
    }

    const noise = (x: number, t: number) =>
      Math.sin(x * 0.002 + t * 0.00065) * 22 +
      Math.sin(x * 0.004 + t * 0.00042) * 12 +
      Math.sin(x * 0.008 + t * 0.00022) * 6;

    const ctrls = (t: number, shift = 0, amp = 1) => {
      const y0 = h * 0.3 + noise(0, t) * amp + shift;
      const y1 = h * 0.45 + noise(w * 0.33, t) * amp + shift;
      const y2 = h * 0.6 + noise(w * 0.66, t) * amp + shift;
      const y3 = h * 0.75 + noise(w, t) * amp + shift;
      return { y0, y1, y2, y3 };
    };

    let shimmerGrad: CanvasGradient | null = null;
    let shimmerUntil = -1;
    const gradientShimmer = (t: number) => {
      // Recreate shimmer gradient at most every ~32ms to prevent flicker
      if (shimmerGrad && t < shimmerUntil) return shimmerGrad;
      const sweep = (Math.sin(t * 0.00055) + 1) * 0.5;
      const g = ctx.createLinearGradient(0, h * (0.5 - 0.06 + sweep * 0.12), 0, h * (0.5 + 0.06 + sweep * 0.12));
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.08)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      shimmerGrad = g;
      shimmerUntil = t + 32; // cache for ~2 frames
      return g;
    };

    function striations(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number, widthBase: number) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const lines = Math.floor(18 * quality);
      for (let i = 0; i < lines; i++) {
        const k = i / (lines - 1);
        const r = Math.round(108 + (186 - 108) * k);
        const g = Math.round(164 + (137 - 164) * k);
        const b = 255;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0012 + i * 0.6);
        const alpha = 0.045 + 0.03 * pulse;
        const wob = (Math.sin(i * 0.5 + t * 0.003) + Math.sin(i * 0.8 + t * 0.002)) * 4;
        ctx.beginPath();
        ctx.moveTo(x0 - 140, y0 + wob);
        ctx.bezierCurveTo(x1, y1 + wob, x2, y2 - wob, x3 + 140, y3 + wob);
        ctx.filter = "blur(2px)";
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = widthBase * 0.018;
        ctx.stroke();
      }
      ctx.restore();
    }

  function drawAurora(t: number) {
      const parY = Math.min(90, scrollRef.current * 0.09);
      const boost = 1 + burstRef.current * 2.5;

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5 + parY);
      const s = 1 + burstRef.current * 0.12;
      ctx.scale(s, s);
      ctx.rotate(-0.34);
      ctx.translate(-w * 0.75, -h * 0.5);

  const lgx = -w * 0.4, lgy = h * 0.46;
      const lg = ctx.createRadialGradient(lgx, lgy, 0, lgx, lgy, Math.max(w, h) * 0.85);
      lg.addColorStop(0, `rgba(108,164,255,${0.4 * (1 + burstRef.current * 0.8)})`);
      lg.addColorStop(1, "rgba(108,164,255,0.00)");
      ctx.fillStyle = lg;
      ctx.fillRect(-w, -h, w * 2, h * 2);

  const X0 = -w * 0.28, X1 = w * 0.25, X2 = w * 0.6, X3 = w * 1.3;
  const m = ctrls(t, 0, 1);
  // Build path once and reuse across strokes
  const pathMain = new Path2D();
  pathMain.moveTo(X0, m.y0);
  pathMain.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      let WMAIN = Math.max(120, Math.min(185, w * 0.1));
      let WECHO = Math.max(90, Math.min(130, w * 0.072));
      WMAIN *= boost;
      WECHO *= boost;

      ctx.globalCompositeOperation = "screen";

  // Keep blur radii stable to avoid flicker when adaptive quality changes
  ctx.filter = `blur(${28 * boost}px) saturate(${140 + burstRef.current * 60}%)`;
  ctx.strokeStyle = gradientMain();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = WMAIN;
  ctx.stroke(pathMain);

  ctx.filter = `blur(${18 * boost}px) saturate(${150 + burstRef.current * 60}%)`;
      ctx.strokeStyle = gradientShimmer(t);
  ctx.lineWidth = WMAIN * 0.55;
  ctx.stroke(pathMain);

  const e = ctrls(t, 64, 0.9);
  const pathEcho = new Path2D();
  pathEcho.moveTo(X0, e.y0);
  pathEcho.bezierCurveTo(X1, e.y1, X2, e.y2, X3, e.y3);
  ctx.filter = `blur(${38 * boost}px) saturate(${140 + burstRef.current * 50}%)`;
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = gradientMain();
  ctx.lineWidth = WECHO;
  ctx.stroke(pathEcho);
      ctx.globalAlpha = 1;

      if (quality > 0.7) {
        striations(X0, m.y0, X1, m.y1, X2, m.y2, X3, m.y3, t, WMAIN);
      }
      ctx.restore();

      // Constellation lines (optimized)
  if (quality > 0.6) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
  ctx.filter = `blur(${1 + burstRef.current * 1.5}px)`;
        const maxDist = 110 + burstRef.current * 120;
        ctx.lineWidth = 0.6;
    const step = Math.max(1, Math.floor(2 / quality));
    let linesDrawn = 0;
    const maxLines = Math.floor(300 * quality);
    outer: for (let i = 0; i < stars.length; i += step * 2) {
          const a = stars[i];
          for (let j = i + 1; j < Math.min(i + 18, stars.length); j += step * 3) {
            const b = stars[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * 0.18 * (0.6 + 0.4 * burstRef.current);
              ctx.strokeStyle = `rgba(150,170,255,${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
      if (++linesDrawn >= maxLines) break outer;
            }
          }
        }
        ctx.restore();
      }

  ctx.filter = "none";
  ctx.fillStyle = gradientVignette();
  ctx.fillRect(0, 0, w, h);
    }

    function frame(t: number) {
      // Frame rate limiting
      if (t - lastFrameRef.current < 16.67) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      
      recordFrame();
  // Read scroll inline to avoid event batching artifacts
  scrollRef.current = window.scrollY || 0;
      
      ctx.filter = "none";
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      drawAurora(t);
      lastFrameRef.current = t;
      rafRef.current = requestAnimationFrame(frame);
    }

    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, w, h);
      drawStars(0);
      drawAurora(0);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [quality, recordFrame]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}));

/* =========================================================
   Layout helpers
   =======================================================*/
const Container = React.memo(function Container({
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
});

const Section = React.memo(function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-12 sm:py-16 md:py-20 ${className}`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
    >
      <Orbs />
      <Container>{children}</Container>
    </section>
  );
});

/* =========================================================
   Micro-interactions (optimized)
   =======================================================*/
function useSmoothScroll() {
  const ease = React.useCallback(
    (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    []
  );

  const reduced = React.useMemo(() =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

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
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    
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
    el.addEventListener("mouseleave", onLeave, { passive: true });
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  
  return ref;
}

function useTilt() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    
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
    el.addEventListener("mouseleave", reset, { passive: true });
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  
  return ref;
}

/* =========================================================
   Decorative Orbs (memoized)
   =======================================================*/
const Orbs = React.memo(function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl opacity-20"
        style={{
          left: "-4rem",
          top: "-2rem",
          background: "radial-gradient(circle,#6CA4FF55,transparent 60%)",
        }}
      />
      <div
        className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl opacity-20"
        style={{
          right: "-3rem",
          bottom: "-2rem",
          background: "radial-gradient(circle,#BA89FF55,transparent 60%)",
        }}
      />
    </div>
  );
});

/* =========================================================
   Back to top button (optimized)
   =======================================================*/
const BackToTop = React.memo(function BackToTop() {
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
      className="fixed bottom-6 right-6 z-30 rounded-full bg-white text-black shadow-lg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 w-12 h-12 grid place-items-center transform-gpu"
    >
      ↑
    </button>
  );
});

/* =========================================================
   Floating CTA Dock (memoized)
   =======================================================*/
const CTADock = React.memo(function CTADock({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <button
        onClick={onQuote}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black text-sm font-medium hover:opacity-90 transform-gpu"
      >
        <Mail className="w-3.5 h-3.5" /> Get a quote
      </button>
      <a
        href="tel:+21612345678"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm transform-gpu"
      >
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <a
        href="mailto:hello@starwaves.tn"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm transform-gpu"
      >
        <Send className="w-3.5 h-3.5" /> Email
      </a>
    </div>
  );
});

/* =========================================================
   Process Timeline (memoized)
   =======================================================*/
const StepCard = React.memo(function StepCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  return (
    <div className="relative group">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transform-gpu">
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
});

const ProcessSection = React.memo(function ProcessSection() {
  const steps = React.useMemo(() => [
    { title: "Discovery", desc: "Objectives, stakeholders, constraints, and KPIs." },
    { title: "Design", desc: "Experience mapping, scenography, media plan, and budgets." },
    { title: "Pre‑production", desc: "Vendors, CADs, run‑of‑show, logistics & risk playbooks." },
    { title: "Onsite ops", desc: "Hotel desk, stage & AV, transport, and branding install." },
    { title: "Wrap & report", desc: "Strike, reconciliation, and post‑event media delivery." },
  ], []);

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
});

/* =========================================================
   Testimonials (memoized)
   =======================================================*/
const TestimonialCard = React.memo(function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="relative group">
      <GradientRing />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transform-gpu">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(500px circle at 20% 0%, rgba(255,255,255,0.06), transparent 60%)" }} />
        <div className="relative">
          <div className="text-white/90 italic">"{quote}"</div>
          <div className="mt-4 text-sm text-white/70">{author} — {role}</div>
        </div>
      </div>
    </div>
  );
});

const Testimonials = React.memo(function Testimonials() {
  const items = React.useMemo(() => [
    { quote: "Flawless operations and a creative team we could trust.", author: "Chapter Chair", role: "Medical Society" },
    { quote: "From venues to media, everything was coordinated and clear.", author: "Program Director", role: "Gov Forum" },
    { quote: "Attendees loved the production value and pace.", author: "Event Manager", role: "Expo" },
  ], []);

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
});

/* =========================================================
   FAQ (Accordion) (memoized)
   =======================================================*/
const FAQItem = React.memo(function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 transform-gpu">
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
});

const FAQ = React.memo(function FAQ() {
  const faqs = React.useMemo(() => [
    { q: "How fast can you quote?", a: "Typically within 48 hours with at least one venue option and draft budget." },
    { q: "Do you work outside Tunisia?", a: "Yes, via partner networks; brokerage and media remain in-house." },
    { q: "Minimum event size?", a: "We tailor to scope; from 150 pax breakouts to 2,000+ plenaries." },
    { q: "Do you support hybrid/streaming?", a: "Yes — multi-cam, hybrid stages, and multilingual streaming." },
    { q: "Can you handle branding & expo booths?", a: "Full print ecosystem, wayfinding, lanyards, booths, and overnight installs." },
  ], []);

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
});

/* =========================================================
   Gradient Ring (hover) (memoized)
   =======================================================*/
const GradientRing = React.memo(function GradientRing() {
  return (
    <span
      data-test="grad-ring"
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      style={{
        background: "linear-gradient(90deg, #6CA4FF, #BA89FF, #FFA85E)",
        padding: "1px",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        borderRadius: "1rem",
      }}
    />
  );
});

/* =========================================================
   Nav (optimized)
   =======================================================*/
const Nav = React.memo(function Nav() {
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

  const link = React.useCallback((id: string) => (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOpen(false);
    scrollTo(id);
  }, [scrollTo]);

  const linkClass = React.useCallback((id: string) =>
    `hover:text-white relative transition-colors ${
      active === id
        ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70"
        : "text-white/80"
    }`, [active]);

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
            <a href="#services" onClick={link("services")} className={linkClass("services")}>
              Services
            </a>
            <a href="#partners" onClick={link("partners")} className={linkClass("partners")}>
              Partners
            </a>
            <a href="#work" onClick={link("work")} className={linkClass("work")}>
              Work
            </a>
            <a href="#about" onClick={link("about")} className={linkClass("about")}>
              About
            </a>
            <a href="#contact" onClick={link("contact")} className={linkClass("contact")}>
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
              <a href="#services" onClick={link("services")} className="hover:text-white transition-colors">
                Services
              </a>
              <a href="#partners" onClick={link("partners")} className="hover:text-white transition-colors">
                Partners
              </a>
              <a href="#work" onClick={link("work")} className="hover:text-white transition-colors">
                Work
              </a>
              <a href="#about" onClick={link("about")} className="hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" onClick={link("contact")} className="hover:text-white transition-colors">
                Contact
              </a>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
});

/* =========================================================
   Cards (memoized)
   =======================================================*/
const ServiceCard = React.memo(function ServiceCard({
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
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 md:p-8 backdrop-blur-sm transition-shadow hover:shadow-[0_0_40px_0_rgba(186,137,255,0.12)] transform-gpu">
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
});

const WorkCard = React.memo(function WorkCard({
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
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 sm:p-7 md:p-8 backdrop-blur-[2px] hover:from-white/10 transition-colors will-change-transform transform-gpu"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), rgba(186,137,255,0.06) 25%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]"
        />
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
});

/* =========================================================
   Reveal (optimized)
   =======================================================*/
const Reveal = React.memo(function Reveal({
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
    const current = ref.current;
    if (!current) return;
    
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    
    io.observe(current);
    return () => io.disconnect();
  }, []);
  
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 translate-y-6 scale-[.98] will-change-transform transition duration-700 ease-out transform-gpu ${
        inView ? "opacity-100 translate-y-0 scale-100" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
});

/* =========================================================
   Extras (optimized)
   =======================================================*/
const ScrollProgressBar = React.memo(function ScrollProgressBar({ show = true }: { show?: boolean }) {
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
        className="origin-left h-full bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] scale-x-0 transition-transform duration-75 transform-gpu"
      />
    </div>
  );
});

const CountUp = React.memo(function CountUp({ to, label }: { to: number; label: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [val, setVal] = React.useState(0);
  
  React.useEffect(() => {
    const current = ref.current;
    if (!current) return;
    
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
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
    
    obs.observe(current);
    return () => obs.disconnect();
  }, [to]);
  
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 px-4 sm:px-5 py-4 bg-white/5 backdrop-blur-sm text-center transform-gpu"
    >
      <div className="text-2xl sm:text-3xl font-semibold">
        {val.toLocaleString()}
      </div>
      <div className="text-white/70 text-xs sm:text-sm">{label}</div>
    </div>
  );
});

/* =========================================================
   Unlock FX (optimized)
   =======================================================*/
const UnlockFX = React.memo(function UnlockFX({ trigger }: { trigger: number }) {
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
  let w = (c.width = Math.floor(window.innerWidth * dpr));
  let h = (c.height = Math.floor(window.innerHeight * dpr));
  c.style.width = window.innerWidth + "px";
  c.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isFine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  const particles = Array.from({ length: isFine ? 60 : 40 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 18 + Math.random() * 22;
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0,
        max: 70 + Math.random() * 30,
        color: `rgba(${186 + Math.random()*40},${137 + Math.random()*40},255,1)`
      };
    });

  const sparkles = Array.from({ length: isFine ? 18 : 12 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 30 + Math.random() * 40;
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0,
        max: 40 + Math.random() * 20,
      };
    });

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      
      // Draw multi-layered aurora burst
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.18 - i * 0.05;
        ctx.filter = `blur(${60 - i * 20}px)`;
        ctx.beginPath();
        ctx.arc(w/2, h/2, 220 + i*80, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${108 + i*40},${164 + i*20},255,1)`;
        ctx.fill();
        ctx.restore();
      }
      
      // Draw glowing particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life++;
        const a = Math.max(0, 1 - p.life / p.max);
        ctx.save();
        ctx.globalAlpha = 0.7 * a;
        ctx.filter = "blur(6px)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + (1 - a) * 8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }
      
      // Draw sparkles
      for (const s of sparkles) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.93;
        s.vy *= 0.93;
        s.life++;
        const a = Math.max(0, 1 - s.life / s.max);
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
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.45), rgba(186,137,255,0.22) 30%, rgba(255,168,94,0.12) 50%, rgba(255,255,255,0) 80%)",
          animation: "flashFade 1400ms ease-out forwards",
        }}
      />
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
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${80 + Math.cos((i/12)*2*Math.PI)*70}px`,
              top: `${80 + Math.sin((i/12)*2*Math.PI)*70}px`,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #fff 60%, #BA89FF 100%)",
              boxShadow: "0 0 16px 8px #BA89FF88, 0 0 32px 16px #6CA4FF44",
              opacity: 0.7,
              pointerEvents: "none",
              animation: `sparkleFade 1800ms cubic-bezier(.4,.8,.3,1) ${i*120}ms forwards`,
            }}
          />
        ))}
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
});

/* =========================================================
   Contact Form (optimized)
   =======================================================*/
const ContactForm = React.memo(function ContactForm() {
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

  const validEmail = React.useCallback((v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v.trim()), []);
  const required = React.useCallback((v: string) => v.trim().length > 0, []);

  const formatTN = React.useCallback((v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    if (digits.startsWith("216")) {
      const rest = digits.slice(3);
      return "+216 " + rest.replace(/(\d{2})(\d{3})(\d{3})?/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
    }
    if (digits.startsWith("00216")) {
      const rest = digits.slice(5);
      return "+216 " + rest.replace(/(\d{2})(\d{3})(\d{3})?/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
    }
    if (v.startsWith("+")) return "+" + digits;
    return digits;
  }, []);

  const onField = React.useCallback(<K extends keyof FormState>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value ?? "";
      const v = k === "phone" ? formatTN(raw) : raw;
      setForm((s) => ({ ...s, [k]: v }));
    }, [formatTN]);

  const onBlur = React.useCallback(<K extends keyof FormState>(k: K) => () =>
    setTouched((t) => ({ ...t, [k]: true })), []);

  const errorFor = React.useCallback((k: keyof FormState): string | null => {
    if (k === "name" && touched.name && !required(form.name)) return "Name is required";
    if (k === "email" && touched.email && !validEmail(form.email)) return "Enter a valid email";
    if (k === "message" && touched.message && !required(form.message)) return "Tell us a few details";
    return null;
  }, [touched, form, required, validEmail]);

  const hasError = React.useCallback((k: keyof FormState) => Boolean(errorFor(k)), [errorFor]);
  const isOK = React.useCallback((k: keyof FormState) =>
    touched[k] && !hasError(k) && required((form[k] as string) ?? ""), [touched, hasError, required, form]);

  const leftChars = 1200 - form.message.length;
  const messageTooLong = form.message.length > 1200;

  const onSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((t) => ({ ...t, name: true, email: true, message: true }));
    if (form.honey) return;

    if (!required(form.name) || !validEmail(form.email) || !required(form.message) || messageTooLong) {
      setStatus("error");
      setGlobalMsg(messageTooLong ? "Your message is a bit long — please shorten it." : "Please fix the highlighted fields.");
      return;
    }

    setStatus("sending");
    setGlobalMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _timestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      setGlobalMsg("Thanks! We'll reply within 48h with a venue short-list & draft budget.");
    } catch {
      const subject = encodeURIComponent(`Event inquiry from ${form.name} — ${form.city || ""}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${form.city}\nDates: ${form.dates}\nHeadcount: ${form.headcount}\nRooms/night: ${form.rooms}\nBudget: ${form.budget}\nAV: ${form.av}\n\nMessage:\n${form.message}\n\nSent via starwaves.tn`);
      window.location.href = `mailto:hello@starwaves.tn?subject=${subject}&body=${body}`;
      setStatus("sent");
      setGlobalMsg("Thanks! Your email client should open with the details.");
    }
  }, [form, required, validEmail, messageTooLong]);

  const Field = React.memo(function Field({
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
  }) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="text-xs text-white/70">
            {label}{" "}
            {requiredField ? <span className="text-white/40">(required)</span> : null}
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
  });

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 md:p-8 text-left transform-gpu"
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
            <p className="text-white/80">{globalMsg || "We'll be in touch shortly."}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Name" name="name" requiredField ok={isOK("name")} error={errorFor("name")}>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={onField("name")}
            onBlur={onBlur("name")}
            placeholder="Your full name"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
            autoComplete="name"
          />
        </Field>

        <Field label="Email" name="email" requiredField ok={isOK("email") && validEmail(form.email)} error={errorFor("email")}>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onField("email")}
            onBlur={onBlur("email")}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
            inputMode="numeric"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="AV / Stage needs" name="av" hint="LED / projection / streaming / translation…">
            <input
              id="av"
              name="av"
              value={form.av}
              onChange={onField("av")}
              onBlur={onBlur("av")}
              placeholder="LED / projection / streaming / translation..."
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-colors"
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transform-gpu"
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
});

/* =========================================================
   Footer (memoized)
   =======================================================*/
const Footer = React.memo(function Footer() {
  const scrollTo = useSmoothScroll();
  const go = React.useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(id);
  }, [scrollTo]);

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
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors transform-gpu"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors transform-gpu"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors transform-gpu"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#home" onClick={go("home")} className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={go("about")} className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#work" onClick={go("work")} className="hover:text-white transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Hotel & Venue Brokerage
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Production & AV
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Print & Branding
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Transport & Logistics
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Media & Content
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white transition-colors">
                  Experience Design
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white transition-colors">
                  Get a quote
                </a>
              </li>
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white transition-colors">
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
});

/* =========================================================
   App
   =======================================================*/
const AnimatedHeadline = React.memo(function AnimatedHeadline() {
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
});

const TypeCycle = React.memo(function TypeCycle({
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
        t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), d(typingSpeed));
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
});

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

  const onQuote = React.useCallback(() => runUnlock("contact"), [runUnlock]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#06070B]">
      <AuroraBackground ref={auroraRef} />
      <ScrollProgressBar />
      <Nav />
      <CTADock onQuote={onQuote} />
      
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transform-gpu transition-opacity"
                >
                  Explore services <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  ref={mag2}
                  onClick={() => runUnlock("contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 transform-gpu transition-opacity"
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
                WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
                maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 transform-gpu">
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 transform-gpu">
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

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transform-gpu">
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