import React from "react";

// Robust active section detection based on scroll position and header offset
export function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string>(ids[0] || "");
  React.useEffect(() => {
    let raf: number | null = null;
    const header = 64; // fixed header height
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = (window.scrollY || 0) + header + window.innerHeight * 0.25; // marker ~25% from top
        let bestId = active;
        let bestDist = Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.offsetTop;
          const dist = Math.abs(y - top);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = id;
          }
        }
        setActive(bestId);
        raf = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids.join(",")]);
  return active;
}
