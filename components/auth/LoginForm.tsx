"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { LoginType } from "@/types/user";

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = getDictionary(locale);
  const [loginType, setLoginType] = useState<LoginType>("Employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
  setError("");

  startTransition(async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginType,
          identifier,
          password,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Login failed");
        return;
      }

      router.replace(`/${locale}${data.redirectTo ?? "/dashboard"}`);
    } catch {
      setError("Network error. Please try again.");
    }
  });
}

  const isEmployee = loginType === "Employee";

  return (
    <Card className="w-full max-w-md overflow-hidden bg-[#18181b]/90 border border-[#d4af37]/20 backdrop-blur-md shadow-2xl">
      <CardHeader className="flex flex-col justfy-center items-center">
        <h1 className="text-2xl font-black text-white">{t.login}</h1>
        <p className="mt-1 text-yellow-300 text-sm text-stone-400">{isEmployee ? t.employeeLogin : t.adminHrLogin}</p>
      </CardHeader>
      <CardContent>
        {/* زر التبديل بين نوع تسجيل الدخول */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#09090b] p-1.5 border border-white/5">
          <button
            type="button"
            onClick={() => setLoginType("Employee")}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
              isEmployee 
                ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20" 
                : "text-stone-400 hover:text-white"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setLoginType("HR")}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition-all ${
              !isEmployee 
                ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20" 
                : "text-stone-400 hover:text-white"
            }`}
          >
            Admin / HR
          </button>
        </div>

        {/* الحقول */}
        <label className="mb-3 block text-sm font-bold text-stone-300">
          {isEmployee ? t.employeeCode : t.username}
        </label>
        <Input 
          value={identifier} 
          onChange={(event) => setIdentifier(event.target.value)} 
          autoComplete="username"
          className="bg-[#09090b] border-stone-800 text-white placeholder:text-stone-500 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
        />

        <label className="mb-3 mt-4 block text-sm font-bold text-stone-300">
          {t.password}
        </label>
        <Input 
          value={password} 
          onChange={(event) => setPassword(event.target.value)} 
          type="password" 
          autoComplete="current-password"
          className="bg-[#09090b] border-stone-800 text-white placeholder:text-stone-500 focus:border-[#d4af37] focus:ring-[#d4af37]/20"
        />

        {/* رسالة الخطأ */}
        {error ? (
          <p className="mt-4 rounded-xl bg-red-950/50 border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400">
            {error}
          </p>
        ) : null}

        {/* زر الإرسال الذهبي */}
        <Button 
          onClick={submit} 
          disabled={pending || !identifier || !password} 
          className="mt-6 w-full bg-[#d4af37] text-black font-bold hover:bg-[#b8952b] active:scale-[0.99] disabled:bg-stone-800 disabled:text-stone-600 border-none shadow-lg shadow-[#d4af37]/15 transition-all"
        >
          {pending ? "..." : t.login}
        </Button>
      </CardContent>
    </Card>
  );
}