import type { UserRole } from "@/types/user";

export const protectedRoutes: Record<string, UserRole[]> = {
  "/dashboard": ["Admin", "HR"],
  "/employees/current": ["Admin", "HR"],
  "/employees/former": ["Admin", "HR"],
  "/leaves": ["Admin", "HR"],
  "/settings/fields": ["Admin"],
  "/settings/users": ["Admin"],
  "/settings/import-export": ["Admin", "HR"],
  "/settings/general": ["Admin"],
  "/settings/audit-log": ["Admin"],
  "/me/profile": ["Admin", "HR", "Employee"],
  "/me/leaves": ["Admin", "HR", "Employee"],
  "/team": ["Admin", "HR", "Employee"],
  "/team/leaves": ["Admin", "HR", "Employee"],
  "/team/dashboard": ["Admin", "HR", "Employee"]
};

export function defaultRouteForRole(role: UserRole, isManager = false): string {
  if (role === "Admin" || role === "HR") return "/dashboard";
  if (isManager) return "/team";
  return "/me/profile";
}
