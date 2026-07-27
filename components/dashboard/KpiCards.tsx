import { Card, CardContent } from "@/components/ui/Card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
  accentColor?: "gold" | "emerald" | "rose" | "sky";
}

function KpiCard({ label, value, hint, icon: Icon, accentColor = "gold" }: KpiCardProps) {
  // تحديد الألوان والإضاءة الخلفية حسب نوع الكارت
  const accents = {
    gold: {
      border: "hover:border-[#e0b238]/50",
      iconBg: "bg-[#e0b238]/10 text-[#e0b238]",
      glow: "from-[#e0b238]/10",
    },
    emerald: {
      border: "hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "from-emerald-500/10",
    },
    rose: {
      border: "hover:border-rose-500/50",
      iconBg: "bg-rose-500/10 text-rose-400",
      glow: "from-rose-500/10",
    },
    sky: {
      border: "hover:border-sky-500/50",
      iconBg: "bg-sky-500/10 text-sky-400",
      glow: "from-sky-500/10",
    },
  };

  const currentAccent = accents[accentColor];

  return (
    <Card className={`relative overflow-hidden bg-slate-900/90 border-slate-800 text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${currentAccent.border}`}>
      {/* إضاءة تدرج خلفية خفيفة */}
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl ${currentAccent.glow} to-transparent rounded-bl-full pointer-events-none opacity-50`} />

      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${currentAccent.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold tracking-tight text-white">{value}</p>
        </div>

        {hint && <p className="mt-2 text-xs text-slate-400 font-medium">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function KpiCards({ locale, current, former }: { locale: string; current: number; former: number }) {
  const ar = locale === "ar";
  const total = current + former;
  const turnover = total === 0 ? 0 : Math.round((former / total) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard 
        label={ar ? "إجمالي الموظفين" : "Total Employees"} 
        value={total} 
        icon={Users}
        accentColor="gold"
      />
      <KpiCard 
        label={ar ? "الموظفون الحاليون" : "Current Employees"} 
        value={current} 
        icon={UserCheck}
        accentColor="emerald"
      />
      <KpiCard 
        label={ar ? "الموظفون السابقون" : "Former Employees"} 
        value={former} 
        icon={UserX}
        accentColor="rose"
      />
      <KpiCard 
        label={ar ? "معدل ترك العمل" : "Turnover Rate"} 
        value={`${turnover}%`} 
        icon={TrendingUp}
        accentColor="sky"
      />
    </div>
  );
}