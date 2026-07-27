import { dirForLocale, normalizeLocale } from "@/lib/i18n/locale";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return (
    <html lang={locale} dir={dirForLocale(locale)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
