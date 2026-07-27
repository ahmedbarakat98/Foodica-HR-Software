import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { normalizeLocale } from "@/lib/i18n/locale";

export default async function MyProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return (
    <AppShell locale={locale}>
      <Card>
        <CardHeader><h1 className="text-2xl font-black">{locale === "ar" ? "ملفي الشخصي" : "My Profile"}</h1></CardHeader>
        <CardContent><p className="text-sm text-slate-500">{locale === "ar" ? "سيتم عرض بيانات الموظف الحالي بعد تفعيل Session." : "Current employee data will be shown after session activation."}</p></CardContent>
      </Card>
    </AppShell>
  );
}
