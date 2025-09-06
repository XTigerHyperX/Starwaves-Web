import React from "react";
import { Mail, Phone, Send } from "lucide-react";

export function CTADock({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm will-change-transform">
      <button onClick={onQuote} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black text-sm font-medium hover:opacity-90">
        <Mail className="w-3.5 h-3.5" /> Get a quote
      </button>
      <a href="tel:+21612345678" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm">
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <a href="mailto:hello@starwaves.tn" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 text-sm">
        <Send className="w-3.5 h-3.5" /> Email
      </a>
    </div>
  );
}
