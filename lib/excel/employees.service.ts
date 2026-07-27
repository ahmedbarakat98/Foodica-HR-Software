import * as XLSX from "xlsx";
import { EXCEL_PATH } from "@/lib/excel/workbook";
import { SHEETS } from "@/lib/excel/sheets";

export type ExcelEmployeeRecord = {
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

type Row = Record<string, unknown>;

const EMPLOYEE_HEADERS = [
  "ID",
  "Employee Code",
  "Name",
  "Department",
  "Job Title",
  "Email",
  "Phone",
  "Manager ID",
  "Hiring Date",
  "Status",
  "Location",
  "Shift",
  "Created At",
  "Updated At",
];

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function pick(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    const result = text(value);

    if (result) return result;
  }

  return "";
}

function generateId() {
  return `EMP-${Date.now()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readWorkbook() {
  return XLSX.readFile(EXCEL_PATH, {
    cellDates: true,
    raw: false,
  });
}

function ensureSheet(workbook: XLSX.WorkBook, sheetName: string) {
  let worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    worksheet = XLSX.utils.aoa_to_sheet([EMPLOYEE_HEADERS]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return worksheet;
}

function getRows(workbook: XLSX.WorkBook, sheetName: string): Row[] {
  const worksheet = ensureSheet(workbook, sheetName);

  return XLSX.utils.sheet_to_json<Row>(worksheet, {
    defval: "",
  });
}

function saveRows(workbook: XLSX.WorkBook, sheetName: string, rows: Row[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: EMPLOYEE_HEADERS,
  });

  workbook.Sheets[sheetName] = worksheet;
}

function rowToEmployee(row: Row): ExcelEmployeeRecord {
  return {
    id: pick(row, "ID", "id"),
    employeeCode: pick(row, "Employee Code", "employeeCode", "الكود الوظيفي", "كود الموظف"),
    fullName: pick(row, "Name", "Full Name", "fullName", "الاسم"),
    department: pick(row, "Department", "department", "القسم"),
    jobTitle: pick(row, "Job Title", "jobTitle", "الوظيفة", "الوظيفه"),
    email: pick(row, "Email", "email", "الايميل", "الإيميل"),
    phone: pick(row, "Phone", "phone", "رقم الهاتف", "رقم التليفون"),
    managerId: pick(row, "Manager ID", "managerId", "كود المدير"),
    hireDate: pick(row, "Hiring Date", "Hire Date", "hireDate", "تاريخ التعيين"),
    status: pick(row, "Status", "status", "الحالة") || "current",
    location: pick(row, "Location", "location", "الفرع"),
    shift: pick(row, "Shift", "shift", "الشيفت"),
    createdAt: pick(row, "Created At", "createdAt"),
    updatedAt: pick(row, "Updated At", "updatedAt"),
  };
}

function employeeToRow(employee: ExcelEmployeeRecord): Row {
  return {
    "ID": employee.id,
    "Employee Code": employee.employeeCode,
    "Name": employee.fullName,
    "Department": employee.department,
    "Job Title": employee.jobTitle,
    "Email": employee.email,
    "Phone": employee.phone,
    "Manager ID": employee.managerId,
    "Hiring Date": employee.hireDate,
    "Status": employee.status,
    "Location": employee.location,
    "Shift": employee.shift,
    "Created At": employee.createdAt,
    "Updated At": employee.updatedAt,
  };
}

export async function getAllEmployees(): Promise<ExcelEmployeeRecord[]> {
  const workbook = readWorkbook();
  const rows = getRows(workbook, SHEETS.EMPLOYEES);

  return rows
    .map(rowToEmployee)
    .filter((employee) => employee.id || employee.employeeCode || employee.fullName);
}

export async function findEmployeeById(id: string): Promise<ExcelEmployeeRecord | null> {
  const employees = await getAllEmployees();

  return (
    employees.find((employee) => employee.id === id || employee.employeeCode === id) ??
    null
  );
}

export async function createEmployee(
  employee: Omit<ExcelEmployeeRecord, "id" | "createdAt" | "updatedAt">,
): Promise<ExcelEmployeeRecord> {
  const workbook = readWorkbook();
  const rows = getRows(workbook, SHEETS.EMPLOYEES);

  const createdAt = nowIso();

  const newEmployee: ExcelEmployeeRecord = {
    id: generateId(),
    ...employee,
    createdAt,
    updatedAt: createdAt,
  };

  rows.push(employeeToRow(newEmployee));

  saveRows(workbook, SHEETS.EMPLOYEES, rows);
  XLSX.writeFile(workbook, EXCEL_PATH);

  return newEmployee;
}

export async function updateEmployee(
  id: string,
  data: Partial<ExcelEmployeeRecord>,
): Promise<ExcelEmployeeRecord | null> {
  const workbook = readWorkbook();
  const rows = getRows(workbook, SHEETS.EMPLOYEES);

  const index = rows.findIndex((row) => {
    const employee = rowToEmployee(row);
    return employee.id === id || employee.employeeCode === id;
  });

  if (index === -1) return null;

  const currentEmployee = rowToEmployee(rows[index]);

  const updatedEmployee: ExcelEmployeeRecord = {
    ...currentEmployee,
    ...data,
    id: currentEmployee.id,
    updatedAt: nowIso(),
  };

  rows[index] = employeeToRow(updatedEmployee);

  saveRows(workbook, SHEETS.EMPLOYEES, rows);
  XLSX.writeFile(workbook, EXCEL_PATH);

  return updatedEmployee;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const workbook = readWorkbook();

  const currentRows = getRows(workbook, SHEETS.EMPLOYEES);
  const formerRows = getRows(workbook, SHEETS.FORMER_EMPLOYEES);

  const index = currentRows.findIndex((row) => {
    const employee = rowToEmployee(row);
    return employee.id === id || employee.employeeCode === id;
  });

  if (index === -1) return false;

  const deletedEmployee = rowToEmployee(currentRows[index]);

  currentRows.splice(index, 1);

  formerRows.push(
    employeeToRow({
      ...deletedEmployee,
      status: "former",
      updatedAt: nowIso(),
    }),
  );

  saveRows(workbook, SHEETS.EMPLOYEES, currentRows);
  saveRows(workbook, SHEETS.FORMER_EMPLOYEES, formerRows);

  XLSX.writeFile(workbook, EXCEL_PATH);

  return true;
}