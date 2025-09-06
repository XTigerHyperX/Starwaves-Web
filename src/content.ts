// Centralized editable content for Starwaves
export type NextEvent = { title: string; location: string; dateISO: string };
export type UpcomingEvent = { title: string; location: string; dateISO: string; href?: string };
export type PartnerLogo = { src: string; alt: string };
export type FAQ = { q: string; a: string };
export type WorkItem = {
  role: string;
  title: string;
  tags: string[];
  caseStudy: string[];
};

export const NEXT_EVENT: NextEvent = {
  title: "Next Congress Partnership",
  location: "Medina Congress Center, Hammamet",
  dateISO: "2025-12-22T08:00:00+01:00",
};

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    title: "MedTech Innovation Congress",
    location: "Tunis Convention Center",
    dateISO: "2025-10-18T09:00:00+01:00",
  },
  {
    title: "North Africa Hospitality Forum",
    location: "Sousse Exhibition Park",
    dateISO: "2026-02-12T09:00:00+01:00",
  },
  {
    title: "ESPRIT Engineering Summit",
    location: "ESPRIT Campus, Ariana",
    dateISO: "2026-04-04T08:30:00+01:00",
  },
];

export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/logos/ENIT SB.png", alt: "ENIT Student Branch" },
  { src: "/logos/iip esprit.png", alt: "IIP Esprit" },
  { src: "/logos/ESPRIT SB.svg", alt: "ESPRIT Student Branch" },
  { src: "/logos/sec.png", alt: "SEC" },
];

export const FAQS: FAQ[] = [
  { q: "Do you work outside Tunisia?", a: "Yes, via partner networks; brokerage and media remain in-house." },
  { q: "How early should we book?", a: "Ideally 4–6 months ahead for space and rates; we also handle rush timelines." },
  { q: "Do you support hybrid conferences?", a: "Yes — multi-cam, streaming, live captions, and translation are standard." },
];

export const WORKS: WorkItem[] = [
  {
    role: "Congress operations",
    title: "IASTAM 5.0 2025",
    tags: ["1,800 pax", "4 hotels", "2 live stages"],
    caseStudy: [
      "Objective: grow capacity without losing pace",
      "Approach: shared run-of-show across venues",
      "Outcome: 12% higher satisfaction, on budget",
    ],
  },
  {
    role: "Congress operations",
    title: "WIE ACT 4.0",
    tags: ["6K sqm", "Booth build", "Wayfinding"],
    caseStudy: [
      "Objective: maximize floor traffic",
      "Approach: wayfinding + staging for flow",
      "Outcome: +18% dwell time at booths",
    ],
  },
  {
    role: "Media & broadcast",
    title: "Gov Innovation Forum",
    tags: ["3-cam studio", "Live captions", "Multilang stream"],
    caseStudy: [
      "Objective: hybrid reach with clarity",
      "Approach: multi-cam + captions + translation",
      "Outcome: 3x stream retention vs. prior",
    ],
  },
];
