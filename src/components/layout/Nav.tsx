import React from "react";
import { Container } from "./Layout";
import { NavLink, useNavigate } from "react-router-dom";

export function Nav() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const go = (path: string) => (e?: React.MouseEvent) => { if (e) e.preventDefault(); setOpen(false); navigate(path); };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-20 border-b border-white/10 backdrop-blur-md bg-transparent">
        <Container className="flex items-center justify-between h-14">
          <a href="/" onClick={go("/")} className="flex items-center gap-2">
            <img src="/logo.png" alt="Starwaves" className="block w-36 sm:w-40 md:w-44 h-auto" loading="eager" decoding="async" />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <NavLink to="/" end className={({isActive}) => `hover:text-white relative transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : "text-white/80"}`}>Home</NavLink>
            <NavLink to="/services" className={({isActive}) => `hover:text-white relative transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : "text-white/80"}`}>Services</NavLink>
            <NavLink to="/partners" className={({isActive}) => `hover:text-white relative transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : "text-white/80"}`}>Partners</NavLink>
            <NavLink to="/work" className={({isActive}) => `hover:text-white relative transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : "text-white/80"}`}>Work</NavLink>
            <NavLink to="/contact" className={({isActive}) => `hover:text-white relative transition-colors ${isActive ? "text-white after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white/70" : "text-white/80"}`}>Contact</NavLink>
          </nav>

          <button aria-label="Open menu" className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40" onClick={() => setOpen(true)}>
            <span className="sr-only">Menu</span>
            <span className="block w-5 h-0.5 bg-white/90" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
            <span className="block w-5 h-0.5 bg-white/90 mt-1.5" />
          </button>
        </Container>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-md">
          <Container className="pt-20">
            <div className="flex justify-between items-center mb-6">
              <img src="/logo.png" alt="Starwaves" className="w-36 h-auto" />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">✕</button>
            </div>
            <nav className="flex flex-col text-lg space-y-4 text-white/90">
              <a href="/" onClick={go("/")} className="hover:text-white transition-colors">Home</a>
              <a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Services</a>
              <a href="/partners" onClick={go("/partners")} className="hover:text-white transition-colors">Partners</a>
              <a href="/work" onClick={go("/work")} className="hover:text-white transition-colors">Work</a>
              <a href="/contact" onClick={go("/contact")} className="hover:text-white transition-colors">Contact</a>
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}
