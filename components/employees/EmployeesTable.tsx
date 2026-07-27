"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, Table as TableIcon } from "lucide-react";
import type { EmployeeRecord } from "@/types/employee";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";

export function EmployeesTable({ employees, locale }: { employees: EmployeeRecord[]; locale: string }) {
  const t = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  const isAr = locale === "ar";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((employee) => {
      const haystack = [
        employee.name, 
        employee.employeeCode, 
        employee.jobTitle, 
        employee.administration, 
        employee.department, 
        employee.branch
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [employees, query]);

  return (
    <div className="space-y-5" dir={isAr ? "rtl" : "ltr"}>
      {/* شريط البحث وزر التبديل */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* مربع البحث المتوافق مع المظهر الداكن */}
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute start-3 top-3.5 h-4 w-4 text-slate-400" />
          <Input 
            className="ps-10 bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-[#e0b238] focus:ring-[#e0b238]/20 rounded-xl" 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder={t.search} 
          />
        </div>

        {/* أزرار طريقة العرض */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 self-start md:self-auto">
          <Button 
            variant={view === "table" ? "primary" : "ghost"} 
            onClick={() => setView("table")}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
              view === "table" 
                ? "bg-[#e0b238] text-slate-950 hover:bg-[#c99e2e]" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <TableIcon className="h-4 w-4" />
            <span>{t.tableView}</span>
          </Button>
          <Button 
            variant={view === "cards" ? "primary" : "ghost"} 
            onClick={() => setView("cards")}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
              view === "cards" 
                ? "bg-[#e0b238] text-slate-950 hover:bg-[#c99e2e]" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{t.cardsView}</span>
          </Button>
        </div>
      </div>

      {/* عرض جدول أو كروت */}
      {view === "table" ? (
        <Card className="overflow-hidden bg-slate-950 border-slate-800 shadow-2xl rounded-2xl">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-start">#</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الكود" : "Code"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الوظيفة" : "Job"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الإدارة" : "Administration"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "القسم" : "Department"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الفرع" : "Branch"}</th>
                  <th className="px-4 py-3.5 text-start">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.length > 0 ? (
                  filtered.map((employee, index) => (
                    <tr 
                      key={`${employee.status}-${employee.employeeCode}-${index}`} 
                      className="hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{index + 1}</td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        <Link 
                          href={`/${locale}/employees/${employee.employeeCode}`} 
                          className="hover:text-[#e0b238] transition-colors"
                        >
                          {employee.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-[#e0b238]">{employee.employeeCode}</td>
                      <td className="px-4 py-3.5">{employee.jobTitle ?? "-"}</td>
                      <td className="px-4 py-3.5">{employee.administration ?? "-"}</td>
                      <td className="px-4 py-3.5">{employee.department ?? "-"}</td>
                      <td className="px-4 py-3.5">{employee.branch ?? "-"}</td>
                      <td className="px-4 py-3.5">
                        <EmployeeStatusBadge status={employee.status} locale={locale} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-500">
                      {isAr ? "لا يوجد موظفون مطابقون للبحث" : "No matching employees found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((employee) => (
              <Card 
                key={`${employee.status}-${employee.employeeCode}`}
                className="bg-slate-950 border-slate-800/80 hover:border-slate-700 transition-all duration-200 shadow-xl rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div>
                      <Link 
                        href={`/${locale}/employees/${employee.employeeCode}`} 
                        className="text-base font-extrabold text-white hover:text-[#e0b238] transition-colors line-clamp-1"
                      >
                        {employee.name}
                      </Link>
                      <p className="mt-1 text-xs font-mono font-semibold text-[#e0b238]">
                        {employee.employeeCode}
                      </p>
                    </div>
                    <EmployeeStatusBadge status={employee.status} locale={locale} />
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-slate-400">
                    <p className="flex justify-between">
                      <span className="font-bold text-slate-500">{isAr ? "الوظيفة:" : "Job:"}</span>
                      <span className="text-slate-200 font-semibold">{employee.jobTitle ?? "-"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold text-slate-500">{isAr ? "الإدارة:" : "Administration:"}</span>
                      <span className="text-slate-200 font-semibold">{employee.administration ?? "-"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold text-slate-500">{isAr ? "الفرع:" : "Branch:"}</span>
                      <span className="text-slate-200 font-semibold">{employee.branch ?? "-"}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center py-10 text-slate-500 col-span-full">
              {isAr ? "لا يوجد موظفون مطابقون للبحث" : "No matching employees found"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}