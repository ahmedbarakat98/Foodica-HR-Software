import { AppShell } from "@/components/layout/AppShell";
import { EmployeesTable } from "@/components/employees/EmployeesTable";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { normalizeLocale } from "@/lib/i18n/locale";
import { getFormerEmployeesSafe } from "@/lib/employees/safe-service";

export default async function FormerEmployeesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const t = getDictionary(locale);
  const employees = await getFormerEmployeesSafe();
  return (
    <AppShell locale={locale}>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-950">{t.formerEmployees}</h1>
        <p className="mt-1 text-sm text-slate-500">{employees.length} {t.employees}</p>
      </div>
      <EmployeesTable employees={employees} locale={locale} />
    </AppShell>
  );
}
