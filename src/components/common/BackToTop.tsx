import React from "react";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

export function BackToTop() {
  const [show, setShow] = React.useState(false);
  const scrollTo = useSmoothScroll();
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShow((window.scrollY || 0) > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => scrollTo("home")} aria-label="Back to top" className="fixed bottom-6 right-6 z-30 rounded-full bg-white text-black shadow-lg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 w-12 h-12 grid place-items-center will-change-transform">↑</button>
  );
}
