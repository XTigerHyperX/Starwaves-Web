import React from "react";

export function GradientRing() {
  return (
    <span
      data-test="grad-ring"
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 grad-ring"
    />
  );
}
