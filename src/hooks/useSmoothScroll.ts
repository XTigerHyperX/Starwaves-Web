import React from "react";

export function useSmoothScroll() {
  return React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + (window.scrollY || 0) - 64; // offset for header
    window.scrollTo({ top, behavior: "smooth" });
  }, []);
}
