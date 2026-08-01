"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/Magnetic";
import { BRAND, BUDGETS, INTERESTS, SECTIONS } from "@/lib/data";
import { EASE, SPRING } from "@/lib/motion";

const META = SECTIONS.find((s) => s.id === "contact")!;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

/* -------------------------------------------------------------------------- */
/* Field                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The label sits on the border and lifts on focus. The underline draws from
 * left to right — one motion, not a colour swap, so the eye follows the caret.
 */
function Field({
  label,
  name,
  type = "text",
  required,
  error,
  multiline,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const Tag = multiline ? "textarea" : "input";

  return (
    <div className="group relative">
      <label htmlFor={id} className="t-mono block text-faint transition-colors group-focus-within:text-prana">
        {label}
        {required && (
          <span className="text-ember" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>

      <Tag
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 4 : undefined}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="peer mt-3 w-full resize-none border-0 border-b border-rule bg-transparent pb-3 text-[1.0625rem] font-light text-champagne outline-none transition-colors placeholder:text-faint/50 focus:border-transparent"
      />

      {/* The drawn underline. Sits under the native border so focus is never
          ambiguous, and turns amber when the field is in error. */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
        style={{ background: "linear-gradient(90deg, #56e8cf, #7a5cff)" }}
      />
      {error && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ember" />}

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-[0.75rem] text-ember"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chips                                                                       */
/* -------------------------------------------------------------------------- */

function ChipGroup({
  legend,
  name,
  options,
  multiple,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  multiple?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) =>
    setSelected((current) =>
      multiple
        ? current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        : current.includes(value)
          ? []
          : [value],
    );

  return (
    <fieldset>
      <legend className="t-mono text-faint">{legend}</legend>
      {/* Real checkboxes/radios underneath — the chips are the label. This
          keeps the control keyboard-operable and announces state correctly. */}
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <label
              key={option}
              className={`relative cursor-pointer select-none rounded-full border px-3.5 py-2 text-[0.8125rem] transition-all duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-prana ${
                on
                  ? "border-prana/55 bg-prana/12 text-champagne"
                  : "border-champagne/12 text-muted hover:border-champagne/25 hover:text-bone"
              }`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option}
                checked={on}
                onChange={() => toggle(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    /* Validate on the client for immediate feedback; the route validates again
       because client-side checks are a convenience, never a control. */
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const body = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Tell us who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "That email address will not reach you.";
    if (body.length < 20) next.message = "A couple of sentences about the project, at minimum.";

    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Request failed");
      setStatus("sent");
      setMessage("");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`Something broke on our side. Email ${BRAND.email} and we will pick it up there.`);
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 grid gap-x-16 gap-y-14 lg:grid-cols-12">
          {/* Left rail */}
          <div className="lg:col-span-5">
            <SplitLines
              as="h2"
              id="contact-title"
              className="t-h2"
              lines={[
                <>Tell us what</>,
                <>
                  is <span className="t-em text-synth">breaking</span>.
                </>,
              ]}
            />

            <Reveal>
              <p className="t-lead mt-7 max-w-[44ch]">
                A senior engineer and a designer read every message. You will hear back within two
                working days, with an actual opinion rather than a calendar link.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-12 space-y-6">
                {[
                  { term: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
                  { term: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}` },
                  { term: "Where", value: BRAND.location },
                ].map((row) => (
                  <div key={row.term}>
                    <dt className="t-mono text-faint">{row.term}</dt>
                    <dd className="mt-2">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="group relative inline-block text-[1.0625rem] text-champagne"
                        >
                          {row.value}
                          <span
                            aria-hidden
                            className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-prana transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                          />
                        </a>
                      ) : (
                        <span className="text-[1.0625rem] text-bone">{row.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <div className="glass edge-light relative overflow-hidden rounded-[24px] p-7 md:p-10">
                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE.out }}
                      className="flex min-h-[26rem] flex-col items-start justify-center"
                      role="status"
                    >
                      {/* The mark completes itself — the same convergence motif
                          as the logo, resolved. */}
                      <motion.svg viewBox="0 0 56 56" className="h-14 w-14" aria-hidden>
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="25"
                          fill="none"
                          stroke="#56e8cf"
                          strokeWidth="1.5"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1, ease: EASE.out }}
                        />
                        <motion.path
                          d="M17 29l8 8 15-17"
                          fill="none"
                          stroke="#56e8cf"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: EASE.out, delay: 0.45 }}
                        />
                      </motion.svg>

                      <h3 className="mt-8 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-light tracking-tight text-champagne">
                        Message received.
                      </h3>
                      <p className="t-body mt-4 max-w-[44ch]">
                        We read it within two working days and reply with a first take — what we
                        would do, what we would not, and roughly what it costs.
                      </p>

                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="group mt-9 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-champagne"
                      >
                        Send another
                        <span
                          aria-hidden
                          className="transition-transform duration-500 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      ref={formRef}
                      onSubmit={onSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-9"
                    >
                      {/* Honeypot — bots fill it, people never see it. */}
                      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label htmlFor="company-website">Do not fill this in</label>
                        <input id="company-website" name="company_website" tabIndex={-1} autoComplete="off" />
                      </div>

                      <div className="grid gap-9 sm:grid-cols-2">
                        <Field label="Your name" name="name" required error={errors.name} autoComplete="name" />
                        <Field
                          label="Email"
                          name="email"
                          type="email"
                          required
                          error={errors.email}
                          autoComplete="email"
                        />
                      </div>

                      <Field label="Company" name="company" autoComplete="organization" />

                      <ChipGroup legend="What do you need" name="interest" options={INTERESTS} multiple />
                      <ChipGroup legend="Rough budget" name="budget" options={BUDGETS} />

                      <Field
                        label="What are you trying to build"
                        name="message"
                        required
                        multiline
                        error={errors.message}
                      />

                      <div className="flex flex-wrap items-center gap-5 pt-1">
                        <CTA type="submit" disabled={status === "sending"}>
                          {status === "sending" ? "Sending" : "Send message"}
                        </CTA>

                        <AnimatePresence>
                          {status === "error" && (
                            <motion.p
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={SPRING.quick}
                              role="alert"
                              className="text-[0.8125rem] text-ember"
                            >
                              {message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <p className="text-[0.75rem] leading-relaxed text-faint">
                        We use what you send here to reply to you, and nothing else. No list, no
                        sequence, no follow-up you did not ask for.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
