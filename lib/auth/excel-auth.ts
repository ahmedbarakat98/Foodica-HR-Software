import path from "path";
import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";
import { verifyPassword as verifyScryptPassword } from "@/lib/auth/password";
import type { AppUser, LoginType, SafeSessionUser } from "@/types/user";

type Row = Record<string, unknown>;

const DEFAULT_ADMIN: SafeSessionUser = {
  userId: "admin-default-id",
  role: "Admin",
  loginType: "Admin",
  username: "admin",
  isManager: true,
};

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function pick(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    const text = cellText(value);

    if (text) return text;
  }

  return "";
}

function toBoolean(value: unknown): boolean {
  const text = cellText(value).toLowerCase();

  return ["true", "1", "yes", "active", "نشط", "فعال"].includes(text);
}

function normalizeRole(role: string): AppUser["role"] {
  if (role === "Admin" || role === "HR" || role === "Employee") {
    return role;
  }

  return "Employee";
}

function normalizeLoginType(loginType: string): LoginType {
  if (loginType === "Admin" || loginType === "HR" || loginType === "Employee") {
    return loginType;
  }

  return "Employee";
}

function normalizeStatus(statusValue: string): AppUser["status"] {
  const status = statusValue.trim().toLowerCase();

  if (["active", "true", "1", "yes", "نشط", "فعال"].includes(status)) {
    return "Active";
  }

  return "Inactive";
}

function readUsersFromExcel(): AppUser[] {
  const filePath = path.join(process.cwd(), "lib", "data.xlsx");

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    raw: false,
  });

  const sheetName =
    workbook.SheetNames.find((name) =>
      ["users", "authentication", "auth", "login"].includes(name.toLowerCase()),
    ) ?? workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error("No worksheet found in lib/data.xlsx");
  }

  const rows = XLSX.utils.sheet_to_json<Row>(worksheet, {
    defval: "",
  });

  return rows
    .map((row): AppUser => {
      const loginType = normalizeLoginType(
        pick(row, "Login Type", "loginType", "نوع الدخول"),
      );

      const role = normalizeRole(
        pick(row, "Role", "role", "الصلاحية", "الدور"),
      );

      const statusText = pick(row, "Status", "status", "الحالة");

      return {
        userId:
          pick(row, "User ID", "userId", "id", "ID", "كود المستخدم") ||
          pick(row, "Employee Code", "employeeCode", "الكود الوظيفي", "كود الموظف") ||
          pick(row, "Username", "username", "اسم المستخدم"),
        loginType,
        username: pick(row, "Username", "username", "اسم المستخدم") || undefined,
        employeeCode:
          pick(row, "Employee Code", "employeeCode", "الكود الوظيفي", "كود الموظف") ||
          undefined,
        passwordHash: pick(
          row,
          "Password Hash",
          "passwordHash",
          "Password",
          "password",
          "كلمة المرور",
        ),
        role,
        isManager: toBoolean(
          pick(row, "Is Manager", "isManager", "Manager", "مدير"),
        ),
        managedScope:
          pick(row, "Managed Scope", "managedScope", "نطاق الإدارة") || undefined,
        status: normalizeStatus(statusText || "Active"),
        lastLogin: pick(row, "Last Login", "lastLogin", "آخر دخول") || undefined,
      };
    })
    .filter((user) => user.userId && user.passwordHash);
}

async function checkPassword(
  password: string,
  storedPassword: string,
): Promise<boolean> {
  if (!storedPassword) return false;

  try {
    if (storedPassword.startsWith("scrypt:")) {
      return verifyScryptPassword(password, storedPassword);
    }

    if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
      return bcrypt.compare(password, storedPassword);
    }

    return password === storedPassword;
  } catch {
    return false;
  }
}

export async function authenticate(input: {
  loginType: LoginType;
  identifier: string;
  password: string;
}): Promise<SafeSessionUser | null> {
  const identifier = input.identifier.trim().toLowerCase();
  const password = input.password;

  // دخول ثابت للأدمن بدون قراءة ملف Excel
  if (identifier === "admin" && password === "admin") {
    return DEFAULT_ADMIN;
  }

  const users = readUsersFromExcel();

  const user = users.find((candidate) => {
    if (candidate.status !== "Active") return false;

    if (input.loginType === "Employee") {
      return candidate.employeeCode?.trim().toLowerCase() === identifier;
    }

    return candidate.username?.trim().toLowerCase() === identifier;
  });

  if (!user) return null;

  const validPassword = await checkPassword(password, user.passwordHash);

  if (!validPassword) return null;

  return {
    userId: user.userId,
    role: user.role,
    loginType: user.loginType,
    username: user.username,
    employeeCode: user.employeeCode,
    isManager: user.isManager,
    managedScope: user.managedScope,
  };
}