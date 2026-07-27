import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "green" | "red" | "slate" | "blue";
}

const tones = {
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-800"
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold", tones[tone], className)} {...props} />;
}
