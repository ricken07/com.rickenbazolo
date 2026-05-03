import { locales } from "@/i18n/config";

const NAMESPACES = [
  "common",
  "home",
  "blog",
  "analytics",
  "speaking",
  "gad-digital",
  "opensource",
  "about",
  "tools",
  "newsletter",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

export type MessagesByNamespace = Record<Namespace, Record<string, unknown>>;

export async function getMessages(locale: string): Promise<MessagesByNamespace> {
  if (!locales.includes(locale as (typeof locales)[number])) {
    throw new Error(`Unsupported locale ${locale}`);
  }

  const messagesEntries = await Promise.all(
      NAMESPACES.map(async (namespace) => {
        const data = await import(`../../i18n/messages/${locale}/${namespace}.json`);
        return [namespace, data.default] as const;
      }),
  );

  return Object.fromEntries(messagesEntries) as MessagesByNamespace;
}
