import React from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setInView(e.isIntersecting));
      },
      { threshold: 0.18, rootMargin: "50px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass = delay >= 300 ? "reveal-delay-300" : delay >= 250 ? "reveal-delay-250" : delay >= 200 ? "reveal-delay-200" : delay >= 150 ? "reveal-delay-150" : delay >= 100 ? "reveal-delay-100" : delay >= 50 ? "reveal-delay-50" : "reveal-delay-0";
  return (
    <div ref={ref} className={`reveal ${delayClass} ${inView ? "in" : ""} ${className}`}>
      {children}
    </div>
  );
}