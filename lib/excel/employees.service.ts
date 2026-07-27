import ExcelJS from "exceljs";
import { loadWorkbook, saveWorkbook, getSheetOrThrow } from "./workbook";

export type EmployeeRecord = {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  managerId: string;
  hireDate: string;
  status: string;
  location: string;
  shift: string;
  createdAt: string;
  updatedAt: string;
};

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function generateId() {
  return `EMP-${Date.now()}`;
}

export async function getAllEmployees(): Promise<EmployeeRecord[]> {
  const workbook = await loadWorkbook();
  const sheet = getSheetOrThrow(workbook, "employees");

  const rows = sheet.getRows(5, sheet.rowCount - 4) ?? [];

  return rows
    .map((row) => ({
      id: text(row.getCell(1).value),
      employeeCode: text(row.getCell(2).value),
      fullName: text(row.getCell(3).value),
      department: text(row.getCell(4).value),
      jobTitle: text(row.getCell(5).value),
      email: text(row.getCell(6).value),
      phone: text(row.getCell(7).value),
      managerId: text(row.getCell(8).value),
      hireDate: text(row.getCell(9).value),
      status: text(row.getCell(10).value),
      location: text(row.getCell(11).value),
      shift: text(row.getCell(12).value),
      createdAt: text(row.getCell(13).value),
      updatedAt: text(row.getCell(14).value),
    }))
    .filter((e) => e.id !== "");
}

export async function findEmployeeById(id: string) {
  const employees = await getAllEmployees();
  return employees.find((e) => e.id === id) ?? null;
}

export async function createEmployee(
  employee: Omit<EmployeeRecord, "id" | "createdAt" | "updatedAt">
) {
  const workbook = await loadWorkbook();
  const sheet = getSheetOrThrow(workbook, "employees");

  const now = new Date().toISOString();

  sheet.addRow([
    generateId(),
    employee.employeeCode,
    employee.fullName,
    employee.department,
    employee.jobTitle,
    employee.email,
    employee.phone,
    employee.managerId,
    employee.hireDate,
    employee.status,
    employee.location,
    employee.shift,
    now,
    now,
  ]);

  await saveWorkbook(workbook);

  return true;
}

export async function updateEmployee(
  id: string,
  data: Partial<EmployeeRecord>
) {
  const workbook = await loadWorkbook();
  const sheet = getSheetOrThrow(workbook, "employees");

  const rows = sheet.getRows(5, sheet.rowCount - 4) ?? [];

  for (const row of rows) {
    if (text(row.getCell(1).value) !== id) continue;

    if (data.employeeCode) row.getCell(2).value = data.employeeCode;
    if (data.fullName) row.getCell(3).value = data.fullName;
    if (data.department) row.getCell(4).value = data.department;
    if (data.jobTitle) row.getCell(5).value = data.jobTitle;
    if (data.email) row.getCell(6).value = data.email;
    if (data.phone) row.getCell(7).value = data.phone;
    if (data.managerId) row.getCell(8).value = data.managerId;
    if (data.hireDate) row.getCell(9).value = data.hireDate;
    if (data.status) row.getCell(10).value = data.status;
    if (data.location) row.getCell(11).value = data.location;
    if (data.shift) row.getCell(12).value = data.shift;

    row.getCell(14).value = new Date().toISOString();

    await saveWorkbook(workbook);

    return await findEmployeeById(id);
  }

  return null;
}

export async function deleteEmployee(id: string) {
  const workbook = await loadWorkbook();

  const employees = getSheetOrThrow(workbook, "employees");

  const rows = employees.getRows(5, employees.rowCount - 4) ?? [];

  for (const row of rows) {
    if (text(row.getCell(1).value) !== id) continue;

    const former = getSheetOrThrow(workbook, "former_employees");

    former.addRow([
      row.getCell(1).value,
      row.getCell(2).value,
      row.getCell(3).value,
      row.getCell(4).value,
      row.getCell(5).value,
      row.getCell(6).value,
      row.getCell(7).value,
      row.getCell(8).value,
      row.getCell(9).value,
      new Date().toISOString(),
      "Deleted",
      "",
      row.getCell(13).value,
      new Date().toISOString(),
    ]);

    employees.spliceRows(row.number, 1);

    await saveWorkbook(workbook);

    return true;
  }

  return false;
}