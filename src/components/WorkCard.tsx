import React from "react";
import { GradientRing } from "./common/GradientRing";
import { useTilt } from "../hooks/useTilt";

export function WorkCard({
  title,
  role,
  tags = [],
  caseStudy,
}: {
  title: string;
  role: string;
  tags?: string[];
  caseStudy?: string[];
}) {
  const tiltRef = useTilt();
  return (
    <div className="relative group h-full" data-test="work-card">
      <GradientRing />
      <div
        ref={tiltRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 sm:p-7 md:p-8 backdrop-blur-[2px] hover:from-white/10 transition-all will-change-transform h-full flex flex-col"
      >
        <div className="relative flex h-full flex-col">
          <div className="text-sm text-white/70">{role}</div>
          <div className="text-xl sm:text-2xl font-semibold">{title}</div>
          {tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {caseStudy?.length ? (
            <ul className="mt-auto pt-4 space-y-1 text-white/70 text-sm list-disc list-inside marker:text-white/40">
              {caseStudy.slice(0, 3).map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
