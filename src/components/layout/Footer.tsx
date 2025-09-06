import React from "react";
import { Container } from "./Layout";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const go = (path: string) => (e: React.MouseEvent) => { e.preventDefault(); navigate(path); };
  return (
    <footer id="footer" className="relative z-10 mt-16 border-t border-white/10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E]" />
      <Container className="py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <img src="/logo.png" alt="Starwaves" className="w-36 sm:w-40 md:w-44 h-auto" />
            <p className="mt-4 text-white/70 text-sm">Discover cinematic congress operations across Tunisia. We orchestrate hotels, transport, AV, print, and media into one smooth system.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.facebook.com/Starwaves" target="_blank" rel="noreferrer" aria-label="Facebook" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li><a href="/" onClick={go("/")} className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/work" onClick={go("/work")} className="hover:text-white transition-colors">Work</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Services</a></li>
              <li><a href="/contact" onClick={go("/contact")} className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Services</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Hotel & Venue Brokerage</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Production & AV</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Print & Branding</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Transport & Logistics</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Media & Content</a></li>
              <li><a href="/services" onClick={go("/services")} className="hover:text-white transition-colors">Experience Design</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-white/70 text-sm">
              <li><a href="/contact" onClick={go("/contact")} className="hover:text-white transition-colors">Get a quote</a></li>
              <li><a href="/contact" onClick={go("/contact")} className="hover:text-white transition-colors">Contact</a></li>
              <li><span className="text-white/40">FAQs (coming soon)</span></li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-white/60">
          <div>© {new Date().getFullYear()} Starwaves Events & Congresses — SARL • Capital 5,000 TND</div>
          <div className="flex items-center gap-6"><a href="/" onClick={go("/")} className="hover:text-white transition-colors">Back to top</a></div>
        </Container>
      </div>
    </footer>
  );
}
