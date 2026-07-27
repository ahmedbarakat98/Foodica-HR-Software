import { SplashScreen } from "@/components/layout/SplashScreen";
import { normalizeLocale } from "@/lib/i18n/locale";

export default async function LocaleRootPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SplashScreen locale={normalizeLocale(locale)} />;
}
