import React from "react";
import { Section } from "../layout/Layout";
import { Reveal } from "../common/Reveal";
import { FAQS } from "../../content";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <button
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-white/5 rounded-xl transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-white/80 text-sm">{a}</div>
      )}
    </div>
  );
}

export function FAQ() {
  const faqs = FAQS;
  return (
    <Section id="faq">
      <Reveal>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">Frequently asked</h2>
        <div className="text-white/70">Quick answers to common questions.</div>
      </Reveal>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {faqs.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </Section>
  );
}
