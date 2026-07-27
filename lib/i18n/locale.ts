import { supportedLocales, type SupportedLocale } from "@/config/app.config";

export function normalizeLocale(locale?: string): SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale) ? (locale as SupportedLocale) : "ar";
}

export function dirForLocale(locale: SupportedLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
