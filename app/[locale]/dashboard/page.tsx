import { AppShell } from "@/components/layout/AppShell";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { normalizeLocale } from "@/lib/i18n/locale";
import { getCurrentEmployeesSafe, getFormerEmployeesSafe } from "@/lib/employees/safe-service";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const t = getDictionary(locale);
  const [current, former] = await Promise.all([getCurrentEmployeesSafe(), getFormerEmployeesSafe()]);

  return (
    <AppShell locale={locale}>
      {/* الهيدر العلوي بلمسة ذهبية وفخمة */}
      <div className="mb-8 border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-[#d4af37] rounded-full inline-block"></span>
            {t.dashboard}
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            {locale === "ar" ? "ملخص سريع لأهم مؤشرات الموارد البشرية" : "Fast overview of core HR metrics"}
          </p>
        </div>

        {/* زر إضافي اختياري بنفس لون زر Get In Touch من الموقع */}
        <button className="bg-[#e0b238] hover:bg-[#c99e2e] text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 text-sm self-start md:self-auto">
          {locale === "ar" ? "تصدير التقارير" : "Export Reports"}
        </button>
      </div>

      <KpiCards locale={locale} current={current.length} former={former.length} />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl rounded-2xl overflow-hidden relative backdrop-blur-sm">
          {/* الشريط الذهبي العلوي */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />

          <CardHeader className="border-b border-slate-800/80 pb-4 pt-6">
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
              {t.departmentCount}
            </h2>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-sm text-slate-400 leading-relaxed">
              {locale === "ar"
                ? "سيتم إضافة الرسوم البيانية Lazy-loaded في المرحلة التالية."
                : "Lazy-loaded charts will be added in the next phase."}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800 text-slate-100 shadow-xl rounded-2xl overflow-hidden relative backdrop-blur-sm">
          {/* الشريط الذهبي العلوي المميز لصفحتك */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />

          <CardHeader className="border-b border-slate-800/80 pb-4 pt-6">
            <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
              {t.leaveConsumption}
            </h2>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-sm text-slate-400 leading-relaxed">
              {locale === "ar"
                ? "سيتم ربطها بسجل الإجازات بعد تجهيز LeaveRecords."
                : "Will be connected to LeaveRecords after the leave module."}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}