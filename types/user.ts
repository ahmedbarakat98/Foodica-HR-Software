export type UserRole = "Admin" | "HR" | "Employee";
export type LoginType = "Admin" | "HR" | "Employee";
export type UserStatus = "Active" | "Inactive";

export interface AppUser {
  userId: string;
  loginType: LoginType;
  username?: string;
  employeeCode?: string;
  passwordHash: string;
  role: UserRole;
  isManager: boolean;
  managedScope?: string;
  status: UserStatus;
  lastLogin?: string;
}

export interface SafeSessionUser {
  userId: string;
  role: UserRole;
  loginType: LoginType;
  username?: string;
  employeeCode?: string;
  isManager: boolean;
  managedScope?: string;
}
