"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from "@/config/app.config";

export function SplashScreen({ locale = "ar" }: { locale?: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => router.replace(`/${locale}/login`), appConfig.splashDurationMs);
    return () => window.clearTimeout(timer);
  }, [locale, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <section className="text-center">
        <div className="foodica-pulse mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-brand-600 text-5xl font-black text-white shadow-soft">F</div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">Foodica HR</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">{locale === "ar" ? appConfig.subtitleAr : appConfig.subtitleEn}</p>
      </section>
    </main>
  );
}
