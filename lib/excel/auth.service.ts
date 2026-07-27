
import bcrypt from "bcryptjs";
import { getSheetOrThrow, loadWorkbook } from "./workbook";

export type AuthUser = {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt?: string | null;
};

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    return ["true", "1", "yes", "active"].includes(value.trim().toLowerCase());
  }
  return false;
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export async function findUserByUsername(
  username: string,
): Promise<AuthUser | null> {
  const workbook = await loadWorkbook();
  const sheet = getSheetOrThrow(workbook, "authentication");

  const rows = sheet.getRows(5, Math.max(sheet.rowCount - 4, 0)) ?? [];

  for (const row of rows) {
    const rowUsername = cellText(row.getCell(2).value).trim();

    if (rowUsername.toLowerCase() === username.trim().toLowerCase()) {
      return {
        id: cellText(row.getCell(1).value),
        username: rowUsername,
        passwordHash: cellText(row.getCell(3).value),
        role: cellText(row.getCell(4).value),
        isActive: toBoolean(row.getCell(5).value),
        lastLogin: cellText(row.getCell(6).value) || null,
        createdAt: cellText(row.getCell(7).value) || null,
      };
    }
  }

  return null;
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
) {
  return bcrypt.compare(plainPassword, passwordHash);
}