import { AppShell } from "@/components/layout/AppShell";
import { AddEmployeeForm } from "@/components/employees/AddEmployeeForm";
import { normalizeLocale } from "@/lib/i18n/locale";

export default function AddEmployeePage({
  params,
}: {
  params: {
    locale: string;
  };
}) {
  const locale = normalizeLocale(params.locale);

  return (
    <AppShell locale={locale}>
      <AddEmployeeForm locale={locale} />
    </AppShell>
  );
}