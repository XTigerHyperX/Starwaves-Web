import React from "react";
import { Section, Container } from "../components/layout/Layout";
import { Reveal } from "../components/common/Reveal";
import { BadgeCheck, ArrowRight, Mail, Building2, MonitorSpeaker, Printer, Bus, Video, Palette } from "lucide-react";
import { NEXT_EVENT, UPCOMING_EVENTS, PARTNER_LOGOS, WORKS } from "../content";
import { ServiceCard } from "../components/ServiceCard";
import { WorkCard } from "../components/WorkCard";
import { ProcessSection } from "../components/process/ProcessSection";
import { ContactForm } from "../components/forms/ContactForm";
import { Eyebrow } from "../components/common/Eyebrow";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

// Minimal copies of small helpers from App
function useMagnetic() {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const el = ref.current; if (!el || (window.matchMedia && !window.matchMedia("(pointer: fine)").matches)) return;
    let rafId: number | null = null;
    const onMove = (e: MouseEvent) => { if (rafId) return; rafId = requestAnimationFrame(() => { const r = el.getBoundingClientRect(); const mx = e.clientX - (r.left + r.width / 2); const my = e.clientY - (r.top + r.height / 2); el.style.transform = `translate(${mx * 0.12}px, ${my * 0.12}px)`; rafId = null; }); };
    const onLeave = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } el.style.transform = `translate(0,0)`; };
    el.addEventListener("mousemove", onMove, { passive: true }); el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); if (rafId) cancelAnimationFrame(rafId); };
  }, []);
  return ref;
}

function useCountdown(targetISO: string) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const target = React.useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}

function GradientNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const text = String(value).padStart(pad, "0");
  const id = React.useId().replace(/:/g, "");
  const width = text.length >= 3 ? 280 : 200;
  const height = 120;
  const cls = text.length >= 3 ? "gradient-number-3" : "gradient-number-2";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className={`block ${cls}`}>
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
      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fill="none" stroke={`url(#g${id})`} strokeWidth={6} filter={`url(#f${id})`} className="gradient-number-text">{text}</text>
      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" fill="none" stroke={`url(#g${id})`} strokeWidth={2.2} className="gradient-number-text">{text}</text>
    </svg>
  );
}

function CountdownStat({ value, label }: { value: number; label: string }) {
  const v = label === "Days" ? String(value) : String(value).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="absolute inset-0 -z-10 countdown-tile-glow" aria-hidden />
      <div className="leading-none">
        <GradientNumber value={value} pad={label === "Days" ? 1 : 2} />
      </div>
      <div className="mt-1 text-base sm:text-lg md:text-xl font-medium text-white/80">{label}</div>
      <span className="sr-only">{v} {label}</span>
    </div>
  );
}

