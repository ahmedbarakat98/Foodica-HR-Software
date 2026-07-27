import * as XLSX from "xlsx";

import { EXCEL_PATH } from "@/lib/excel/workbook";
import { SHEETS } from "@/lib/excel/sheets";

import { mapEmployee } from "./map";

import type {
  EmployeeRecord,
  EmployeeStatus,
} from "@/types/employee";

type Row = Record<string, any>;

async function readEmployeesByStatus(
  status: EmployeeStatus
): Promise<EmployeeRecord[]> {

  const sheetName =
    status === "current"
      ? SHEETS.EMPLOYEES
      : SHEETS.FORMER_EMPLOYEES;
  const workbook = XLSX.readFile(EXCEL_PATH, {
    cellDates: true,
    raw: false,
  });

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<Row>(
    worksheet,
    {
      defval: "",
    }
  );

  return rows
    .map((row) => mapEmployee(row, status))
    .filter(
      (employee) =>
        employee.employeeCode?.trim() ||
        employee.name?.trim()
    );
}

export async function getCurrentEmployees() {
  return readEmployeesByStatus("current");
}

export async function getFormerEmployees() {
  return readEmployeesByStatus("former");
}

export async function getAllEmployees() {
  const [current, former] = await Promise.all([
    getCurrentEmployees(),
    getFormerEmployees(),
  ]);

  return [...current, ...former];
}

export async function getEmployeeByCode(
  employeeCode: string
) {
  const employees = await getAllEmployees();

  return (
    employees.find(
      (employee) =>
        employee.employeeCode === employeeCode
    ) ?? null
  );
}