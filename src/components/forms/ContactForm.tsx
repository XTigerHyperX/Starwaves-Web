import React from "react";
import { Send, Check, XCircle, Loader2 } from "lucide-react";

type FormFieldProps = {
  label: string;
  name: string;
  requiredField?: boolean;
  hint?: string;
  ok?: boolean;
  error?: string | null;
  children: React.ReactNode;
};

function FormField({ label, name, requiredField, hint, ok, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-xs text-white/70">
          {label} {requiredField ? <span className="text-white/40">(required)</span> : null}
        </label>
        <div className="h-5">
          {ok ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : error ? (
            <XCircle className="w-4 h-4 text-rose-300" />
          ) : null}
        </div>
      </div>
      {children}
      <div className="min-h-[1rem] text-[11px] leading-4">
        {error ? <span className="text-rose-300">{error}</span> : hint ? <span className="text-white/50">{hint}</span> : null}
      </div>
    </div>
  );
}

export function ContactForm() {
  type FormState = {
    name: string;
    email: string;
    phone: string;
    city: string;
    dates: string;
    headcount: string;
    rooms: string;
    budget: string;
    av: string;
    message: string;
    honey: string;
  };

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    phone: "",
    city: "",
    dates: "",
    headcount: "",
    rooms: "",
    budget: "",
    av: "",
    message: "",
    honey: "",
  });

  const [touched, setTouched] = React.useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    city: false,
    dates: false,
    headcount: false,
    rooms: false,
    budget: false,
    av: false,
    message: false,
    honey: false,
  });

  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [globalMsg, setGlobalMsg] = React.useState<string>("");

  const validEmail = (v: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v.trim());
  const required = (v: string) => v.trim().length > 0;

  const formatTN = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    if (digits.startsWith("216")) {
      const rest = digits.slice(3);
      return "+216 " + rest.replace(/(\d{2})(\d{3})(\d{3})?/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
    }
    if (digits.startsWith("00216")) {
      const rest = digits.slice(5);
      return "+216 " + rest.replace(/(\d{2})(\d{3})(\d{3})?/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
    }
    if (v.startsWith("+")) return "+" + digits;
    return digits;
  };

  const onField = <K extends keyof FormState>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.currentTarget?.value ?? "";
    const v = k === "phone" ? formatTN(raw) : raw;
    setForm((s) => ({ ...s, [k]: v }));
  };

  const onBlur = <K extends keyof FormState>(k: K) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errorFor = (k: keyof FormState): string | null => {
    if (k === "name" && touched.name && !required(form.name)) return "Name is required";
    if (k === "email" && touched.email && !validEmail(form.email)) return "Enter a valid email";
    if (k === "message" && touched.message && !required(form.message)) return "Tell us a few details";
    return null;
  };

  const hasError = (k: keyof FormState) => Boolean(errorFor(k));
  const isOK = (k: keyof FormState) => touched[k] && !hasError(k) && required((form[k] as string) ?? "");

  const leftChars = 1200 - form.message.length;
  const messageTooLong = form.message.length > 1200;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched((t) => ({ ...t, name: true, email: true, message: true }));
    if (form.honey) return;

    if (!required(form.name) || !validEmail(form.email) || !required(form.message) || messageTooLong) {
      setStatus("error");
      setGlobalMsg(messageTooLong ? "Your message is a bit long — please shorten it." : "Please fix the highlighted fields.");
      return;
    }

    setStatus("sending");
    setGlobalMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      setGlobalMsg("Thanks! We'll reply within 48h with a venue short-list & draft budget.");
    } catch {
      const subject = encodeURIComponent(`Event inquiry from ${form.name} — ${form.city || ""}`);
      const body = encodeURIComponent(`Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
City: ${form.city}
Dates: ${form.dates}
Headcount: ${form.headcount}
Rooms/night: ${form.rooms}
Budget: ${form.budget}
AV: ${form.av}

Message:
${form.message}

Sent via starwaves.tn`);
      window.location.href = `mailto:hello@starwaves.tn?subject=${subject}&body=${body}`;
      setStatus("sent");
      setGlobalMsg("Thanks! Your email client should open with the details.");
    }
  };

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 md:p-8 text-left"
      noValidate
    >
      <div className="sr-only" aria-live="polite">{globalMsg}</div>

      <input
        type="text"
        name="company"
        value={form.honey}
        onChange={onField("honey")}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
      />

      {status === "sent" && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/60 text-center p-8">
          <div>
            <div className="text-2xl font-semibold mb-2">Thank you!</div>
            <p className="text-white/80">{globalMsg || "We'll be in touch shortly."}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <FormField label="Name" name="name" requiredField ok={isOK("name")} error={errorFor("name")}>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={onField("name")}
            onBlur={onBlur("name")}
            placeholder="Your full name"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="name"
          />
        </FormField>

        <FormField label="Email" name="email" requiredField ok={isOK("email") && validEmail(form.email)} error={errorFor("email")}>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onField("email")}
            onBlur={onBlur("email")}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Phone" name="phone" hint="Optional">
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onField("phone")}
            onBlur={onBlur("phone")}
            placeholder="+216 12 345 678"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="tel"
            inputMode="tel"
          />
        </FormField>

        <FormField label="City" name="city" hint="Where the event happens">
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={onField("city")}
            onBlur={onBlur("city")}
            placeholder="Tunis, Hammamet, Sousse..."
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            autoComplete="address-level2"
          />
        </FormField>

        <FormField label="Dates" name="dates" hint="e.g., 12–14 Oct 2025">
          <input
            id="dates"
            name="dates"
            value={form.dates}
            onChange={onField("dates")}
            onBlur={onBlur("dates")}
            placeholder="e.g., 12–14 Oct 2025"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
        </FormField>

        <FormField label="Headcount" name="headcount" hint="Approximate total">
          <input
            id="headcount"
            name="headcount"
            value={form.headcount}
            onChange={onField("headcount")}
            onBlur={onBlur("headcount")}
            placeholder="e.g., 400"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </FormField>

        <FormField label="Rooms / night" name="rooms" hint="Hotel block estimate">
          <input
            id="rooms"
            name="rooms"
            value={form.rooms}
            onChange={onField("rooms")}
            onBlur={onBlur("rooms")}
            placeholder="e.g., 120"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </FormField>

        <FormField label="Budget" name="budget" hint="Rough range is fine">
          <input
            id="budget"
            name="budget"
            value={form.budget}
            onChange={onField("budget")}
            onBlur={onBlur("budget")}
            placeholder="e.g., 80,000 TND"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            inputMode="numeric"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="AV / Stage needs" name="av" hint="LED / projection / streaming / translation…">
            <input
              id="av"
              name="av"
              value={form.av}
              onChange={onField("av")}
              onBlur={onBlur("av")}
              placeholder="LED / projection / streaming / translation..."
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Message"
            name="message"
            requiredField
            ok={touched.message && !messageTooLong && required(form.message)}
            error={messageTooLong ? "Max 1200 characters" : touched.message && !required(form.message) ? "Tell us a few details" : null}
          >
            <textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={onField("message")}
              onBlur={onBlur("message")}
              rows={6}
              placeholder="Tell us about your congress..."
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 transition-all"
              maxLength={1400}
            />
            <div className="mt-1 text-[11px] text-white/50 text-right">{Math.max(0, leftChars)} / 1200</div>
          </FormField>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-4 text-sm text-rose-300" aria-live="polite">{globalMsg || "Please check the fields above."}</div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6CA4FF] via-[#BA89FF] to-[#FFA85E] text-black font-semibold hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-all"
        >
          {status === "sending" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="text-xs text-white/50">We usually reply within 48h.</span>
      </div>
    </form>
  );
}
