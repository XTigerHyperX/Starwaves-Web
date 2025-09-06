import React from "react";
import { GradientRing } from "../common/GradientRing";
import { Section } from "../layout/Layout";
import { Reveal } from "../common/Reveal";

function StepCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  return (
    <div className="relative group">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
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
}

export function ProcessSection() {
  const steps = [
    { title: "Discovery", desc: "Objectives, stakeholders, constraints, and KPIs." },
    { title: "Design", desc: "Experience mapping, scenography, media plan, and budgets." },
    { title: "Pre‑production", desc: "Vendors, CADs, run‑of‑show, logistics & risk playbooks." },
    { title: "Onsite ops", desc: "Hotel desk, stage & AV, transport, and branding install." },
    { title: "Wrap & report", desc: "Strike, reconciliation, and post‑event media delivery." },
  ];
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
}
