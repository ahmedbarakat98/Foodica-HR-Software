import path from "path";
import * as XLSX from "xlsx";
import { getOrSetCache } from "@/lib/cache/memory-cache";
import { mapEmployee } from "./map";
import type { EmployeeRecord, EmployeeStatus } from "@/types/employee";
import { clearCache } from "@/lib/cache/memory-cache";

clearCache();

const CACHE_TTL_MS = 60_000;

type Row = Record<string, any>;

/**
 * دالة لقراءة البيانات من ملف Excel المحلي بدلاً من Google Sheets
 */
async function readEmployeesByStatus(status: EmployeeStatus): Promise<EmployeeRecord[]> {
  // تحديد اسم الشيت بناءً على حالة الموظف
  const sheetName = status === "current" ? "Employees_Current" : "Employees_Former";

  try {
    const filePath = path.join(process.cwd(), "lib", "data.xlsx");
    
    // قراءة الملف وتحويل التواريخ بشكل صحيح
    const workbook = XLSX.readFile(filePath, { cellDates: true, raw: false });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      console.warn(`Warning: Sheet "${sheetName}" was not found in data.xlsx.`);
      return [];
    }

    // تحويل الصفوف إلى JSON
    const rows = XLSX.utils.sheet_to_json<Row>(worksheet, { defval: "" });

    // تحويل كل صف وتصفية الصفوف الفارغة
    return rows
      .map((row) => mapEmployee(row, status))
      .filter((employee) => employee.employeeCode || employee.name);
  } catch (error) {
    console.error(`Error reading Excel sheet "${sheetName}":`, error);
    return [];
  }
}

export async function getCurrentEmployees(): Promise<EmployeeRecord[]> {
  return getOrSetCache("employees:current", CACHE_TTL_MS, () => readEmployeesByStatus("current"));
}

export async function getFormerEmployees(): Promise<EmployeeRecord[]> {
  return getOrSetCache("employees:former", CACHE_TTL_MS, () => readEmployeesByStatus("former"));
}

export async function getAllEmployees(): Promise<EmployeeRecord[]> {
  const [current, former] = await Promise.all([getCurrentEmployees(), getFormerEmployees()]);
  return [...current, ...former];
}

export async function getEmployeeByCode(employeeCode: string): Promise<EmployeeRecord | null> {
  const employees = await getAllEmployees();
  return employees.find((employee) => employee.employeeCode === employeeCode) ?? null;
}