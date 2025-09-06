import React from "react";
import { motion } from "framer-motion";
import { Section, Container } from "../components/layout/Layout";
import { Reveal } from "../components/common/Reveal";
import { Eyebrow } from "../components/common/Eyebrow";
import { ServiceCardPro, type ServiceCard as ServiceCardType } from "../components/services/ServiceCardPro";
import { Modal } from "../components/common/Modal";
import { Building2, MonitorSpeaker, Printer, Bus, Video, Palette, ArrowRight, Download, Mail, Phone, CheckCircle2, Shield, BookOpen, Layers, Activity, ListChecks, CalendarClock, UsersRound, Files, Sparkles } from "lucide-react";
import { track } from "../lib/analytics";
import { PARTNER_LOGOS } from "../content";

type BandItem = { label: string; tag?: string };
type ServiceFull = {
  id: ServiceCardType['id'];
  title: string;
  icon: React.ReactNode;
  promise: string;
  bullets: string[];
  scope: string[];
  timeline: string[];
  team: string[];
  deliverables: BandItem[];
  microCase: { stats: string[]; img?: string };
  miniFaqs: string[];
  glance?: string[];
  quote?: string;
};

export default function ServicesPage() {
  const [filter] = React.useState<ServiceCardType['id']| 'all'>('all');
  // Active section state for TOC/mobile chips
  const [currentSection, setCurrentSection] = React.useState<string>('overview');

  // Smooth scroll-reveal variants
  const ease = [0.22, 1, 0.36, 1] as const;
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease } }
  };
  const container = {
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } }
  };

  const services: ServiceCardType[] = [
    { id:'brokerage', icon:<Building2 className="w-5 h-5"/>, title:'Hotel & Venue Brokerage', promise:'Rates protected, onsite desk guaranteed.', bullets:['Rates protected','Allotments by mix','Onsite desk'], href:'/services#brokerage' },
    { id:'production', icon:<MonitorSpeaker className="w-5 h-5"/>, title:'Production & AV', promise:'Crystal audio, cinematic visuals, zero hiccups.', bullets:['Stage design','LED & sound','Live ops'], href:'/services#production' },
    { id:'print', icon:<Printer className="w-5 h-5"/>, title:'Print & Branding', promise:'From wayfinding to stage identity.', bullets:['Wayfinding','Badges','Stage identity'], href:'/services#print' },
    { id:'transport', icon:<Bus className="w-5 h-5"/>, title:'Transport & Logistics', promise:'Buses, arrivals, VIP routing—on time.', bullets:['Arrivals','Shuttles','VIP routes'], href:'/services#transport' },
    { id:'media', icon:<Video className="w-5 h-5"/>, title:'Media & Content', promise:'Teasers, daily recaps, photos.', bullets:['Teasers','Recaps','Photography'], href:'/services#media' },
    { id:'experience', icon:<Palette className="w-5 h-5"/>, title:'Experience Design', promise:'Flows, rituals, memorable moments.', bullets:['Flows','Rituals','Journey'], href:'/services#experience' },
  ];

  const packages = [
    { name:'Student Congress Essentials', fit:'100–400 pax', outcomes:['Venue + AV + Media Lite','Launch fast','Protect budget'] },
    { name:'Flagship & VIP', fit:'400–900+ pax', outcomes:['Staging + LED + concierge','Allotments & escalation SOP','High‑touch ops'] },
    { name:'Brand Experience / Partner Days', fit:'Bespoke, multi‑day', outcomes:['High‑touch design','Bespoke sets','Multi‑day content'] },
  ];

  const packageScopes: Record<string, string[]> = {
    'Student Congress Essentials': [
      'Venue brokerage basics',
      'Minimal stage & FOH audio',
      'Media Lite capture',
      'Badge & wayfinding starter',
      'Shuttle scheduling (as needed)'
    ],
    'Flagship & VIP': [
      'Stage design + LED wall',
      'Show caller + TD + FOH',
      'Allotments & escalation SOP',
      'VIP routing & concierge desk',
      'Daily recaps + photo team'
    ],
    'Brand Experience / Partner Days': [
      'Bespoke set + content ops',
      'Multi‑day media plan',
      'Experience flows & rituals',
      'Sponsor walls & branding',
      'Ops bible + runbook'
    ],
  };

  const onQuote = (id: ServiceCardType['id']) => {
    track('service_quote_click', { id });
    window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode: 'nav', path: '/contact' } }));
  };

  const SERVICES_FULL: ServiceFull[] = [
    {
      id: 'brokerage', title: 'Hotel & Venue Brokerage', icon: <Building2 className="w-5 h-5"/> ,
      promise: 'Rates protected, onsite desk guaranteed.', bullets: ['Rates protected','Allotments by mix','Onsite desk'],
      scope: ['Market scan & shortlist','Negotiated contract pack (attrition, release, comps)','Allotment tracker with burn-down','Rooming list ops & changes','Nightly audit','Onsite desk SOP & escalation tree'],
      timeline: ['Sourcing 3–5d','Contracting 7–12d','Allotments continuous','Onsite event-days'],
      team: ['Lead Producer — contracts & risk','Coordinator — rooming & changes','Onsite Desk — check-in & escalation'],
      deliverables: [
        { label: 'Rate matrix', tag: 'XLS' }, { label: 'Contract pack', tag: 'PDF' }, { label: 'Allotment tracker', tag: 'Sheet' }, { label: 'Rooming change log', tag: 'Sheet' }, { label: 'Onsite SOP', tag: 'PDF' }
      ],
      microCase: { stats: ['4 hotels','1,200 rooms','+12% CSAT'], img: '/services/images/brokerage.png' },
      quote: '“Check-ins were the calmest we’ve ever had.” — Congress Chair',
      miniFaqs: ['Do you manage VIP comps?','Can we split room blocks?','How fast are redlines?'],
      glance: ['Timeline 2–6 wks','Team Lead+1']
    },
    {
      id: 'production', title: 'Production & AV', icon: <MonitorSpeaker className="w-5 h-5"/>,
      promise: 'Crystal audio, cinematic visuals, zero hiccups.', bullets: ['Stage design','LED & sound','Live ops'],
      scope: ['Stage design & run-of-show','LED wall + camera ops','FOH audio + mics','Confidence monitors','Stage management & cues','Backup power & spares'],
      timeline: ['Design 5–7d','Prep 7–10d','Showdays ops'],
      team: ['Show Caller','Technical Director','FOH Engineer','Stage Manager'],
      deliverables: [
        { label: 'Stage map', tag: 'PDF' }, { label: 'Patch list', tag: 'XLS' }, { label: 'Cue sheet', tag: 'PDF' }, { label: 'Runbook', tag: 'PDF' }
      ],
      microCase: { stats: ['2-day summit','0 missed cues','98% on-time'], img: '/services/images/production.png' },
      quote: '“The mix was flawless.” — Head of Program',
      miniFaqs: ['Can you integrate venue AV?','Do you record sessions?','Redundant audio paths?'],
      glance: ['Timeline 2–4 wks','Team 3–4']
    },
    {
      id: 'print', title: 'Print & Branding', icon: <Printer className="w-5 h-5"/>,
      promise: 'From wayfinding to stage identity.', bullets: ['Wayfinding','Badges','Stage identity'],
      scope: ['Wayfinding system','Stage backdrops & side banners','Badges & lanyards','Registration wall','Sponsor walls','Printer liaison'],
      timeline: ['System 3–5d','Files 4–7d','Install 1–2d'],
      team: ['Brand Lead','Production Artist','Install Lead'],
      deliverables: [
        { label: 'Signage pack', tag: 'AI/PDF' }, { label: 'Badge CSV', tag: 'CSV' }, { label: 'Print specs', tag: 'PDF' }
      ],
      microCase: { stats: ['62 signs','5 zones','0 misinstalls'], img: '/services/images/print.png' },
      quote: '“Guests never felt lost.” — Ops Lead',
      miniFaqs: ['Can you handle Arabic/French?','Floor decals allowed?','Last-minute reprints?'],
      glance: ['Timeline 1–3 wks','Team 2–3']
    },
    {
      id: 'transport', title: 'Transport & Logistics', icon: <Bus className="w-5 h-5"/>,
      promise: 'Arrivals nailed. VIPs happy. Buses on time.', bullets: ['Arrivals','Shuttles','VIP routes'],
      scope: ['Flight-based arrivals plan','Shuttle schedule','VIP routing','Bus captain & dispatch tools','Live comms channel'],
      timeline: ['Plan 3–5d','Dispatch 2–3d','Live ops event-days'],
      team: ['Logistics Lead','Dispatch Captain','Ground Crew'],
      deliverables: [
        { label: 'Route map', tag: 'PDF' }, { label: 'Dispatch sheet', tag: 'XLS' }, { label: 'Comms plan', tag: 'PDF' }
      ],
      microCase: { stats: ['11 loops','0 missed pickups','<3m delay'], img: '/services/images/transport.png' },
      quote: '“VIPs glided through.” — Protocol Team',
      miniFaqs: ['Do you track flights live?','Night arrivals?','Wheelchair access?'],
      glance: ['Timeline 1–3 wks','Team 2–3']
    },
    {
      id: 'media', title: 'Media & Content', icon: <Video className="w-5 h-5"/>,
      promise: 'Teasers, daily recaps, aftermovies, photos.', bullets: ['Teasers','Recaps','Photography'],
      scope: ['Pre-event teaser','Daily recap edits','Aftermovie','Photo coverage','Shot-list & interview prompts','48–72h turnaround'],
      timeline: ['Pre 5–10d','Daily edits event-days','Final 5–7d'],
      team: ['Director','Editor','Photographer(s)'],
      deliverables: [
        { label: '1 teaser', tag: 'MP4' }, { label: 'N daily recaps', tag: 'MP4' }, { label: '1 aftermovie', tag: 'MP4' }, { label: 'Photo set', tag: 'RAW/JPG' }
      ],
      microCase: { stats: ['3 recaps/48h','40k views','sponsor uplift'], img: '/services/images/media.png' },
      quote: '“Our partners loved the speed.” — Chair',
      miniFaqs: ['Music licensing?','Vertical exports?','Same-day reels?'],
      glance: ['Timeline 1–3 wks','Team 2–3']
    },
    {
      id: 'experience', title: 'Experience Design', icon: <Palette className="w-5 h-5"/>,
      promise: 'Flows, rituals, moments people remember.', bullets: ['Flows','Rituals','Journey'],
      scope: ['Audience journey map','Openers & awards','Generative ambience loops','Expo flows','Ops bible'],
      timeline: ['Concept 4–7d','Build 7–14d','Run event-days'],
      team: ['Experience Lead','Content Designer','Ops Producer'],
      deliverables: [
        { label: 'Journey map', tag: 'PDF' }, { label: 'Ritual scripts', tag: 'PDF' }, { label: 'Loop pack', tag: 'MP4' }, { label: 'Ops bible', tag: 'PDF' }
      ],
      microCase: { stats: ['1 signature opener','+18% engagement','0 queue spikes'], img: '/services/images/experience.png' },
      quote: '“The opener changed the room.” — Sponsor',
      miniFaqs: ['Can you theme to our brand?','Non-tech audiences?','Accessibility patterns?'],
      glance: ['Timeline 2–6 wks','Team 2–3']
    },
  ];

  React.useEffect(() => {
    // Inject JSON-LD for services
    const json = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: services.map((s, i) => ({
        '@type': 'Service',
        position: i + 1,
        name: s.title,
        description: s.promise,
        url: s.href,
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(json);
    document.head.appendChild(script);
    const script2 = document.createElement('script');
    script2.type = 'application/ld+json';
    script2.text = JSON.stringify(SERVICES_FULL.map(s => ({ '@context':'https://schema.org', '@type':'Service', name: s.title, description: s.promise })));
    document.head.appendChild(script2);
    return () => { document.head.removeChild(script); document.head.removeChild(script2); };
  }, []);

  // Track section views
  React.useEffect(() => {
    const ids = ['overview', ...SERVICES_FULL.map(s=>s.id), 'packages','estimator','proof','why','faqs','contact'];
    const seen = new Set<string>();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).id;
          if (id) {
            if (!seen.has(id)) { seen.add(id); track('service_section_view' as any, { id }); }
            setCurrentSection(id);
          }
        }
      })
    }, { threshold: 0.4 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="services-theme">
      <div className="theme-content">
        {/* Hero */}
  <Section id="overview" className="!pb-12 sm:!pb-16 md:!pb-20">
          <Container>
            <Reveal>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight">We create full‑stack event experiences that feel inevitable.</h1>
                <p className="mt-4 text-white/80 max-w-2xl mx-auto">Venue brokerage, AV & production, print/branding, transport & logistics, media & content, and experience design.</p>
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => { track('service_quote_click'); window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode:'nav', path:'/contact' } })); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sw-cta font-semibold">Get a quote <ArrowRight className="w-4 h-4"/></button>
                  <a href="/contact" onClick={() => track('consult_click')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-sw-ink border border-sw-border hover:bg-white/10">Book a 15‑min Consult</a>
                  <a href="/services/briefs/placeholder.pdf" onClick={() => track('download_brief')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-sw-ink border border-sw-border hover:bg-white/10">Download Services Brief <Download className="w-4 h-4"/></a>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-sm">
                  <span className="text-white/70">What do you need help with?</span>
                  <div className="chips-nav">
                    {['brokerage','production','print','transport','media','experience'].map(id => (
                      <a key={id} href={`#${id}`} className="pill">{id.charAt(0).toUpperCase()+id.slice(1)}</a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Services overview quick grid and left TOC */}
  <Section className="pt-0 !pb-12 sm:!pb-16 md:!pb-20">
          <Container>
            <Reveal>
              <div className="grid lg:grid-cols-[220px,1fr] gap-5">
                <motion.aside initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="hidden lg:block">
                  <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <div className="text-white/70 px-2">Jump to</div>
                    <nav className="mt-2 space-y-1">
                      {['overview','brokerage','production','print','transport','media','experience','packages','estimator','proof','why','faqs','contact'].map(anchor => {
                        const active = currentSection === anchor || (typeof window !== 'undefined' && window.location.hash === `#${anchor}`);
                        return (
                          <a key={anchor} href={`#${anchor}`} className={`block px-2 py-1.5 rounded-lg border ${active ? 'bg-white/10 text-white border-white/10' : 'text-white/80 border-transparent hover:bg-white/5 hover:text-white'}`}>{anchor}</a>
                        );
                      })}
                    </nav>
                  </div>
                </motion.aside>
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                  {services.map((s, i) => (
            <motion.div key={s.id} variants={fadeUp}>
              <ServiceCardPro s={{...s, href: `#${s.id}`}} onQuote={onQuote} />
            </motion.div>
                  ))}
                </motion.div>
              </div>
              {/* Mobile top tabs */}
              <div className="chips-nav mt-4 lg:hidden">
                {['overview','brokerage','production','print','transport','media','experience','packages','estimator','proof','why','faqs','contact'].map(anchor => {
                  const active = currentSection === anchor || (typeof window !== 'undefined' && window.location.hash === `#${anchor}`);
                  return (
                    <a key={anchor} href={`#${anchor}`} className={active ? 'sw-chip-secondary' : 'pill'}>{anchor}</a>
                  );
                })}
              </div>
            </Reveal>
          </Container>
        </Section>

        {/* Full service sections, all details visible */}
        {SERVICES_FULL.map((svc, idx) => (
          <Section key={svc.id} id={svc.id} className="!py-10 sm:!py-14 md:!py-16">
            <Container>
              <div className="max-w-[1200px] md:max-w-[1280px] mx-auto">
                <div className="grid gap-5 md:grid-cols-[minmax(260px,_0.28fr)_1fr]">
                {/* Left summary rail */}
                <div>
                  <div className="grad-ring rounded-2xl">
                    <div className="bg-white/5 p-5 h-full shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">{svc.icon}</div>
                      <h3 className="text-[20px] font-semibold">{svc.title}</h3>
                    </div>
                    <div className="mt-2 text-white/80 line-clamp-2">{svc.promise}</div>
                    <ul className="mt-3 text-[15px] text-white/80 grid gap-1 list-disc pl-5">
                      {svc.bullets.map(b => <li key={b}>{b}</li>)}
                    </ul>
                    {svc.glance?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {svc.glance.map(g => <span key={g} className="pill text-xs">{g}</span>)}
                      </div>
                    ) : null}
                    <div className="mt-4 flex gap-2">
                      <a href={`/${svc.id}`} className="px-3 py-2 rounded-full bg-white/6 text-sw-ink border border-sw-border text-sm">Learn more</a>
                      <button onClick={() => onQuote(svc.id)} className="px-3 py-2 rounded-full sw-cta text-black text-sm font-semibold">Get a quote</button>
                    </div>
                    </div>
                  </div>
                </div>
                {/* Right detail bands */}
                <div className="space-y-3">
                  {/* Bands with staggered motion */}
                  <div className="grad-ring rounded-2xl">
                  <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.2, delay:0 }} className="bg-white/5 p-4 transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2 font-medium text-[18px]"><ListChecks className="w-4 h-4"/> Scope snapshot</div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-white/80 text-[15px] list-disc pl-5">
                      {svc.scope.map(x => <li key={x}>{x}</li>)}
                    </ul>
                  </motion.div>
                  </div>

                  <div className="grad-ring rounded-2xl">
                  <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.2, delay:0.05 }} className="bg-white/5 p-4 transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2 font-medium text-[18px]"><CalendarClock className="w-4 h-4"/> Sample timeline</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {svc.timeline.map((t,i) => (
                        <span key={t} className={`px-3 py-1 rounded-full text-xs ${i%2===0 ? 'sw-chip-secondary' : 'sw-chip-primary'}`}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                  </div>

                  <div className="grad-ring rounded-2xl">
                  <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.2, delay:0.1 }} className="bg-white/5 p-4 transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2 font-medium text-[18px]"><UsersRound className="w-4 h-4"/> Team & roles</div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-white/80 text-[15px] list-disc pl-5">
                      {svc.team.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  </motion.div>
                  </div>

                  <div className="grad-ring rounded-2xl">
                  <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.2, delay:0.15 }} className="bg-white/5 p-4 transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2 font-medium text-[18px]"><Files className="w-4 h-4"/> Deliverables</div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-white/80 text-[15px]">
                      {svc.deliverables.map(d => {
                        const chip = d.tag === 'PDF' ? 'sw-chip-danger' : (d.tag === 'MP4' ? 'sw-chip-primary' : 'sw-chip-secondary');
                        const dot = d.tag === 'PDF' ? 'bg-sw-danger' : (d.tag === 'MP4' ? 'bg-sw-primary' : 'bg-sw-secondary');
                        return (
                          <li key={d.label} className="flex items-center gap-3">
                            <span className={`h-1.5 w-1.5 rounded-full ${dot}`}></span>
                            <span>{d.label}</span>
                            {d.tag ? <span className={`px-2 py-0.5 text-[11px] rounded ${chip}`}>{d.tag}</span> : null}
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                  </div>

                  <div className="grad-ring rounded-2xl">
                  <motion.div initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{ once:true, amount:0.3 }} transition={{ duration:0.2, delay:0.2 }} className="bg-white/5 p-4 transition-transform hover:scale-[1.01] hover:shadow-md border border-white/10 rounded-[14px] md:rounded-[16px]">
                    <div className="flex items-center gap-2 font-medium text-[18px]"><Sparkles className="w-4 h-4"/> Case & quote</div>
                    <div className="mt-2 grid sm:grid-cols-[160px,1fr] gap-3 items-center">
                      {svc.microCase.img ? (
                        <img src={svc.microCase.img} alt="" className="w-full h-24 object-cover rounded-lg border border-white/10" loading="lazy" decoding="async" />
                      ) : null}
                      <div>
                        <ul className="grid grid-cols-3 gap-2 text-sm">
                          {svc.microCase.stats.map(s => (
                            <li key={s} className="sw-chip sw-chip-tertiary justify-center">{s}</li>
                          ))}
                        </ul>
                        {svc.quote ? <div className="mt-2 text-white/80 text-[14px] max-w-[68ch]">{svc.quote}</div> : null}
                      </div>
                    </div>
                  </motion.div>
                  </div>
                </div>
                </div>
              </div>
              {/* Thin animated separator */}
              <div className="mt-6">
                <div className="sw-separator" aria-hidden="true"></div>
              </div>
            </Container>
          </Section>
        ))}

  {/* Proof strip immediately visible */}
  <ProofStrip />

  {/* Packages by Audience */}
        <Section id="packages">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <Eyebrow>Packages by audience</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Start with a bundle</h2>
            </div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 grid md:grid-cols-3 gap-5">
              {packages.map(p => (
                <motion.div key={p.name} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-white/80 text-sm">{p.fit}</div>
                  <div className="text-xl font-semibold mt-1">{p.name}</div>
                  <ul className="mt-3 list-disc pl-5 text-white/80 space-y-1">
                    {p.outcomes.map(o => <li key={o}>{o}</li>)}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <a href={`#plan-${p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} onClick={() => track('package_quote_click', { name: p.name, action:'open_plan' })} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/6 text-sw-ink border border-sw-border hover:bg-white/10">See sample scope</a>
                    <button onClick={() => { track('package_quote_click', { name: p.name }); onQuote('brokerage'); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sw-cta">Get a quote</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* Embedded sample scopes */}
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 grid md:grid-cols-3 gap-5">
              {packages.map(p => (
                <motion.div key={`plan-${p.name}`} variants={fadeUp} id={`plan-${p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="font-semibold">{p.name} — sample scope</div>
                  <ul className="mt-2 list-disc pl-5 text-white/80 space-y-1 text-sm">
                    {(packageScopes[p.name] || []).map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        </Section>

  {/* Estimator (lead magnet) */}
  <EstimatorSection onStart={() => track('open_estimator')} onSubmit={(data) => track('estimator_submit' as any, data)} />

        {/* Why Starwaves */}
        <WhyStarwaves />

        {/* FAQs */}
        <FAQsLite />

        {/* Conversion footer */}
        <Section id="contact">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full sw-cta font-semibold">Get a Quote <Mail className="w-4 h-4"/></a>
            <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/6 text-sw-ink border border-sw-border hover:bg-white/10">Book a 15‑min Consult <Phone className="w-4 h-4"/></a>
          </div>
          <div className="mt-4 max-w-xl mx-auto grid sm:grid-cols-3 gap-3 text-sm">
            <a href="https://wa.me/" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">WhatsApp</a>
            <a href="tel:+000000000" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">Call</a>
            <a href="mailto:hello@starwaves.agency" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">Email</a>
          </div>
          <form className="mt-4 max-w-xl mx-auto flex gap-2">
            <input placeholder="Your email for updates" className="flex-1 px-3 py-2 rounded-xl bg-black/30 border border-sw-border" />
            <button className="px-5 py-2.5 rounded-full sw-cta">Subscribe</button>
          </form>
        </Section>
        {/* No hidden UI for service content per spec; only video modal above */}
      </div>
      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden">
  <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur px-3 py-2 flex items-center gap-2">
          <button onClick={() => { track('cta_sticky_click'); window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode:'nav', path:'/contact' } })); }} className="flex-1 px-5 py-2.5 rounded-full sw-cta">Get a quote</button>
          <a href="/contact" className="px-5 py-2.5 rounded-full bg-white/6 text-sw-ink border border-sw-border">Consult</a>
        </div>
      </div>
    </div>
  );
}

function EstimatorSection({ onStart, onSubmit }: { onStart: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = React.useState({ dates:'', headcount:'', nights:'', venues:'', vip:'', media:'lite' });
  React.useEffect(() => { onStart(); }, []);
  const recommend = () => {
    const hc = parseInt(form.headcount || '0', 10);
    if (hc <= 400) return 'Student Congress Essentials'; if (hc <= 900) return 'Flagship & VIP'; return 'Brand Experience / Partner Days';
  };
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); window.dispatchEvent(new CustomEvent('starwaves:unlock', { detail: { mode:'nav', path:'/contact' } })); };
  return (
    <Section id="estimator">
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Eyebrow>Advisor</Eyebrow>
              <h3 className="text-xl font-semibold">Interactive advisor / estimator</h3>
              <div className="text-white/80">No pricing. Get a recommended package, timeline, and team size.</div>
            </div>
          </div>
          <form onSubmit={submit} className="mt-4 grid md:grid-cols-3 gap-3">
            {([['dates','Dates'],['headcount','Headcount'],['nights','Nights'],['venues','# Venues'],['vip','VIP %']] as const).map(([k,label]) => (
              <input key={k} required value={(form as any)[k]} onChange={e=> setForm({ ...form, [k]: e.target.value })} placeholder={label} className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none"/>
            ))}
            <select value={form.media} onChange={e=> setForm({ ...form, media: e.target.value })} className="px-3 py-2 rounded-lg bg-black/30 border border-white/10">
              <option value="lite">Media Lite</option>
              <option value="standard">Media Standard</option>
              <option value="plus">Media Plus</option>
            </select>
            <div className="md:col-span-3">
              <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                <div><span className="text-white">Recommended:</span> {recommend()}</div>
                <div>Typical timeline: 14–28 days • Team size: 3–5 • Starter checklist: brief, dates, venues</div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="submit" className="px-4 py-2 rounded-xl sw-cta">Send me the tailored plan</button>
              </div>
            </div>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}

function ProofStrip() {
  const [open, setOpen] = React.useState(false);
  const [vals, setVals] = React.useState([0,0,0]);
  React.useEffect(() => {
    let raf: number; let start: number | null = null;
    const target = [98, 10, 12];
    const step = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / 1000);
      setVals([Math.round(target[0]*p), Math.round(target[1]*p), Math.round(target[2]*p)]);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <Section id="proof">
      <Reveal>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="text-center">
          <Eyebrow>Trusted by chapters & institutions</Eyebrow>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } } }}
            className="mt-3 grid sm:grid-cols-3 gap-4">
            {[`${vals[0]}%`,'<10m',`+${vals[2]}%`].map((v, i) => (
              <motion.div key={v} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } } }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="sw-chip-metric text-base font-semibold">{v} <span className="text-sw-mute text-[12px]">{['On‑time starts','Escalation','CSAT'][i]}</span></span>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6 overflow-hidden partners-mask">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="flex gap-10 items-center justify-center flex-wrap opacity-90">
              {PARTNER_LOGOS.map((p, i) => (
                <motion.img key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: i * 0.03 }} src={p.src} alt={p.alt} className="h-12 object-contain" loading="lazy" decoding="async" />
              ))}
            </motion.div>
          </div>
          <motion.button initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }} onClick={() => setOpen(true)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15">View 45‑sec recap</motion.button>
        </motion.div>
        <Modal open={open} onClose={() => setOpen(false)} title="45‑sec recap">
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black/50">
            <video src="/video/recap.mp4" controls preload="none" className="w-full h-full object-cover" />
          </div>
        </Modal>
      </Reveal>
    </Section>
  );
}

