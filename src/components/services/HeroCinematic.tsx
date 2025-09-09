import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Section } from "../layout/Layout"; // we will still use Section for outer vertical context
import { PARTNER_LOGOS } from "../../content";
import { track } from "../../lib/analytics";
import { ArrowRight } from "lucide-react";

export const GradientDivider = () => (
  <div className="relative h-px w-full" aria-hidden="true">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,#6EA8FF_0%,#9B8CFF_55%,#FFB37A_100%)] opacity-60" />
    <div className="absolute inset-0 blur-[2px] bg-[linear-gradient(90deg,#6EA8FF_0%,#9B8CFF_55%,#FFB37A_100%)] opacity-30" />
  </div>
);

export const FloatingRibbon = () => (
  <svg className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-8 w-[1200px] h-[80px]" viewBox="0 0 1200 80" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="g" x1="0" x2="1200" y1="0" y2="0">
        <stop stopColor="#6EA8FF"/><stop offset=".55" stopColor="#9B8CFF"/><stop offset="1" stopColor="#FFB37A"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <path stroke="url(#g)" strokeWidth="2" filter="url(#soft)" opacity=".35">
      <animate attributeName="d" dur="22s" repeatCount="indefinite" values="
        M 0 40 C 250 10, 450 70, 600 40 S 950 10, 1200 40;
        M 0 40 C 250 60, 450 20, 600 40 S 950 60, 1200 40;
        M 0 40 C 250 10, 450 70, 600 40 S 950 10, 1200 40" />
    </path>
  </svg>
);

export const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[...Array(12)].map((_,i)=>(
      <span key={i}
        className="absolute rounded-full blur-[2px] opacity-30 animate-[drift_18s_linear_infinite]"
        style={{
          left: `${(i*83)%100}%`,
          top: `${(i*47)%100}%`,
          width: `${6 + (i%4)*2}px`,
          height: `${6 + (i%4)*2}px`,
          background: 'linear-gradient(90deg,#6EA8FF,#9B8CFF,#FFB37A)'
        }}
      />
    ))}
    <style>{`@keyframes drift {0%{transform:translateY(0)}50%{transform:translateY(-12px)}100%{transform:translateY(0)}}
      @media (prefers-reduced-motion: reduce){ .animate-[drift_18s_linear_infinite]{animation:none!important} svg animate{display:none}}
    `}</style>
  </div>
);

