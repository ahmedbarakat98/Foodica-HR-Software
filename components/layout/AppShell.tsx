"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  CalendarDays,
  LayoutDashboard,
  Settings,
  UserMinus,
  LogOut,
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Image from "next/image";
import Logo from "@/public/logo white.png";

export function AppShell({ 
  locale, 
  children,
  className 
}: { 
  locale: string; 
  children: React.ReactNode;
  className?: string;
}) {
  const t = getDictionary(locale);
  const router = useRouter();
  const isAr = locale === "ar";

  const nav = [
    { href: `/${locale}/dashboard`, label: t.dashboard, icon: LayoutDashboard },
    { href: `/${locale}/employees/current`, label: t.currentEmployees, icon: Users },
    { href: `/${locale}/employees/former`, label: t.formerEmployees, icon: UserMinus },
    { href: `/${locale}/leaves`, label: t.leaves, icon: CalendarDays },
    { href: `/${locale}/settings/fields`, label: t.settings, icon: Settings },
    { href: `/${locale}/employees/add`, label: locale === "ar" ? "إضافة موظف" : "Add Employee",icon: UserPlus,},
  ];

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    // يمكنك إضافة منطق مسح الـ Cookie أو Auth Session هنا إذا لزم الأمر
    // e.g., await signOut() or fetch('/api/auth/logout')
    
    router.push(`/${locale}/login`);
  };

  return (
    /* خلفية التطبيق كاملة باللون الأسود الفاخر bg-slate-950 */
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${className || ''}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* القائمة الجانبية باللون الأسود العميق الداكن bg-black مع حدود ناعمة */}
      <aside className="fixed inset-y-0 hidden w-72 border-e border-slate-800/80 bg-black p-5 lg:flex lg:flex-col lg:justify-between text-white shadow-2xl z-50">
        
        <div>
          {/* اللوجو والعنوان */}
          <div className="mb-8 flex items-center justify-between border-b border-slate-800/80 pb-5">
            <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 group">
              <Image
                src={Logo}
                alt="لوجو شركه فوديكا" 
                height={42}
                width={42}
                className="object-contain"
              />
              <div>
                <div className="font-black text-white text-base tracking-wide flex items-center gap-1">
                  FOODICA <span className="text-[#e0b238]">HR</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{t.subtitle}</div>
              </div>
            </Link>
            
            <div className="rounded-lg p-1">
              <LanguageSwitcher locale={locale} pathname="/dashboard" />
            </div>
          </div>

          {/* عناصر التنقل Nav Links */}
          <nav>
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition-all duration-200 hover:bg-slate-900 hover:text-[#e0b238] active:scale-95 group"
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#e0b238] transition-colors" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* الجزء السفلي: زر تسجيل الخروج + كارت الشركة */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          {/* زر تسجيل الخروج */}
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200 group active:scale-95 border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="h-5 w-5 text-rose-400/80 group-hover:text-rose-300 transition-colors" />
            <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
          </button>

          {/* كارت حقوق النظام السفلي */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 border border-slate-800/80 text-center">
            <p className="text-xs font-semibold text-slate-400">Foodica Distribution</p>
            <p className="text-[10px] text-[#e0b238] mt-0.5">HR Management System</p>
          </div>
        </div>

      </aside>

      {/* المحتوى الرئيسي للموقع */}
      <main className="lg:ps-72 transition-all duration-300 bg-slate-950 min-h-screen">
        <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
