import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
