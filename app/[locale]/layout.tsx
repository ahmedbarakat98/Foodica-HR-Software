import { dirForLocale, normalizeLocale } from "@/lib/i18n/locale";
import type { ReactNode } from "react";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = normalizeLocale(params.locale);

  return (
    <div lang={locale} dir={dirForLocale(locale)}>
      {children}
    </div>
  );
}