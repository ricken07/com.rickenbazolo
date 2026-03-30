"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmitStatus = "idle" | "submitting" | "success";

interface NewsletterInlineFormProps {
  locale: string;
}

export function NewsletterInlineForm({ locale }: NewsletterInlineFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState("");

  const copy = useMemo(
    () =>
      locale === "fr"
        ? {
            placeholder: "Votre adresse email",
            button: "S'abonner",
            required: "L'email est obligatoire.",
            invalid: "Merci d'entrer une adresse email valide.",
            success: "C'est noté ! Vous recevrez mes prochaines actualités.",
          }
        : {
            placeholder: "Your email address",
            button: "Subscribe",
            required: "Email is required.",
            invalid: "Please enter a valid email address.",
            success: "You're in! You'll get my next updates.",
          },
    [locale],
  );

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(copy.required);
      return;
    }

    if (!validateEmail(email)) {
      setError(copy.invalid);
      return;
    }

    setStatus("submitting");

    // Simulate a short network call; replace with real subscription endpoint later.
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 750);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:max-w-md"
          aria-label={copy.placeholder}
          aria-invalid={!!error}
          required
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0693e3] px-6 py-3 font-semibold text-white shadow-lg shadow-[#0693e3]/20 transition hover:scale-[1.02] hover:bg-[#0576c2] hover:shadow-xl hover:shadow-[#0693e3]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "..." : copy.button}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      {status === "success" && !error && <p className="text-center text-sm text-emerald-600">{copy.success}</p>}
    </form>
  );
}
