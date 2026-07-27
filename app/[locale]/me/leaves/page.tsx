import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { normalizeLocale } from "@/lib/i18n/locale";

export default async function MyLeavesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return (
    <AppShell locale={locale}>
      <Card>
        <CardHeader><h1 className="text-2xl font-black">{locale === "ar" ? "إجازاتي" : "My Leaves"}</h1></CardHeader>
        <CardContent><p className="text-sm text-slate-500">{locale === "ar" ? "صفحة مشاهدة رصيد وسجل الإجازات للموظف." : "Employee leave balance and records page."}</p></CardContent>
      </Card>
    </AppShell>
  );
}
