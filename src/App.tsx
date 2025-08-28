import React from "react";
import { ArrowRight, Facebook, Mail, Phone, MapPin, Play } from "lucide-react";
import "./index.css";

function AuroraBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const scrollRef = React.useRef(0);

  React.useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let w = 0,
      h = 0,
      dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    const onScroll = () => (scrollRef.current = window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });

    const starCount = Math.max(220, Math.floor((w * h) / 12000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.0,
      z: 0.5 + Math.random() * 0.7,
      p: Math.random() * Math.PI * 2,
    }));

    function drawStars(t: number) {
      for (const s of stars) {
        const f = 0.55 + 0.45 * Math.sin(s.p + t * 0.003);
        ctx.fillStyle = `rgba(255,255,255,${0.58 * s.z * f})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
        s.x += 0.012 * s.z;
        if (s.x > w) s.x = -2;
      }
    }

    function noise(x: number, t: number) {
      return (
        Math.sin(x * 0.002 + t * 0.00065) * 22 +
        Math.sin(x * 0.004 + t * 0.00042) * 12 +
        Math.sin(x * 0.008 + t * 0.00022) * 6
      );
    }

    function ctrls(t: number, shift = 0, amp = 1) {
      const y0 = h * 0.30 + noise(0, t) * amp + shift;
      const y1 = h * 0.45 + noise(w * 0.33, t) * amp + shift;
      const y2 = h * 0.60 + noise(w * 0.66, t) * amp + shift;
      const y3 = h * 0.75 + noise(w, t) * amp + shift;
      return { y0, y1, y2, y3 };
    }

    function gradientMain() {
      const g = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.7);
      g.addColorStop(0.00, "rgba(108,164,255,0.00)");
      g.addColorStop(0.42, "rgba(108,164,255,0.38)");
      g.addColorStop(0.70, "rgba(186,137,255,0.42)");
      g.addColorStop(0.95, "rgba(255,168,94,0.14)");
      g.addColorStop(1.00, "rgba(255,168,94,0.00)");
      return g;
    }

    function gradientShimmer(t: number) {
      const sweep = (Math.sin(t * 0.00055) + 1) * 0.5;
      const g = ctx.createLinearGradient(
        0,
        h * (0.50 - 0.06 + sweep * 0.12),
        0,
        h * (0.50 + 0.06 + sweep * 0.12)
      );
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.5, "rgba(255,255,255,0.08)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      return g;
    }

    function striations(
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      t: number,
      widthBase: number
    ) {
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

      ctx.save();
      ctx.translate(w * 0.5, h * 0.5 + parY);
      ctx.rotate(-0.34);
      ctx.translate(-w * 0.75, -h * 0.5);

      const lgx = -w * 0.4,
        lgy = h * 0.46;
      const lg = ctx.createRadialGradient(lgx, lgy, 0, lgx, lgy, Math.max(w, h) * 0.85);
      lg.addColorStop(0, "rgba(108,164,255,0.28)");
      lg.addColorStop(1, "rgba(108,164,255,0.00)");
      ctx.fillStyle = lg;
      ctx.fillRect(-w, -h, w * 2, h * 2);

      const m = ctrls(t, 0, 1);
      const X0 = -w * 0.28,
        X1 = w * 0.25,
        X2 = w * 0.60,
        X3 = w * 1.30;
      const WMAIN = Math.max(120, Math.min(185, w * 0.10));
      const WECHO = Math.max(90, Math.min(130, w * 0.072));

      ctx.globalCompositeOperation = "screen";

      ctx.filter = "blur(24px) saturate(125%)";
      ctx.strokeStyle = gradientMain();
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN;
      ctx.stroke();

      ctx.filter = "blur(14px) saturate(130%)";
      ctx.strokeStyle = gradientShimmer(performance.now());
      ctx.beginPath();
      ctx.moveTo(X0, m.y0);
      ctx.bezierCurveTo(X1, m.y1, X2, m.y2, X3, m.y3);
      ctx.lineWidth = WMAIN * 0.55;
      ctx.stroke();

      const e = ctrls(t, 64, 0.9);
      ctx.filter = "blur(30px) saturate(115%)";
      ctx.strokeStyle = gradientMain();
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(X0, e.y0);
      ctx.bezierCurveTo(X1, e.y1, X2, e.y2, X3, e.y3);
      ctx.lineWidth = WECHO;
      ctx.stroke();
      ctx.globalAlpha = 1;

      striations(X0, m.y0, X1, m.y1, X2, m.y2, X3, m.y3, t, WMAIN);

      ctx.restore();

      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.55, Math.max(w, h) * 0.9);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.9)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

    function loop(t: number) {
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      drawAurora(t);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>;
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-20 backdrop-blur-sm border-b border-white/10">
      <Container className="flex items-center justify-between h-14">
        <a href="#home" className="flex items-center gap-2">
          <div className="h-6 w-48 rounded-full bg-white/10 text-[10px] tracking-widest uppercase grid place-items-center text-white/60">Starwaves (placeholder)</div>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="#home" className="hover:text-white">Home</a>
          <a href="#services" className="hover:text-white">Services</a>
          <a href="#work" className="hover:text-white">Work</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
      </Container>
    </header>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5/0 hover:bg-white/5 p-7 md:p-8 backdrop-blur-sm transition shadow-[inset_0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_40px_0_rgba(186,137,255,0.12)]">
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm md:text-base text-white/80">{desc}</p>
    </div>
  );
}

function WorkCard({ title, role }: { title: string; role: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-7 md:p-8 backdrop-blur-[2px] hover:from-white/10 transition">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(108,164,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(186,137,255,0.12),transparent_35%)]" />
      <div className="relative">
        <div className="text-sm text-white/70">{role}</div>
        <div className="text-2xl font-semibold">{title}</div>
      </div>
    </div>
  );
}

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

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
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
    return () => { if (t) clearTimeout(t); };
  }, [text, del, i, phrases, typingSpeed, deletingSpeed, pause, jitter]);

  return (
    <span className="inline-flex items-center align-middle" style={{ minWidth: `${Math.ceil(longest * 0.62)}ch` }}>
      <span>{text}</span>
      <span className="ml-1 w-[2px] h-[1em] bg-white/80 animate-pulse" />
    </span>
  );
}

function AnimatedHeadline() {
  const phrases = React.useMemo(() => [
    "we create worlds",
    "we shape experiences",
    "we stage congresses",
    "we craft stories",
  ], []);
  return (
    <span className="bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] bg-clip-text text-transparent inline-block">
      <TypeCycle phrases={phrases} />
    </span>
  );
}

export default function App() {
  const scrollTo = useSmoothScroll();
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#06070B]">
      <AuroraBackground />
      <Nav />

      <main className="relative z-10">
        <section
          id="home"
          className="relative min-h-[calc(100vh-56px)] pt-14 md:pt-16 flex flex-col items-center justify-center text-center overflow-hidden"
        >
          <Container>
            <Reveal>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] max-w-6xl mx-auto">
                We don’t organize events,
                
                <AnimatedHeadline />
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-3xl mx-auto">
                Event & Congress Management • Hotel Brokerage • Media & Experience Design
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex justify-center gap-4">
                <button onClick={() => scrollTo("contact")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm md:text-base bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 transition">
                  Plan your event <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => scrollTo("work")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm md:text-base bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  See our work <Play className="w-5 h-5" />
                </button>
              </div>
            </Reveal>
            <button onClick={() => scrollTo("services")} className="mt-16 inline-flex flex-col items-center text-white/60 text-xs tracking-wider hover:text-white/80 transition">
              SCROLL
              <span className="block w-px h-8 mt-2 bg-white/30" />
            </button>
          </Container>
        </section>

        <Section id="services" className="pt-20">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-semibold mb-10">Services</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-7">
            <Reveal><ServiceCard title="Hotel & Venue Brokerage" desc="Spaces that inspire. We secure the right venues for unforgettable congresses." /></Reveal>
            <Reveal delay={120}><ServiceCard title="Production & AV" desc="Stage, lighting, LED, sound engineering and show direction with cinematic precision." /></Reveal>
            <Reveal delay={240}><ServiceCard title="Print & Branding" desc="Immersive signage, wayfinding, and premium event collateral." /></Reveal>
            <Reveal><ServiceCard title="Transport & Logistics" desc="Seamless delegate journeys — timed, tracked, and stress‑free." /></Reveal>
            <Reveal delay={120}><ServiceCard title="Media & Content" desc="Cinematic photography, video, live streaming, editors and post." /></Reveal>
            <Reveal delay={240}><ServiceCard title="Experience Design" desc="Concepts, scenography and storytelling for every journey." /></Reveal>
          </div>
        </Section>

        <Section id="work" className="pt-4">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-semibold mb-10">Our Worlds</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-7">
            <Reveal><WorkCard title="CSTAM Congress 2024" role="Media & Branding" /></Reveal>
            <Reveal delay={150}><WorkCard title="IASTAM 5.0 2025" role="Full Event Management" /></Reveal>
            <Reveal delay={300}><WorkCard title="WIE ACT 4.0 2025" role="Hotel & AV Coordination" /></Reveal>
          </div>
        </Section>

        <Section id="about">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Reveal>
              <div>
                <h2 className="text-4xl md:text-6xl font-semibold mb-4">Cinematic Minds, Tunisian Roots</h2>
                <p className="text-white/80 text-base md:text-lg">
                  We’re a creative operations team turning congresses into cinematic worlds. From hotel blocks and transport to AV, print, and media — everything flows in one orchestrated system.
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="rounded-2xl border border-white/10 p-7 md:p-8 bg-white/5/0 backdrop-blur-sm">
                <ul className="space-y-3 text-white/80 text-sm md:text-base">
                  <li><span className="text-white">2025</span> — IASTAM 5.0 • Full Event Ops</li>
                  <li><span className="text-white">2024</span> — WIE ACT 4.0 • Hotel & AV</li>
                  <li><span className="text-white">2024</span> — CSTAM • Media & Branding</li>
                  <li><span className="text-white">2023</span> — IEEE IES SYP • Experience Design</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>

        <Section id="contact" className="text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-semibold mb-4">Get in Touch</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-white/80 mb-8 text-base md:text-lg">Tell us about your congress and we’ll come back with a tailored plan.</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-col items-center gap-3 text-white/85 text-sm md:text-base">
              <a href="mailto:hello@starwaves.tn" className="inline-flex items-center gap-2"><Mail className="w-5 h-5 text-[#BA89FF]"/>hello@starwaves.tn</a>
              <div className="inline-flex items-center gap-2"><Phone className="w-5 h-5 text-[#BA89FF]"/><span>+216 ••• ••• •••</span></div>
              <div className="inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-[#BA89FF]"/><span>Ben Arous, Tunisia</span></div>
              <a href="https://www.facebook.com/Starwaves" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"><Facebook className="w-5 h-5"/>Follow us</a>
            </div>
          </Reveal>
        </Section>

        <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-white/70">
          © {new Date().getFullYear()} Starwaves Events & Congresses — SARL • Capital 5,000 TND
        </footer>
      </main>
    </div>
  );
}
