import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { normalizeLocale } from "@/lib/i18n/locale";

export default async function LeavesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  return (
    <AppShell locale={locale}>
      <Card>
        <CardHeader><h1 className="text-2xl font-black">{locale === "ar" ? "إدارة الإجازات" : "Leave Management"}</h1></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">{locale === "ar" ? "تم تجهيز منطق حساب الإجازات. جدول التسجيل سيتم ربطه بشيت LeaveRecords." : "Leave calculation logic is ready. Leave table will connect to LeaveRecords."}</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
