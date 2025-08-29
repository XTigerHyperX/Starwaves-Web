import React from "react";
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Play, Send } from "lucide-react";
import "./index.css";

// If you actually have a stylesheet, you can re-enable the line below.
// import "./index.css";

/**************************
 *  Aurora Canvas Background (JS version + strong burst API)
 **************************/
const AuroraBackground = React.forwardRef(function AuroraBackground(_, ref) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const scrollRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const burstRef = React.useRef(0); // 0..1 burst intensity

  React.useImperativeHandle(ref, () => ({
    burst: () => {
      // start at full intensity then decay to 0
      burstRef.current = 1;
      const start = performance.now();
      const dur = 1000;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        burstRef.current = 1 - p; // linear decay (snappy)
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
  }));

  React.useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let w = 0,
      h = 0,
      dpr = Math.min(2, window.devicePixelRatio || 1);

    let stars: { x: number; y: number; r: number; z: number; p: number }[] = [];

    const isCoarse = window.matchMedia && !window.matchMedia("(pointer: fine)").matches;

    const buildStars = () => {
      const base = Math.max(220, Math.floor((w * h) / 12000));
      const starCount = Math.floor(base * (isCoarse ? 0.65 : 1)); // fewer stars on mobile for perf
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
      dpr = Math.min(2, window.devicePixelRatio || 1);
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      gradCache.main = null;
      gradCache.vignette = null;
    };

    let resizeTicking = false;
    const onResize = () => {
      if (!resizeTicking) {
        resizeTicking = true;
        requestAnimationFrame(() => {
          resizeTicking = false;
          resize();
        });
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onScroll = () => (scrollRef.current = window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });

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

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resize();

    function drawStars(t: number) {
      for (const s of stars) {
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

    const gradientShimmer = (t: number) => {
      const sweep = (Math.sin(t * 0.00055) + 1) * 0.5;
      const g = ctx.createLinearGradient(0, h * (0.5 - 0.06 + sweep * 0.12), 0, h * (0.5 + 0.06 + sweep * 0.12));
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.08)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      return g;
    };

    function striations(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, t: number, widthBase: number) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const lines = 18;
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
      const boost = 1 + burstRef.current * 1.2; // stronger during burst

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5 + parY);
      const s = 1 + burstRef.current * 0.12; // noticeable scale
      ctx.scale(s, s);
      ctx.rotate(-0.34);
      ctx.translate(-w * 0.75, -h * 0.5);

      const lgx = -w * 0.4,
        lgy = h * 0.46;
      const lg = ctx.createRadialGradient(lgx, lgy, 0, lgx, lgy, Math.max(w, h) * 0.85);
      lg.addColorStop(0, `rgba(108,164,255,${0.4 * (1 + burstRef.current * 0.8)})`);
      lg.addColorStop(1, "rgba(108,164,255,0.00)");
      ctx.fillStyle = lg;
      ctx.fillRect(-w, -h, w * 2, h * 2);

      const m = ctrls(t, 0, 1);
      const X0 = -w * 0.28,
        X1 = w * 0.25,
        X2 = w * 0.6,
        X3 = w * 1.3;
      let WMAIN = Math.max(120, Math.min(185, w * 0.1));
      let WECHO = Math.max(90, Math.min(130, w * 0.072));
      WMAIN *= boost;
      WECHO *= boost;

      ctx.globalCompositeOperation = "screen";

      ctx.filter = `blur(${28 * boost}px) saturate(${140 + burstRef.current * 60}%)`;
      ctx.strokeStyle = gradientMain();
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN;
      ctx.stroke();

      ctx.filter = `blur(${18 * boost}px) saturate(${150 + burstRef.current * 60}%)`;
      ctx.strokeStyle = gradientShimmer(t);
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN * 0.55;
      ctx.stroke();

      const e = ctrls(t, 64, 0.9);
      ctx.filter = `blur(${38 * boost}px) saturate(${140 + burstRef.current * 50}%)`;
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = gradientMain();
      ctx.beginPath();
      ctx.moveTo(X0, e.y0);
      ctx.bezierCurveTo(X1, e.y1, X2, e.y2, X3, e.y3);
      ctx.lineWidth = WECHO;
      ctx.stroke();
      ctx.globalAlpha = 1;

      striations(X0, m.y0, X1, m.y1, X2, m.y2, X3, m.y3, t, WMAIN);
      ctx.restore();

      // constellation lines
      (function drawConstellations() {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.filter = `blur(${1 + burstRef.current * 1.5}px)`;
        const maxDist = 110 + burstRef.current * 120;
        ctx.lineWidth = 0.6;
        for (let i = 0; i < stars.length; i += 2) {
          const a = stars[i];
          for (let j = i + 1; j < Math.min(i + 18, stars.length); j += 3) {
            const b = stars[j];
            const dx = a.x - b.x,
              dy = a.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * 0.18 * (0.6 + 0.4 * burstRef.current);
              ctx.strokeStyle = `rgba(150,170,255,${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      })();

      ctx.filter = "none";
      ctx.fillStyle = gradientVignette();
      ctx.fillRect(0, 0, w, h);
    }

    function frame(t: number) {
      ctx.filter = "none";
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      drawAurora(t);
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
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
});

/**************************
 *  Small Layout Helpers (more mobile-friendly)
 **************************/
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>;
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative py-16 sm:py-20 md:py-28 ${className}`}>
      <Orbs />
      <Container>{children}</Container>
    </section>
  );
}

/**************************
 *  Micro-interactions
 **************************/
function useSmoothScroll() {
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  return (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = 56;
    const start = window.scrollY;
    const target = el.getBoundingClientRect().top + window.scrollY - header;
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
  };
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0]);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
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
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * 0.12}px, ${my * 0.12}px)`;
    };
    const onLeave = () => (el.style.transform = `translate(0,0)`);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return ref;
}

function useTilt() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    // Skip on touch / coarse pointers (mobile)
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      el.style.boxShadow = `0 20px 40px rgba(186,137,255,0.10)`;
      // glare cursor position
      const ox = e.clientX - r.left;
      const oy = e.clientY - r.top;
      el.style.setProperty("--mx", `${ox}px`);
      el.style.setProperty("--my", `${oy}px`);
    };
    const reset = () => {
      el.style.transform = "";
      el.style.boxShadow = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  return ref;
}

/**************************
 *  Decorative Orbs
 **************************/
function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl opacity-20"
        style={{ left: "-4rem", top: "-2rem", background: "radial-gradient(circle,#6CA4FF55,transparent 60%)" }}
      />
      <div
        className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl opacity-20"
        style={{ right: "-3rem", bottom: "-2rem", background: "radial-gradient(circle,#BA89FF55,transparent 60%)" }}
      />
    </div>
  );
}

/**************************
 *  Gradient Ring (hover)
 **************************/
function GradientRing() {
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
}

/**************************
 *  Components
 **************************/
function Nav() {
  const scrollTo = useSmoothScroll();
  const active = useActiveSection(["home", "services", "partners", "work", "about", "contact"]);
  const [open, setOpen] = React.useState(false);

  const link = (id: string) => (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOpen(false);
    scrollTo(id);
  };

  const linkClass = (id: string) =>
    `hover:text-white relative ${
      active === id ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : ""
    }`;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-20 backdrop-blur-sm border-b border-white/10">
        <Container className="flex items-center justify-between h-14">
          <a href="#home" onClick={link("home")} className="flex items-center gap-2">
            <img src="/logo.png" alt="Starwaves" className="block w-36 sm:w-40 md:w-44 h-auto" loading="eager" decoding="async" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
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

          {/* Mobile menu button */}
          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Menu</span>
            <span className="block w-5 h-0.5 bg-white/90" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
          </button>
        </Container>
      </header>

      {/* Mobile overlay menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-md">
          <Container className="pt-20">
            <div className="flex justify-between items-center mb-6">
              <img src="/logo.png" alt="Starwaves" className="w-36 h-auto" />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col text-lg space-y-4 text-white/90">
              <a href="#home" onClick={link("home")} className="hover:text-white">
                Home
              </a>
              <a href="#services" onClick={link("services")} className="hover:text-white">
                Services
              </a>
              <a href="#partners" onClick={link("partners")} className="hover:text-white">
                Partners
              </a>
              <a href="#work" onClick={link("work")} className="hover:text-white">
                Work
              </a>
              <a href="#about" onClick={link("about")} className="hover:text-white">
                About
              </a>
              <a href="#contact" onClick={link("contact")} className="hover:text-white">
                Contact
              </a>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}

function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative group" data-test="service-card">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 md:p-8 backdrop-blur-sm transition shadow-[inset_0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_40px_0_rgba(186,137,255,0.12)]">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="mt-2 text-sm md:text-base text-white/80">{desc}</p>
      </div>
    </div>
  );
}

function WorkCard({ title, role }: { title: string; role: string }) {
  const tiltRef = useTilt();
  return (
    <div className="relative group" data-test="work-card">
      <GradientRing />
      <div
        ref={tiltRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 sm:p-7 md:p-8 backdrop-blur-[2px] hover:from-white/10 transition will-change-transform"
      >
        {/* glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.08), rgba(186,137,255,0.06) 25%, transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(108,164,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(186,137,255,0.12),transparent_35%)]" />
        <div className="relative">
          <div className="text-sm text-white/70">{role}</div>
          <div className="text-xl sm:text-2xl font-semibold">{title}</div>
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
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
    if (ref.current) io.observe(ref.current);
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
  const longest = React.useMemo(() => phrases.reduce((m, p) => Math.max(m, p.length), 0), [phrases]);

  React.useEffect(() => {
    const current = phrases[i % phrases.length];
    const done = text === current;
    const empty = text.length === 0;
    let t: number | undefined;

    const d = (base: number) => base + Math.floor(Math.random() * jitter);

    if (!del) {
      if (!done) t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), d(typingSpeed));
      else t = window.setTimeout(() => setDel(true), pause);
    } else {
      if (!empty) t = window.setTimeout(() => setText(text.slice(0, -1)), d(deletingSpeed));
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
    <span className="inline-flex items-center align-middle" style={{ minWidth: `${Math.ceil(longest * 0.62)}ch` }}>
      <span>{text}</span>
      <span className="ml-1 w-[2px] h-[1em] bg-white/80 animate-pulse" />
    </span>
  );
}

function AnimatedHeadline() {
  const phrases = React.useMemo(() => ["we create worlds", "we shape experiences", "we stage congresses", "we craft stories"], []);
  return (
    <span className="bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] bg-clip-text text-transparent inline-block">
      <TypeCycle phrases={phrases} />
    </span>
  );
}

/**************************
 *  Extra Visuals (progress bar + counters + marquee)
 **************************/
function ScrollProgressBar({ show = true }: { show?: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!show) return;
    const el = ref.current!;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, max)));
      if (el) el.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show]);
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[30] h-[3px] bg-transparent">
      <div ref={ref} className="origin-left h-full bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] scale-x-0 transition-transform duration-75" />
    </div>
  );
}

function CountUp({ to, label }: { to: number; label: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const start = performance.now(),
          dur = 1200,
          from = 0;
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
    <div ref={ref} className="rounded-2xl border border-white/10 px-4 sm:px-5 py-4 bg-white/5 backdrop-blur-sm text-center">
      <div className="text-2xl sm:text-3xl font-semibold">{val.toLocaleString()}</div>
      <div className="text-white/70 text-xs sm:text-sm">{label}</div>
    </div>
  );
}

function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden relative">
      <div className="flex gap-10 animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
        {children}
        {children}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// SwapWords (TS-safe CSS var)
function SwapWords({ items }: { items: string[] }) {
  type CSSVars = React.CSSProperties & { ["--ty"]?: string };

  const [i, setI] = React.useState(0);
  const longest = React.useMemo(() => items.reduce((m, p) => Math.max(m, p.length), 0), [items]);

  React.useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 2200);
    return () => clearInterval(t);
  }, [items.length]);

  const innerStyle: CSSVars = { ["--ty"]: `-${i * 1.25}em` };

  return (
    <>
      <span className="ml-2 sm:ml-3 inline-grid h-[1.25em] overflow-hidden align-middle [perspective:800px]" style={{ minWidth: `${Math.ceil(longest * 0.55)}ch` }}>
        <span key={i} className="swap-inner will-change-transform animate-[swap-pop_600ms_cubic-bezier(.2,.8,.2,1)]" style={innerStyle}>
          {items.map((w, idx) => (
            <span key={w + idx} className="block h-[1.25em] bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] bg-clip-text text-transparent font-medium tracking-wide">
              {w}
            </span>
          ))}
        </span>
      </span>

      <style>{`
        .swap-inner { transform: translateY(var(--ty)); }
        @keyframes swap-pop {
          0%   { transform: translateY(var(--ty)) rotateX(18deg); opacity: .6; filter: blur(2px); }
          60%  { transform: translateY(var(--ty)) rotateX(0deg);  opacity: 1;  filter: blur(0);   }
          100% { transform: translateY(var(--ty)) rotateX(0deg); }
        }
      `}</style>
    </>
  );
}

/**************************
 *  Unlock FX (flash + ring + particles + streaks)
 **************************/
function UnlockFX({ trigger }: { trigger: number }) {
  const [active, setActive] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = window.innerWidth * 2);
    let h = (c.height = window.innerHeight * 2);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";

    const particles = Array.from({ length: 140 }, () => {
      const ang = Math.random() * Math.PI * 2;
      const spd = 6 + Math.random() * 16;
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0,
        max: 35 + Math.random() * 25,
      };
    });

    const streaks = Array.from({ length: 6 }, () => {
      const dir = Math.random() * Math.PI * 2;
      const speed = 24 + Math.random() * 18;
      return {
        sx: w / 2,
        sy: h / 2,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        life: 0,
        max: 40 + Math.random() * 20,
      };
    });

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      // particles
      for (const p of particles) {
        // @ts-ignore
        p.x += p.vx;
        // @ts-ignore
        p.y += p.vy;
        // @ts-ignore
        p.vx *= 0.96;
        // @ts-ignore
        p.vy *= 0.96;
        // @ts-ignore
        p.life++;
        // @ts-ignore
        const a = Math.max(0, 1 - p.life / p.max);
        ctx.beginPath();
        // @ts-ignore
        ctx.arc(p.x, p.y, 3 + (1 - a) * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,137,255,${0.8 * a})`;
        ctx.fill();
      }
      // streaks
      ctx.lineCap = "round";
      for (const s of streaks) {
        // @ts-ignore
        s.life++;
        // @ts-ignore
        const a = Math.max(0, 1 - s.life / s.max);
        // @ts-ignore
        const x = s.sx + s.vx * (s.life * 0.6);
        // @ts-ignore
        const y = s.sy + s.vy * (s.life * 0.6);
        ctx.strokeStyle = `rgba(255,255,255,${0.6 * a})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        // @ts-ignore
        ctx.lineTo(x - s.vx * 4, y - s.vy * 4);
        ctx.stroke();
        ctx.strokeStyle = `rgba(186,137,255,${0.45 * a})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        // @ts-ignore
        ctx.moveTo(x - s.vx * 1.5, y - s.vy * 1.5);
        // @ts-ignore
        ctx.lineTo(x - s.vx * 6, y - s.vy * 6);
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timeout = setTimeout(() => {
      cancelAnimationFrame(raf);
      setActive(false);
    }, 1100);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [trigger]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[35] pointer-events-none">
      {/* radial flash */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35), rgba(255,255,255,0.12) 30%, rgba(255,255,255,0) 60%)",
          animation: "flashFade 900ms ease-out forwards",
        }}
      />
      {/* expanding ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/60 rounded-full"
        style={{ width: 40, height: 40, animation: "ringExpand 900ms cubic-bezier(.2,.65,.25,1) forwards" }}
      />
      {/* particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      <style>{`
        @keyframes flashFade { from { opacity: 1; } to { opacity: 0; } }
        @keyframes ringExpand { from { transform: translate(-50%,-50%) scale(0.2); opacity: 1; } to { transform: translate(-50%,-50%) scale(12); opacity: 0; } }
      `}</style>
    </div>
  );
}

/**************************
 *  Contact Form (no-backend fallback via mailto)
 **************************/
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

  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  // SAFER onChange: copy the value immediately; never read from a possibly-null event later
  const onField =
    <K extends keyof FormState>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // copy the value synchronously
      const v =
        (e.currentTarget && (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value) ??
        ((e.target as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "");
      setForm((s) => ({ ...s, [k]: v }));
    };

  const validEmail = (v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honey) return; // bot trap
    if (!form.name || !validEmail(form.email) || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      throw new Error("bad status");
    } catch {
      const subject = encodeURIComponent(`Event inquiry from ${form.name} — ${form.city || ""}`);
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
    }
  };

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 md:p-8 text-left backdrop-heavy"
    >
      {/* honeypot */}
      <input
        type="text"
        name="company" // make bots more likely to fill this
        value={form.honey}
        onChange={onField("honey")}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
      />

      {status === "sent" && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/70 text-center p-8">
          <div>
            <div className="text-2xl font-semibold mb-2">Thank you!</div>
            <p className="text-white/80">We’ll reply within 48h with a venue short-list & draft budget.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/70">Name</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={onField("name")}
            placeholder="Your full name"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Email</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={onField("email")}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onField("phone")}
            placeholder="+216 ..."
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">City</label>
          <input
            name="city"
            value={form.city}
            onChange={onField("city")}
            placeholder="Tunis, Hammamet, Sousse..."
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Dates</label>
          <input
            name="dates"
            value={form.dates}
            onChange={onField("dates")}
            placeholder="e.g., 12–14 Oct 2025"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Headcount</label>
          <input
            name="headcount"
            value={form.headcount}
            onChange={onField("headcount")}
            placeholder="e.g., 400"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Rooms / night</label>
          <input
            name="rooms"
            value={form.rooms}
            onChange={onField("rooms")}
            placeholder="e.g., 120"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-xs text-white/70">Budget</label>
          <input
            name="budget"
            value={form.budget}
            onChange={onField("budget")}
            placeholder="e.g., 80,000 TND"
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
            inputMode="numeric"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/70">AV / Stage needs</label>
          <input
            name="av"
            value={form.av}
            onChange={onField("av")}
            placeholder="LED / projection / streaming / translation..."
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-white/70">Message</label>
          <textarea
            required
            name="message"
            value={form.message}
            onChange={onField("message")}
            rows={6}
            placeholder="Tell us about your congress..."
            className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 disabled:opacity-60"
        >
          <Send className="w-5 h-5" /> {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {status === "error" && <span className="text-sm text-rose-300">Fill name, valid email, and message.</span>}
      </div>
    </form>
  );
}


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
          {/* Brand + blurb */}
          <div>
            <img src="/logo.png" alt="Starwaves" className="w-36 sm:w-40 md:w-44 h-auto" />
            <p className="mt-4 text-white/70 text-sm">
              Discover cinematic congress operations across Tunisia. We orchestrate hotels, transport, AV, print, and media into one smooth system.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.facebook.com/Starwaves" target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#home" onClick={go("home")} className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={go("about")} className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#work" onClick={go("work")} className="hover:text-white">
                  Work
                </a>
              </li>
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Hotel & Venue Brokerage
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Production & AV
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Print & Branding
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Transport & Logistics
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Media & Content
                </a>
              </li>
              <li>
                <a href="#services" onClick={go("services")} className="hover:text-white">
                  Experience Design
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white">
                  Get a quote
                </a>
              </li>
              <li>
                <a href="#contact" onClick={go("contact")} className="hover:text-white">
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
          <div>© {new Date().getFullYear()} Starwaves Events & Congresses — SARL • Capital 5,000 TND</div>
          <div className="flex items-center gap-6">
            <a href="#home" onClick={go("home")} className="hover:text-white">
              Back to top
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}

