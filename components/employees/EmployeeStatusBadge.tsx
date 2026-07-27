import { Badge } from "@/components/ui/Badge";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { EmployeeStatus } from "@/types/employee";

export function EmployeeStatusBadge({ status, locale }: { status: EmployeeStatus; locale: string }) {
  const t = getDictionary(locale);
  return <Badge tone={status === "current" ? "green" : "red"}>{status === "current" ? t.current : t.former}</Badge>;
}
