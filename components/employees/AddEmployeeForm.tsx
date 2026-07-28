"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type AddEmployeeFormProps = {
  locale: string;
};

type FormState = {
  employeeCode: string;
  fullName: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  managerId: string;
  hireDate: string;
  status: string;
  location: string;
  shift: string;
};

const initialForm: FormState = {
  employeeCode: "",
  fullName: "",
  department: "",
  jobTitle: "",
  email: "",
  phone: "",
  managerId: "",
  hireDate: "",
  status: "current",
  location: "",
  shift: "",
};

export function AddEmployeeForm({ locale }: AddEmployeeFormProps) {
  const router = useRouter();
  const isAr = locale === "ar";

  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setError("");
    setSuccess("");
  }

  function submitEmployee() {
    setError("");
    setSuccess("");

    if (!form.fullName.trim()) {
      setError(isAr ? "اسم الموظف مطلوب" : "Employee name is required");
      return;
    }

    if (!form.employeeCode.trim()) {
      setError(isAr ? "كود الموظف مطلوب" : "Employee code is required");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message ?? (isAr ? "فشل إضافة الموظف" : "Failed to add employee"));
          return;
        }

        setSuccess(isAr ? "تم إضافة الموظف بنجاح" : "Employee added successfully");

        window.setTimeout(() => {
          router.push(`/${locale}/employees/current`);
          router.refresh();
        }, 700);
      } catch {
        setError(isAr ? "حدث خطأ في الاتصال" : "Network error");
      }
    });
  }

  return (
    <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e0b238] text-slate-950 shadow-lg shadow-amber-500/10">
              <UserPlus className="h-6 w-6" />
            </span>
            {isAr ? "إضافة موظف جديد" : "Add New Employee"}
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-400">
            {isAr
              ? "أدخل بيانات الموظف وسيتم حفظها مباشرة داخل ملف Excel."
              : "Enter employee details and save them directly to the Excel database."}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/${locale}/employees/current`)}
          className="self-start border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white md:self-auto"
        >
          <ArrowRight className="h-4 w-4" />
          <span className="ms-2">{isAr ? "رجوع للموظفين" : "Back to Employees"}</span>
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#e0b238] via-amber-500 to-amber-700" />

        <CardHeader className="border-b border-slate-800/80 p-6">
          <h2 className="text-lg font-bold text-white">
            {isAr ? "بيانات الموظف الأساسية" : "Employee Basic Information"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isAr ? "الحقول المطلوبة: الاسم والكود الوظيفي." : "Required fields: name and employee code."}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label={isAr ? "كود الموظف" : "Employee Code"} required>
              <Input
                value={form.employeeCode}
                onChange={(event) => updateField("employeeCode", event.target.value)}
                placeholder="EMP001"
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "اسم الموظف" : "Full Name"} required>
              <Input
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder={isAr ? "مثال: أحمد محمد" : "Example: Ahmed Mohamed"}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "القسم" : "Department"}>
              <Input
                value={form.department}
                onChange={(event) => updateField("department", event.target.value)}
                placeholder={isAr ? "مثال: الحسابات" : "Example: Finance"}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "الوظيفة" : "Job Title"}>
              <Input
                value={form.jobTitle}
                onChange={(event) => updateField("jobTitle", event.target.value)}
                placeholder={isAr ? "مثال: محاسب" : "Example: Accountant"}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "البريد الإلكتروني" : "Email"}>
              <Input
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                type="email"
                placeholder="employee@foodica.com"
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "رقم الهاتف" : "Phone"}>
              <Input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="01000000000"
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "كود المدير" : "Manager ID"}>
              <Input
                value={form.managerId}
                onChange={(event) => updateField("managerId", event.target.value)}
                placeholder="MGR001"
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "تاريخ التعيين" : "Hiring Date"}>
              <Input
                value={form.hireDate}
                onChange={(event) => updateField("hireDate", event.target.value)}
                type="date"
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "الفرع / المكان" : "Location / Branch"}>
              <Input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder={isAr ? "مثال: القاهرة" : "Example: Cairo"}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "الشيفت" : "Shift"}>
              <Input
                value={form.shift}
                onChange={(event) => updateField("shift", event.target.value)}
                placeholder={isAr ? "مثال: صباحي" : "Example: Morning"}
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-[#e0b238]"
              />
            </Field>

            <Field label={isAr ? "الحالة" : "Status"}>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-[#e0b238]"
              >
                <option value="current">{isAr ? "حالي" : "Current"}</option>
                <option value="former">{isAr ? "سابق" : "Former"}</option>
              </select>
            </Field>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm font-semibold text-emerald-300">
              {success}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              disabled={pending}
              className="border border-slate-800 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              {isAr ? "مسح البيانات" : "Reset"}
            </Button>

            <Button
              type="button"
              onClick={submitEmployee}
              disabled={pending}
              className="bg-[#e0b238] font-bold text-slate-950 hover:bg-[#c99e2e]"
            >
              <Save className="h-4 w-4" />
              <span className="ms-2">
                {pending ? (isAr ? "جاري الحفظ..." : "Saving...") : isAr ? "حفظ الموظف" : "Save Employee"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
        {required ? <span className="ms-1 text-[#e0b238]">*</span> : null}
      </span>
      {children}
    </label>
  );
}