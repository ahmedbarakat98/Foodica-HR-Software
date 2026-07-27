import type { UserRole } from "@/types/user";

export const roleRank: Record<UserRole, number> = {
  Employee: 1,
  HR: 2,
  Admin: 3
};

export function canAccessRole(userRole: UserRole, allowed: UserRole[]): boolean {
  return allowed.includes(userRole);
}
