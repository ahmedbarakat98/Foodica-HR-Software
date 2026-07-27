import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { EmployeeProfile } from "@/components/employees/EmployeeProfile";
import { normalizeLocale } from "@/lib/i18n/locale";
import { getEmployeeByCodeSafe } from "@/lib/employees/safe-service";

export default async function EmployeeProfilePage({ params }: { params: Promise<{ locale: string; employeeCode: string }> }) {
  const { locale: localeParam, employeeCode } = await params;
  const locale = normalizeLocale(localeParam);
  const employee = await getEmployeeByCodeSafe(decodeURIComponent(employeeCode));
  if (!employee) notFound();
  return (
    <AppShell locale={locale}>
      <EmployeeProfile employee={employee} locale={locale} />
    </AppShell>
  );
}
