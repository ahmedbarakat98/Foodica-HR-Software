import { LoginForm } from "@/components/auth/LoginForm";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { appConfig } from "@/config/app.config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { normalizeLocale } from "@/lib/i18n/locale";
import Image from "next/image";
import Logo from "@/public/logo white.png";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);
  const t = getDictionary(locale);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#121212] via-[#1a1714] to-[#0d0d0d] p-4 text-white">
      <div className="absolute end-5 top-5">
        <LanguageSwitcher locale={locale} pathname="/login" />
      </div>
      <section className="w-full max-w-md rounded-2xl bg-[#1c1917]/80 p-8 shadow-2xl backdrop-blur-md border border-[#d4af37]/20">
        <div className="mb-6 text-center">
          {/* شعار F بالأصفر الذهبي والأسود */}
          <div className="flex text-center">
            <Image
              src={Logo}
              alt="لوجو شركه فوديكا" 
              height={200}
              width={200}
              className="text-center mx-auto mb-5"
            />
          </div>
          <p className="mt-1 text-sm font-semibold text-[#d4af37]">
            {t.subtitle}
          </p>
        </div>
        <LoginForm locale={locale} />
      </section>
    </main>
  );
}