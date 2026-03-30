import { getRequestConfig } from "next-intl/server";
import { routing } from "./config";
import { getMessages } from "@/lib/i18n/getMessages";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
        locale = routing.defaultLocale;
    }

    const messages = await getMessages(locale);

    return {
        locale,
        messages,
    };
});
