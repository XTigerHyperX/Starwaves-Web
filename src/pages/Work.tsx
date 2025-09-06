import React from "react";
import { Section } from "../components/layout/Layout";
import { Reveal } from "../components/common/Reveal";
import { Eyebrow } from "../components/common/Eyebrow";
import { WorkCard } from "../components/WorkCard";
import { WORKS } from "../content";

export default function WorkPage() {
  return (
    <Section>
      <Reveal>
        <div className="flex items-center justify-between gap-6">
          <div>
            <Eyebrow>Case studies</Eyebrow>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">Our Worlds</h1>
          </div>
          <div className="text-white/70 text-sm max-w-md">A selection of congresses and festivals we operated across Tunisia.</div>
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
  );
}