/**************************
 *  App (unlocked by default; burst FX on CTA click)
 **************************/
export default function App() {
  const scrollTo = useSmoothScroll();
  const mag1 = useMagnetic();
  const mag2 = useMagnetic();
  const [unlocking, setUnlocking] = React.useState(false);
  const [fxKey, setFxKey] = React.useState(0);
  const auroraRef = React.useRef<{ burst: () => void } | null>(null);

  // Smoke tests
  React.useEffect(() => {
    console.assert(typeof auroraRef.current?.burst === "function", "AuroraBackground exposes burst()");
    console.assert(!!document.getElementById("home"), "#home section exists");
    const sc = document.querySelectorAll('[data-test="service-card"]').length;
    const wc = document.querySelectorAll('[data-test="work-card"]').length;
    const rings = document.querySelectorAll('[data-test="grad-ring"]').length;
    console.assert(sc === 6, `expected 6 service cards got ${sc}`);
    console.assert(wc === 3, `expected 3 work cards got ${wc}`);
    console.assert(rings === sc + wc, `expected ${sc + wc} gradient rings got ${rings}`);
    const form = document.getElementById("contact-form");
    console.assert(!!form, "contact form exists");
    const footerEl = document.getElementById("footer");
    console.assert(!!footerEl, "footer exists");
  }, []);

  const runUnlock = (targetId: string) => {
    if (unlocking) return;
    if (auroraRef.current && auroraRef.current.burst) auroraRef.current.burst();
    setFxKey((k) => k + 1); // trigger UnlockFX overlay
    setUnlocking(true);
    window.setTimeout(() => {
      setUnlocking(false);
      requestAnimationFrame(() => scrollTo(targetId));
    }, 900);
  };

  function LogoMarquee() {
    const logos = [
      { src: "/logos/ENIT SB.png", alt: "IEEE ENIT SB" },
      { src: "/logos/iip esprit.png", alt: "IEEE IIP ESPRIT" },
      { src: "/logos/ESPRIT SB.svg", alt: "IEEE ESPRIT SB" },
      { src: "/logos/sec.png", alt: "IEEE Tunisia Section" },
    ];

    const Row = ({ second = false }: { second?: boolean }) => (
      <div className={`marquee-track ${second ? "second" : ""} flex items-center gap-10 sm:gap-16 md:gap-24 shrink-0`}>
        {Array.from({ length: 2 }).map((_, i) =>
          logos.map((l, idx) => (
            <img
              key={`${i}-${idx}-${l.alt}`}
              src={l.src}
              alt={l.alt}
              className="h-10 sm:h-12 md:h-16 lg:h-20 object-contain opacity-90"
              loading="lazy"
              decoding="async"
            />
          ))
        )}
      </div>
    );

    return (
      <div
        className="relative overflow-hidden group"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="flex items-center">
          <Row />
          <Row second />
        </div>

        <style>{`
          @keyframes marqueeRowA { from { transform: translateX(0); } to { transform: translateX(-100%); } }
          @keyframes marqueeRowB { from { transform: translateX(100%); } to { transform: translateX(0%); } }
          .marquee-track { animation: marqueeRowA 45s linear infinite; }
          .marquee-track.second { animation: marqueeRowB 45s linear infinite; }
          .group:hover .marquee-track { animation-play-state: paused; }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen text-white overflow-x-hidden bg-[#06070B]`}>
      <AuroraBackground ref={auroraRef} />
      <ScrollProgressBar />
      <Nav />

      <main className="relative z-10">
        {/* HERO */}
        <section id="home" className="relative min-h-[calc(100vh-56px)] pt-14 md:pt-16 flex flex-col items-center justify-center text-center overflow-hidden">
          <Container>
            <Reveal>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.08] md:leading-[1.05] max-w-6xl mx-auto">
                We don’t organize events,
                <br className="hidden md:block" />
                <AnimatedHeadline />
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto">
                Event & Congress Management • Hotel Brokerage • Media & Experience Design
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  ref={mag1}
                  onClick={() => runUnlock("contact")}
                  className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-2xl text-sm md:text-base bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 will-change-transform ${
                    unlocking ? "animate-pulse" : "hover:opacity-90"
                  }`}
                >
                  Plan your event <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  ref={mag2}
                  onClick={() => runUnlock("work")}
                  className={`inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-2xl text-sm md:text-base bg-white/5 border border-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 will-change-transform ${
                    unlocking ? "animate-pulse" : "hover:bg-white/10"
                  }`}
                >
                  See our work <Play className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </Reveal>
            <button onClick={() => runUnlock("services")} className="mt-12 sm:mt-16 inline-flex flex-col items-center text-white/60 text-xs tracking-wider hover:text-white/80 transition">
              SCROLL
              <span className="block w-px h-8 mt-2 bg-white/30" />
            </button>
          </Container>
        </section>

        {/* CONTENT (always visible; no lock) */}
        <div>
          {/* SERVICES */}
          <Section id="services" className="pt-12 sm:pt-20">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-8 sm:mb-10">
                Services <SwapWords items={["Hotel • AV • Media", "Print • Wayfinding", "Transport • Logistics"]} />
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
              <Reveal>
                <ServiceCard title="Hotel & Venue Brokerage" desc="Spaces that inspire. We secure the right venues for unforgettable congresses." />
              </Reveal>
              <Reveal delay={120}>
                <ServiceCard title="Production & AV" desc="Stage, lighting, LED, sound engineering and show direction with cinematic precision." />
              </Reveal>
              <Reveal delay={240}>
                <ServiceCard title="Print & Branding" desc="Immersive signage, wayfinding, and premium event collateral." />
              </Reveal>
              <Reveal>
                <ServiceCard title="Transport & Logistics" desc="Seamless delegate journeys — timed, tracked, and stress-free." />
              </Reveal>
              <Reveal delay={120}>
                <ServiceCard title="Media & Content" desc="Cinematic photography, video, live streaming, editors and post." />
              </Reveal>
              <Reveal delay={240}>
                <ServiceCard title="Experience Design" desc="Concepts, scenography and storytelling for every journey." />
              </Reveal>
            </div>
          </Section>

          {/* PARTNERS / MARQUEE */}
          <Section id="partners" className="py-12 sm:py-16">
            <h3 className="text-center text-white/80 mb-6">Trusted by teams at</h3>
            <Container>
              <LogoMarquee />
            </Container>
          </Section>

          {/* WORK */}
          <Section id="work" className="pt-4">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-8 sm:mb-10">Our Worlds</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
              <Reveal>
                <WorkCard title="CSTAM Congress 2024" role="Media & Branding" />
              </Reveal>
              <Reveal delay={150}>
                <WorkCard title="IASTAM 5.0 2025" role="Full Event Management" />
              </Reveal>
              <Reveal delay={300}>
                <WorkCard title="WIE ACT 4.0 2025" role="Hotel & AV Coordination" />
              </Reveal>
            </div>
          </Section>

          {/* ABOUT + STATS */}
          <Section id="about">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-start">
              <Reveal>
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-4">Cinematic Minds, Tunisian Roots</h2>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg">
                    We’re a creative operations team turning congresses into cinematic worlds. From hotel blocks and transport to AV, print, and media — everything flows in one orchestrated system.
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
                    <CountUp to={300} label="Participants served" />
                    <CountUp to={12} label="Major congresses" />
                    <CountUp to={45} label="Hotel partners" />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <div className="rounded-2xl border border-white/10 p-6 sm:p-7 md:p-8 bg-white/5 backdrop-blur-sm">
                  <ul className="space-y-3 text-white/80 text-sm md:text-base">
                    <li>
                      <span className="text-white">2025</span> — IASTAM 5.0 • Full Event Ops
                    </li>
                    <li>
                      <span className="text-white">2024</span> — WIE ACT 4.0 • Hotel & AV
                    </li>
                    <li>
                      <span className="text-white">2024</span> — CSTAM • Media & Branding
                    </li>
                    <li>
                      <span className="text-white">2023</span> — IEEE IES SYP • Experience Design
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </Section>

          {/* CONTACT */}
          <Section id="contact" className="text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-4">Get in Touch</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-white/80 mb-8 text-sm sm:text-base md:text-lg">Tell us about your congress and we’ll come back with a tailored plan.</p>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start text-left">
              {/* Info card */}
              <Reveal delay={150}>
                <div className="rounded-2xl border border-white/10 p-6 sm:p-7 md:p-8 bg-white/5 backdrop-blur-sm">
                  <div className="flex flex-col gap-3 text-white/80 text-sm md:text-base">
                    <a href="mailto:hello@starwaves.tn" className="inline-flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#BA89FF]" aria-hidden="true" />
                      hello@starwaves.tn
                    </a>
                    <div className="inline-flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#BA89FF]" aria-hidden="true" />
                      <span>+216 ••• ••• •••</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#BA89FF]" aria-hidden="true" />
                      <span>Ben Arous, Tunisia</span>
                    </div>

                    <div className="pt-3 text-white/70 text-sm">
                      <div className="font-medium text-white">To speed things up, include:</div>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Dates & city</li>
                        <li>Headcount (tracks/plenary)</li>
                        <li>Hotel rooms per night</li>
                        <li>AV needs (LED / projection / streaming)</li>
                        <li>Budget range</li>
                      </ul>
                    </div>

                    <a
                      href="https://www.facebook.com/Starwaves"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition w-max"
                    >
                      <Facebook className="w-5 h-5" aria-hidden="true" />
                      Follow us
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Form */}
              <Reveal delay={240}>
                <ContactForm />
              </Reveal>
            </div>
          </Section>

          <Footer />
        </div>

        {/* Unlock effects layer */}
        <UnlockFX trigger={fxKey} />
      </main>
    </div>
  );
}
