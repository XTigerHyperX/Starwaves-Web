import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuroraBackground } from "../common/AuroraBackground";
import { Nav } from "./Nav";
import { CTADock } from "../common/CTADock";
import { ScrollProgressBar } from "../common/ScrollProgressBar";
import { Footer } from "./Footer";
import { BackToTop } from "../common/BackToTop";
import { UnlockFX } from "../common/UnlockFX";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unlocking, setUnlocking] = React.useState(false);
  const [fxKey, setFxKey] = React.useState(0);
  const auroraRef = React.useRef<{ burst: () => void } | null>(null);

  const runFxAndGo = React.useCallback((path: string) => {
    if (unlocking) return;
    auroraRef.current?.burst?.();
    setFxKey((k) => k + 1);
    setUnlocking(true);
    window.setTimeout(() => {
      setUnlocking(false);
      navigate(path);
    }, 900);
  }, [navigate, unlocking]);

  React.useEffect(() => {
    const onUnlock = (e: Event) => {
      const ev = e as CustomEvent<any>;
      if (unlocking) return;
      auroraRef.current?.burst?.();
      setFxKey((k) => k + 1);
      setUnlocking(true);
      window.setTimeout(() => {
        setUnlocking(false);
        const detail = ev.detail || {};
        if (detail?.mode === 'nav' && typeof detail?.path === 'string') {
          navigate(detail.path);
        } else if (detail?.mode === 'scroll' && typeof detail?.id === 'string') {
          const el = document.getElementById(detail.id);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      }, 900);
    };
    window.addEventListener('starwaves:unlock', onUnlock as EventListener);
    return () => window.removeEventListener('starwaves:unlock', onUnlock as EventListener);
  }, [navigate, unlocking]);

  React.useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-[#06070B]">
      <AuroraBackground ref={auroraRef as any} />
      <ScrollProgressBar />
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded-md">Skip to content</a>
      <Nav />
      <CTADock onQuote={() => runFxAndGo('/contact')} />
      <main id="content" className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      {unlocking && <UnlockFX trigger={fxKey} />}
    </div>
  );
}
