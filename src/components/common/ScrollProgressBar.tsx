import React from "react";

export function ScrollProgressBar({ show = true }: { show?: boolean }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!show) return;
    const el = ref.current!;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.body.scrollHeight - window.innerHeight;
          const p = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, max)));
          if (el) el.style.transform = `scaleX(${p})`;
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [show]);
  if (!show) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[30] h-[3px] bg-transparent">
      <div ref={ref} className="origin-left h-full bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] scale-x-0 will-change-transform" />
    </div>
  );
}
