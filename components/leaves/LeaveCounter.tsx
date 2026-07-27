import { Card, CardContent } from "@/components/ui/Card";
import type { LeaveBalance } from "@/types/leave";

export function LeaveCounter({ balance, locale }: { balance: LeaveBalance; locale: string }) {
  const ar = locale === "ar";
  const items = [
    { label: ar ? "المستهلك" : "Used", value: balance.usedDays },
    { label: ar ? "المعتمد" : "Allowed", value: balance.allowedDays },
    { label: ar ? "المقترح" : "Suggested", value: balance.suggestedDays },
    { label: ar ? "المتبقي" : "Remaining", value: balance.remainingDays }
  ];
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent>
            <p className="text-sm font-bold text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
