import { sheetTabs } from "@/lib/google-sheets/ranges";
import { readSheetObjects } from "@/lib/google-sheets/read";
import { verifyPassword } from "./password";
import type { AppUser, LoginType, SafeSessionUser } from "@/types/user";

type UserRow = Record<string, string>;

function mapUser(row: UserRow): AppUser {
  return {
    userId: row["User ID"] || row["userId"] || "",
    loginType: (row["Login Type"] || row["loginType"] || "Employee") as LoginType,
    username: row["Username"] || row["username"] || undefined,
    employeeCode: row["Employee Code"] || row["employeeCode"] || undefined,
    passwordHash: row["Password Hash"] || row["passwordHash"] || "",
    role: (row["Role"] || row["role"] || "Employee") as AppUser["role"],
    isManager: ["yes", "true", "1"].includes((row["Is Manager"] || row["isManager"] || "").toLowerCase()),
    managedScope: row["Managed Scope"] || row["managedScope"] || undefined,
    status: (row["Status"] || row["status"] || "Inactive") as AppUser["status"],
    lastLogin: row["Last Login"] || row["lastLogin"] || undefined
  };
}

export async function authenticate(input: {
  loginType: LoginType;
  identifier: string;
  password: string;
}): Promise<SafeSessionUser | null> {
  const rows = await readSheetObjects<UserRow>(sheetTabs.users);
  const users = rows.map(mapUser);
  const normalizedIdentifier = input.identifier.trim().toLowerCase();

  const user = users.find((candidate) => {
    if (candidate.status !== "Active") return false;
    if (input.loginType === "Employee") {
      return candidate.employeeCode?.trim().toLowerCase() === normalizedIdentifier;
    }
    return candidate.username?.trim().toLowerCase() === normalizedIdentifier;
  });

  if (!user || !verifyPassword(input.password, user.passwordHash)) return null;

  return {
    userId: user.userId,
    role: user.role,
    loginType: user.loginType,
    username: user.username,
    employeeCode: user.employeeCode,
    isManager: user.isManager,
    managedScope: user.managedScope
  };
}
