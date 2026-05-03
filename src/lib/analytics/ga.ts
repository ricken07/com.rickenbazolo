export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetIdOrName: string | Date,
      config?: Record<string, unknown>,
    ) => void;
  }
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function" && Boolean(GA_MEASUREMENT_ID);
}

export function trackPageView(url: string) {
  if (!canTrack() || !GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
  });
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (!canTrack()) {
    return;
  }

  window.gtag?.("event", eventName, params);
}