function CountUp({ to, label }: { to: number; label: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [val, setVal] = React.useState(0);
  const hasAnimated = React.useRef(false);
  React.useEffect(() => {
    if (hasAnimated.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || hasAnimated.current) return; hasAnimated.current = true; obs.disconnect();
      const start = performance.now(); const dur = 1200; const from = 0;
      const tick = (t: number) => { const p = Math.min(1, (t - start) / dur); setVal(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [to]);
  return (
    <div ref={ref} className="rounded-2xl border border-white/10 px-4 sm:px-5 py-4 bg-white/5 backdrop-blur-sm text-center">
      <div className="text-2xl sm:text-3xl font-semibold">{val.toLocaleString()}</div>
      <div className="text-white/70 text-xs sm:text-sm">{label}</div>
    </div>
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

function TypeCycle({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 45,
  pause = 1400,
  jitter = 12,
}: { phrases: string[]; typingSpeed?: number; deletingSpeed?: number; pause?: number; jitter?: number }) {
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
      else { setDel(false); setI((v) => (v + 1) % phrases.length); }
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

export default function HomePage() {
  const scrollTo = useSmoothScroll();
  const mag1 = useMagnetic();
  const mag2 = useMagnetic();
  const { days, hours, minutes, seconds, diff } = useCountdown(NEXT_EVENT.dateISO);
  const dateObj = React.useMemo(() => new Date(NEXT_EVENT.dateISO), []);
  const dateLabel = React.useMemo(() => dateObj.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }), [dateObj]);

  return (
    <>
      {/* HERO */}
      <section id="home" className="relative min-h-[calc(100vh-56px)] pt-14 md:pt-16 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-x-0 top-14 z-[-1] h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
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
            <p className="mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto">Congress operations, hotel brokerage, AV production, transport, print, and media — under one roof.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                ref={mag1}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode: 'scroll', id: 'services' } }));
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition-all will-change-transform"
              >
                Explore services <ArrowRight className="w-4 h-4" />
              </button>
              <button
                ref={mag2}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode: 'scroll', id: 'contact' } }));
                }}
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
      <Section id="countdown" className="pt-4">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2"><Eyebrow>Next up</Eyebrow></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">{NEXT_EVENT.title}</h2>
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-black font-semibold">Live now</span>
              ) : (
                <button onClick={() => scrollTo("agenda")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90">View agenda <ArrowRight className="w-4 h-4" /></button>
              )}
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
                const dateText = d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "2-digit" });
                const timeText = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={`${ev.title}-${ev.dateISO}`} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="text-sm text-white/70">{ev.location}</div>
                    <div className="text-lg sm:text-xl font-semibold mt-1">{ev.title}</div>
                    <div className="mt-3 flex items-center gap-3 text-white/80">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-black/30 border border-white/10 text-xs">{dateText}</span>
                      <span className="text-white/60">{timeText}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Reveal>
      </Section>

      {/* SERVICES (teaser same as home) */}
      <Section id="services">
        <Reveal>
          <div className="flex items-center justify-between gap-6">
            <div>
              <Eyebrow>What we do</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Services</h2>
            </div>
            <div className="text-white/70 text-sm">End-to-end, modular, and accountable.</div>
          </div>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <ServiceCard Icon={Building2} title="Hotel & Venue Brokerage" desc="Lock the right rooms and space at the right rates — contracting, allotments, attrition, and an onsite desk." points={["Citywide & resort destinations","Allotment & attrition strategy","Onsite front-desk integration"]} />
          <ServiceCard Icon={MonitorSpeaker} title="Production & AV" desc="Cinematic stages and crystal speech — LED, projection mapping, audio, lighting, and translation." points={["Stage design & CADs","LED / projection mapping","Hybrid & livestream"]} />
          <ServiceCard Icon={Printer} title="Print & Branding" desc="Wayfinding that guides and branding that pops — badges, backdrops, lanyards, and booths." points={["Large-format & eco inks","Brand guardianship","Onsite make-good team"]} />
          <ServiceCard Icon={Bus} title="Transport & Logistics" desc="Arrivals that feel effortless — fleet planning, manifests, dispatch, and last-mile ops." points={["Airport & VIP protocols","Shuttle routing & stewards","Risk & contingency playbooks"]} />
          <ServiceCard Icon={Video} title="Media & Content" desc="Stories people share — openers, recaps, speaker support, photography, and social clips." points={["Editorial boards","Motion graphics","Same-day edits"]} />
          <ServiceCard Icon={Palette} title="Experience Design" desc="Journeys that flow — mapping, scenography, and meaningful touchpoints." points={["Flows & service design","Installations & micro-wow","Inclusive & accessible"]} />
        </div>
      </Section>

      {/* PARTNERS */}
      <Section id="partners" className="pt-4">
        <Reveal>
          <div className="mb-6">
            <Eyebrow>Who we serve</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Trusted by chapters & institutions</h2>
          </div>
          <div className="relative overflow-hidden group partners-mask">
            <div data-marq className="flex gap-16 items-center animate-[marq_35s_linear_infinite] group-hover:[animation-play-state:paused]">
              {PARTNER_LOGOS.concat(PARTNER_LOGOS).map((p, i) => (
                <img key={i} src={p.src} alt={p.alt} className="h-12 sm:h-14 md:h-16 object-contain opacity-90" loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* WORK */}
      <Section id="work">
        <Reveal>
          <div className="flex items-center justify-between gap-6">
            <div>
              <Eyebrow>Case studies</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Our Worlds</h2>
            </div>
            <div className="text-white/70 text-sm">Highlights from conferences & festivals.</div>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Let's plan your next congress</h2>
              <p className="text-white/80">Tell us dates, city, headcount, and anything special. We'll reply with a venue short-list and draft budget.</p>
            </div>
            <div className="lg:col-span-2"><ContactForm /></div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
