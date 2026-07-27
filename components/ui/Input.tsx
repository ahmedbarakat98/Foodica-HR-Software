import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
        className
      )}
      {...props}
    />
  );
}
