import type { AppSettings } from "@/types/settings";

export const appConfig: AppSettings = {
  appName: "Foodica HR",
  subtitleAr: "بوابة إدارة الموارد البشرية",
  subtitleEn: "Human Resources Management Portal",
  defaultLocale: "ar",
  primaryColor: "#D4AF37",    
  secondaryColor: "#121212",  
  splashDurationMs: 1500,
  themeMode: "dark"         
};

export const supportedLocales = ["ar", "en"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
