"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { appConfig } from "@/config/app.config";

export function SplashScreen({ locale = "ar" }: { locale?: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(`/${locale}/login`);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [locale, router]);

  return (
    <main className="loader-container">
      <section className="text-center">
        <Image
          src="/logo white.png"
          alt="Foodica Logo"
          width={200}
          height={200}
          className="animate-heartbeat"
          priority
        />

        <p className="mt-4 text-sm font-semibold text-[#d4af37]">
          {locale === "ar" ? appConfig.subtitleAr : appConfig.subtitleEn}
        </p>
      </section>
    </main>
  );
}