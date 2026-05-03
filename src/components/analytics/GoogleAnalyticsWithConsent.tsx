"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { GoogleAnalyticsPageTracker } from "@/components/analytics/GoogleAnalyticsPageTracker";

type ConsentState = "granted" | "denied" | null;

const CONSENT_STORAGE_KEY = "ricken-analytics-consent";
const CONSENT_COOKIE_NAME = "ricken-analytics-consent";

function readConsent(): ConsentState {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function GoogleAnalyticsWithConsent({
  measurementId,
  initialConsent = null,
}: {
  measurementId?: string;
  initialConsent?: ConsentState;
}) {
  const t = useTranslations("analytics");
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(initialConsent);

  useEffect(() => {
    const storedConsent = readConsent();
    setConsent(storedConsent ?? initialConsent);
    setMounted(true);
  }, [initialConsent]);

  function updateConsent(nextConsent: Exclude<ConsentState, null>) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent);
    document.cookie = `${CONSENT_COOKIE_NAME}=${nextConsent}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setConsent(nextConsent);
  }

  if (!measurementId) {
    return null;
  }

  return (
    <>
      {consent === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { send_page_view: false });
            `}
          </Script>
          <GoogleAnalyticsPageTracker />
        </>
      ) : null}

      {mounted && consent === null ? (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border/70 bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="max-w-3xl space-y-2">
              <p className="text-sm font-semibold text-foreground">{t("title")}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("description")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => updateConsent("denied")}>
                {t("decline")}
              </Button>
              <Button onClick={() => updateConsent("granted")}>
                {t("accept")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
