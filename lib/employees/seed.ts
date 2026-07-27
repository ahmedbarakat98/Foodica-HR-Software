import path from "path";
import * as XLSX from "xlsx";
import type { EmployeeRecord } from "@/types/employee";
import { mapEmployee } from "./map"; // تأكد من ضبط المسار الصحيح لدالة mapEmployee

type Row = Record<string, any>;

/**
 * دالة لقراءة شيت من ملف data.xlsx وتحويل الصفوف إلى EmployeeRecord
 */
function getEmployeesFromSheet(sheetName: string, status: "current" | "former"): EmployeeRecord[] {
  try {
    const filePath = path.join(process.cwd(), "lib", "data.xlsx");
    const workbook = XLSX.readFile(filePath, { cellDates: true, raw: false });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      console.warn(`Warning: Sheet "${sheetName}" not found in file.`);
      return [];
    }

    const rows = XLSX.utils.sheet_to_json<Row>(worksheet, { defval: "" });

    // تصفية الصفوف الفارغة وتحويل باقي الصفوف إلى EmployeeRecord
    return rows
      .filter((row) => {
        const name = row["الاسم"] || row["Name"];
        const code = row["الكود الوظيفي"] || row["Employee Code"];
        return (name && String(name).trim() !== "") || (code && String(code).trim() !== "");
      })
      .map((row) => mapEmployee(row, status as any));
  } catch (error) {
    console.error(`Error loading sheet "${sheetName}":`, error);
    return [];
  }
}

// جلب الموظفين من الشيتين
const currentEmployees = getEmployeesFromSheet("Employees_Current", "current");
const formerEmployees = getEmployeesFromSheet("Employees_Former", "former");

// إرجاع كافة الموظفين مباشرة من شيتات الإكسيل
export const seedEmployees: EmployeeRecord[] = [
  ...currentEmployees,
  ...formerEmployees
];