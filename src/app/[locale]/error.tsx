"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#0693e3]">Erreur</p>
        <h1 className="font-heading text-4xl font-bold">Quelque chose s&apos;est mal passé</h1>
        <p className="text-muted-foreground">
          Une erreur inattendue s&apos;est produite. Veuillez réessayer.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-full border border-[#0693e3]/30 bg-[#0693e3]/10 px-6 py-2.5 text-sm font-semibold text-[#0693e3] transition hover:bg-[#0693e3]/20"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-full bg-[#0693e3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0576c2]"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
