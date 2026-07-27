import Link from "next/link";

export function LanguageSwitcher({ locale, pathname = "/login" }: { locale: string; pathname?: string }) {
  const other = locale === "ar" ? "en" : "ar";
  const normalizedPath = pathname.replace(/^\/(ar|en)/, "") || "/login";

  return (
    <Link
      href={`/${other}${normalizedPath}`}
      className="rounded-full border border-[#D4A338] bg-transparent px-4 py-1.5 text-xs font-bold text-[#D4A338] transition-all duration-300 hover:bg-[#D4A338] hover:text-black"
    >
      {other.toUpperCase()}
    </Link>
  );
}