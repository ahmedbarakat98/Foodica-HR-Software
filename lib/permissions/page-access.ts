import { protectedRoutes } from "@/config/routes.config";
import type { SafeSessionUser } from "@/types/user";

export function canAccessPage(pathname: string, user: SafeSessionUser | null): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";
  const allowedRoles = Object.entries(protectedRoutes).find(([route]) => pathWithoutLocale.startsWith(route))?.[1];
  if (!allowedRoles) return true;
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
