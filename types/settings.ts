export interface AppSettings {
  appName: string;
  subtitleAr: string;
  subtitleEn: string;
  defaultLocale: "ar" | "en";
  primaryColor: string;
  secondaryColor: string;
  splashDurationMs: number;
  themeMode: "light" | "dark" | "system";
}
