import React from "react";
import { Section } from "../components/layout/Layout";
import { Reveal } from "../components/common/Reveal";
import { Eyebrow } from "../components/common/Eyebrow";
import { ContactForm } from "../components/forms/ContactForm";

export default function ContactPage() {
  return (
    <Section>
      <Reveal>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
            <Eyebrow>Get a quote</Eyebrow>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">Contact</h1>
            <p className="text-white/80">Tell us dates, city, headcount, and anything special. We'll reply with a venue short-list and draft budget.</p>
          </div>
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
