import * as React from 'react';
import { ChevronDown, ExternalLink, Mail } from 'lucide-react';
import { track } from '../../lib/analytics';

export type ServiceCard = {
  id: 'brokerage'|'production'|'print'|'transport'|'media'|'experience';
  icon: React.ReactNode;
  title: string;
  promise: string;
  bullets: string[];
  href: string;
  ctaLabel?: string;
  included?: string[];
};

export function ServiceCardPro({ s, onQuote, onQuickView }: { s: ServiceCard; onQuote: (serviceId: ServiceCard['id']) => void; onQuickView?: (serviceId: ServiceCard['id']) => void }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => { setOpen(v => !v); track('service_card_open', { id: s.id, open: !open }); };
  return (
    <div className="grad-ring rounded-2xl h-full">
      <div className="bg-white/5 p-5 backdrop-blur-sm border border-white/10 rounded-[14px] md:rounded-[16px] h-full flex flex-col">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-white/90">{s.icon}</div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{s.title}</div>
          <div className="text-white/70 text-sm">{s.promise}</div>
        </div>
      </div>
  <ul className="mt-3 grid grid-cols-1 gap-1 text-white/80 text-sm list-disc pl-5">
        {s.bullets.slice(0,3).map(b => <li key={b}>{b}</li>)}
      </ul>
  <div className="flex-1" />
  <div className="mt-4 flex flex-wrap gap-2">
        <a href={s.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90">
          Learn more <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={() => { track('service_quote_click', { id: s.id }); onQuote(s.id); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black text-sm font-medium hover:opacity-90">
          {s.ctaLabel || 'Get a quote'} <Mail className="w-3.5 h-3.5" />
        </button>
        {onQuickView ? (
          <button onClick={() => { onQuickView(s.id); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm hover:bg-white/15">
            Quick View
          </button>
        ) : null}
        {s.included?.length ? (
          <button onClick={toggle} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm hover:bg-white/15">
            What's included <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        ) : null}
      </div>
      {open && s.included?.length ? (
  <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80 list-disc pl-5">
            {s.included.map(i => <li key={i}>{i}</li>)}
          </ul>
        </div>
      ) : null}
      </div>
    </div>
  );
}
