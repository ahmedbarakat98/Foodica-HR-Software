import type { EmployeeRecord } from "@/types/employee";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { User, Briefcase, Building2, MapPin, Calendar, CalendarX, FileText } from "lucide-react";

function Detail({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value?: string | number | null; 
  icon?: React.ElementType 
}) {
  const displayValue = value !== undefined && value !== null && value !== "" ? String(value) : null;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400 flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#e0b238] shrink-0" aria-hidden="true" />}
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-2 font-extrabold text-slate-100 text-sm break-words dir-auto">
        {displayValue || <span className="text-slate-600 font-normal">-</span>}
      </dd>
    </div>
  );
}

export function EmployeeProfile({ employee, locale }: { employee: EmployeeRecord; locale: string }) {
  const isAr = locale === "ar";
  
  // استخراج الحرف الأول من الاسم بشكل آمن
  const avatarLetter = employee.name?.trim().charAt(0) || "F";

  return (
    <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
      {/* كارت البيانات الأساسية للموظف */}
      <Card className="overflow-hidden relative bg-slate-950 border-slate-800 shadow-2xl">
        {/* شريط ديكوري علوي باللون الذهبي */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e0b238] via-amber-500 to-amber-700" />

        <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            {/* الأيقونة الرمزية للموظف */}
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#e0b238] to-amber-600 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/10 shrink-0">
              {employee.name ? avatarLetter : <User className="h-7 w-7" aria-hidden="true" />}
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {employee.name || (isAr ? "بدون اسم" : "Unnamed")}
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#e0b238] flex items-center gap-2">
                <span>{isAr ? "كود الموظف:" : "ID:"}</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 text-slate-200 font-mono">
                  {employee.employeeCode || "-"}
                </span>
              </p>
            </div>
          </div>

          <div className="self-start md:self-auto">
            <EmployeeStatusBadge status={employee.status} locale={locale} />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <dl className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Detail 
              label={isAr ? "الوظيفة" : "Job title"} 
              value={employee.jobTitle} 
              icon={Briefcase}
            />
            <Detail 
              label={isAr ? "الإدارة" : "Administration"} 
              value={employee.administration} 
              icon={Building2}
            />
            <Detail 
              label={isAr ? "القسم" : "Department"} 
              value={employee.department} 
              icon={Building2}
            />
            <Detail 
              label={isAr ? "الفرع" : "Branch"} 
              value={employee.branch} 
              icon={MapPin}
            />
            <Detail 
              label={isAr ? "تاريخ التعيين" : "Hiring date"} 
              value={employee.hiringDate} 
              icon={Calendar}
            />
            <Detail 
              label={isAr ? "تاريخ انتهاء العمل" : "Termination date"} 
              value={employee.terminationDate} 
              icon={CalendarX}
            />
          </dl>
        </CardContent>
      </Card>

      {/* كارت جميع بيانات الشيت */}
      <Card className="bg-slate-950 border-slate-800 shadow-2xl">
        <CardHeader className="p-6 border-b border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#e0b238]" aria-hidden="true" />
            <span>{isAr ? "كل الحقول من الشيت" : "All sheet fields"}</span>
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {employee.raw && Object.keys(employee.raw).length > 0 ? (
              Object.entries(employee.raw).map(([key, value]) => (
                <Detail key={key} label={key} value={value as string} />
              ))
            ) : (
              <p className="text-sm text-slate-500 col-span-full">
                {isAr ? "لا توجد حقول إضافية متاحة." : "No raw fields available."}
              </p>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}