function HeadlineWord() {
  const words = ["inevitable", "unforgettable", "seamless"] as const;
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % words.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-block relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="sw-gradient-text sw-shimmer"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function HeroCinematic() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <Section id="overview" className="!pb-0 relative overflow-visible">
        {/* Unified container for hero + USP + logos spacing rhythm */}
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-8">
          <ParticleField />
          {/* Hero header */}
          <header className="text-center pt-16 md:pt-20">
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease }}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                We create full‑stack event experiences that feel {" "}
                <HeadlineWord />.
              </h1>
              <p className="mt-4 text-white/80 max-w-2xl mx-auto">
                Full‑stack event ops: brokerage, AV, print, logistics, media, and experience—calm, on‑time, unforgettable.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => { track('service_quote_click' as any); window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode:'nav', path:'/contact' } })); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sw-cta sw-ripple font-semibold hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(80,120,255,0.25)] transition">
                  Get a quote
                </button>
                <a href="/contact" onClick={() => track('consult_click' as any)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-sw-ink border border-sw-border hover:bg-white/10 hover:scale-[1.02] transition sw-underline-grad">
                  Book a consult
                </a>
                <a href="/services/briefs/placeholder.pdf" onClick={() => track('download_brief' as any)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-sw-ink border border-sw-border hover:bg-white/10 hover:scale-[1.02] transition">
                  Download brief
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.4, ease }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </a>
              </div>
              <div className="mt-2 text-xs text-white/60 sw-tagline-underline inline-block">
                Event brokerage • AV production • Branding & print • Logistics • Media • Experience design
              </div>
            </motion.div>
          </header>

          {/* Divider below hero CTAs */}
          <div className="mt-12">
             <GradientDivider />
           </div>

           {/* USP row */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch z-10 content-visibility-auto">
              {[
                { icon: '🌌', title: 'Create worlds, not events', sub: 'Immersive flows and rituals', iconClass: 'icon-twinkle' },
                { icon: '⚡', title: 'Zero chaos, seamless flow', sub: 'Calm ops, clear escalation', iconClass: 'icon-pulse-6s' },
                { icon: '🎭', title: 'Hotels to stages — one roof', sub: 'Brokerage • AV • Media', iconClass: 'icon-shimmer' },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.08 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 text-left hover:shadow-[0_0_30px_rgba(140,120,255,0.2)] transition transform-gpu will-change-transform hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  <div className="px-4 md:px-5 py-5 md:py-6 min-h-[84px] md:min-h-[96px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 font-medium text-[18px]">
                      <span className={`sw-gradient-text text-xl drop-shadow-[0_0_6px_rgba(120,120,255,0.35)] group-hover:drop-shadow-[0_0_12px_rgba(120,120,255,0.45)] transition ${c.iconClass}`}>{c.icon}</span>
                      <span>{c.title}</span>
                    </div>
                    <div className="text-white/70 text-sm mt-1">{c.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

          {/* Floating ribbon between USP & logos */}
          <div className="relative">
            <FloatingRibbon />
          </div>

          {/* Logos strip with its own surface & divider glue above */}
          <div className="relative mt-12 md:mt-14 content-visibility-auto">
            <GradientDivider />
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 z-10 relative">
              <p className="text-center text-sm text-white/60 mb-3">Trusted by chapters & institutions</p>
              <div className="flex items-center justify-center gap-10 flex-wrap opacity-80">
                {PARTNER_LOGOS.slice(0,7).map((p, i) => (
                  <img key={i} src={p.src} alt={p.alt} className="h-10 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition" loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Single rotating testimonial with required top margin from logos */}
      <TestimonialSingle />
    </>
  );
}

// (Removed duplicate local FloatingRibbon definition; using exported version above)

function TestimonialSingle() {
  const ease = [0.22,1,0.36,1] as const;
  const quotes = [
    { by: 'Congress Chair', icon: '🎤', jsx: <>We don’t organize events — we create <span className="sw-gradient-text">worlds</span>.</> },
    { by: 'Ops Lead', icon: '⚡', jsx: <>Zero chaos, just <span className="sw-gradient-text">seamless</span> flow.</> },
    { by: 'Program Director', icon: '🏨', jsx: <>Hotels to stages, under one <span className="sw-gradient-text">roof</span>.</> },
  ];
  const [idx, setIdx] = React.useState(0);
  const pauseRef = React.useRef(false);
  React.useEffect(() => {
    const tick = () => { if (!pauseRef.current) setIdx(v => (v + 1) % quotes.length); };
    const id = setInterval(tick, 6000);
    return () => clearInterval(id);
  }, [quotes.length]);

  return (
    <Section className="!pb-0">
      <Container>
        <motion.div
          initial={{ opacity:0, y:14 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.3 }}
          transition={{ duration:0.45, ease }}
          className="max-w-3xl mx-auto text-center mt-16 md:mt-20 content-visibility-auto"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}
        >
           <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">They experienced Starwaves.</h2>
           <div className="relative h-[170px] sm:h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.5, ease }} className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="grad-ring rounded-2xl w-full">
                  <div className="rounded-[14px] border border-white/10 bg-white/5 px-6 py-6">
                    <div className="flex flex-col items-center gap-3">
                      <span className="sw-gradient-text text-3xl icon-twinkle">{quotes[idx].icon}</span>
                      <p className="text-lg sm:text-xl leading-snug max-w-[52ch]">“{quotes[idx].jsx}”</p>
                      <div className="text-white/60 text-sm">— {quotes[idx].by}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
