import React from "react";
import { Sparkles } from "lucide-react";
import { GradientRing } from "./common/GradientRing";

export function ServiceCard({
  title,
  desc,
  points,
  Icon,
}: {
  title: string;
  desc: string;
  points?: string[];
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative group h-full" data-test="service-card">
      <GradientRing />
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7 md:p-8 backdrop-blur-sm transition-shadow hover:shadow-[0_0_40px_0_rgba(186,137,255,0.12)] h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-2">
            <Icon className="w-6 h-6 text-white/90" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm md:text-base text-white/80">{desc}</p>
          </div>
        </div>
        {points?.length ? (
          <ul className="mt-4 space-y-1.5 text-sm text-white/70">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-white/60" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto pt-4 text-xs text-white/60 group-hover:text-white/80 transition-colors self-end">Learn more →</div>
      </div>
    </div>
  );
}
