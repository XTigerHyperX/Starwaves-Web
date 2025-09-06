import React from "react";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">{children}</div>;
}
