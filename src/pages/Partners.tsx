import React from "react";
import { Section } from "../components/layout/Layout";
import { Reveal } from "../components/common/Reveal";
import { Eyebrow } from "../components/common/Eyebrow";
import { PARTNER_LOGOS } from "../content";

export default function PartnersPage() {
  return (
    <Section>
      <Reveal>
        <div className="text-center max-w-3xl mx-auto">
          <Eyebrow>Who we serve</Eyebrow>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">Partners</h1>
          <p className="mt-4 text-white/80">We support student branches, institutions, and associations across Tunisia.</p>
        </div>
        <div className="mt-10 relative overflow-hidden group partners-mask">
          <div data-marq className="flex gap-16 items-center animate-[marq_35s_linear_infinite] group-hover:[animation-play-state:paused]">
            {PARTNER_LOGOS.concat(PARTNER_LOGOS).map((p, i) => (
              <img key={i} src={p.src} alt={p.alt} className="h-14 sm:h-16 md:h-20 object-contain opacity-90" loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