function WhyStarwaves() {
  const items = [
    { title:'Rate Integrity, Not Just Rooms', desc:'We protect value, not just inventory.', icon: <Shield className="w-5 h-5"/> },
    { title:'Ops Playbooks That De‑risk Live Moments', desc:'Runbooks for escalation, recovery, and calm ops.', icon: <BookOpen className="w-5 h-5"/> },
    { title:'Creative + Technical Under One Roof', desc:'Design, AV, and media aligned from day one.', icon: <Layers className="w-5 h-5"/> },
    { title:'Nightly Audits & Real‑Time Escalation', desc:'True accountability with daily checks.', icon: <Activity className="w-5 h-5"/> },
  ];
  return (
  <Section id="why">
      <Reveal>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto">
          <Eyebrow>Why Starwaves</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Differentiators</h2>
        </motion.div>
        <motion.div variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 grid md:grid-cols-2 gap-5">
          {items.map(i => (
            <motion.div key={i.title} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22,1,0.36,1] } } }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 font-semibold">{i.icon}<span>{i.title}</span></div>
              <div className="text-white/80">{i.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </Reveal>
    </Section>
  );
}

function FAQsLite() {
  const faqs = [
    { q:'How do you handle attrition?', a:'We negotiate buffers and rolling releases per attendee mix.' },
    { q:'What about VIP changes?', a:'VIP and speakers have priority lanes and dedicated protocols.' },
    { q:'Redlines and contracting?', a:'Typical turnaround 48–72h with clear SOPs.' },
    { q:'Media rights and usage?', a:'We clarify licensing and approvals up front.' },
    { q:'Do you integrate venue AV?', a:'Yes, we can lead or integrate with venue teams and gear.' },
  ];
  return (
    <Section id="faqs">
      <Reveal>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-2xl mx-auto">
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Quick answers</h2>
        </motion.div>
        <motion.div variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map(f => (
            <motion.div key={f.q} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22,1,0.36,1] } } }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-medium">{f.q}</div>
              <div className="text-white/80 text-sm">{f.a}</div>
            </motion.div>
          ))}
        </motion.div>
      </Reveal>
    </Section>
  );
}
