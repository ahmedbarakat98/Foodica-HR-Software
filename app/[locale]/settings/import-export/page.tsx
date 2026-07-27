import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { normalizeLocale } from "@/lib/i18n/locale";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return (
    <AppShell locale={locale}>
      <Card>
        <CardHeader><h1 className="text-2xl font-black">{locale === "ar" ? "استيراد وتصدير" : "Import / Export"}</h1></CardHeader>
        <CardContent><p className="text-sm text-slate-500">{locale === "ar" ? "تم تجهيز الصفحة كبنية أولية وسيتم ربط الوظائف في المرحلة التالية." : "Initial page scaffold is ready; functionality will be connected next."}</p></CardContent>
      </Card>
    </AppShell>
  );
}
