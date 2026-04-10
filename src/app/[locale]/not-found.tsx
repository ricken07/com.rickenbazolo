import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common.notFound" });

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-4">
        <p className="font-heading text-8xl font-bold text-[#0693e3] opacity-30">404</p>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#0693e3]">
          {t("label")}
        </p>
        <h1 className="font-heading text-3xl font-bold">
          {t("title")}
        </h1>
        <p className="max-w-md text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href={`/${locale}`}
          className="rounded-full bg-[#0693e3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0576c2]"
        >
          {t("home")}
        </Link>
        <Link
          href={`/${locale}/blog`}
          className="rounded-full border border-[#0693e3]/30 bg-[#0693e3]/10 px-6 py-2.5 text-sm font-semibold text-[#0693e3] transition hover:bg-[#0693e3]/20"
        >
          {t("blog")}
        </Link>
      </div>
    </div>
  );
}
