import * as React from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0A0B10] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-lg font-semibold">{title}</div>
          <button aria-label="Close" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
        </div>
        <div className="mt-4 text-white/80">
          {children}
        </div>
      </div>
    </div>
  );
}
