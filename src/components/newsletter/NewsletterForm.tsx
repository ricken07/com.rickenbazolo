"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";

interface NewsletterFormProps {
  locale: string;
}

export function NewsletterForm({ locale }: NewsletterFormProps) {
  const t = useTranslations("newsletter.form");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!email) {
      setErrorMessage(t("errors.required"));
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage(t("errors.invalidEmail"));
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || t("errors.generic"));
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("errors.generic"));
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
          <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold">{t("success.title")}</h3>
        <p className="text-muted-foreground">{t("success.description")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-border/60 bg-background px-5 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? "email-error" : undefined}
        />
      </div>

      {/* Name Field (Optional) */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-muted-foreground">
          {t("nameLabel")}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          disabled={status === "submitting"}
          className="w-full rounded-xl border border-border/60 bg-background px-5 py-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div id="email-error" className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-accent px-6 py-3 font-semibold text-background transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? t("submitting") : t("submitButton")}
      </button>
    </form>
  );
}
