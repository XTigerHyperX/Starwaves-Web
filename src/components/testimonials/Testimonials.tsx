import React from "react";
import { GradientRing } from "../common/GradientRing";
import { Section } from "../layout/Layout";
import { Reveal } from "../common/Reveal";

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="relative group h-full">
      <GradientRing />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm h-full flex flex-col">
        <div className="relative flex h-full flex-col">
          <div className="text-white/90 italic">"{quote}"</div>
          <div className="mt-auto pt-4 text-sm text-white/70">{author} — {role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
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
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {items.map((t, i) => (
          <Reveal key={i} delay={i * 60}>
            <TestimonialCard {...t} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
