import path from "path";
import * as XLSX from "xlsx";
import { mapEmployee } from "./map";
import type { EmployeeRecord, EmployeeStatus } from "@/types/employee";

type Row = Record<string, any>;

async function readEmployeesByStatus(
  status: EmployeeStatus
): Promise<EmployeeRecord[]> {
  const sheetName =
    status === "current" ? "Employees_Current" : "Employees_Former";

  const filePath = path.join(process.cwd(), "lib", "data.xlsx");

  console.log("\n====================================");
  console.log("Status:", status);
  console.log("Excel Path:", filePath);

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    raw: false,
  });

  console.log("Available Sheets:", workbook.SheetNames);

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.error("Sheet Not Found:", sheetName);
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<Row>(worksheet, {
    defval: "",
  });

  console.log("Rows Count:", rows.length);

  if (rows.length > 0) {
    console.log("====================================");
    console.log("COLUMN NAMES:");
    console.log(Object.keys(rows[0]));

    console.log("====================================");
    console.log("FIRST RAW ROW:");
    console.dir(rows[0], { depth: null });
  }

  const mapped = rows.map((row) => mapEmployee(row, status));

  console.log("====================================");
  console.log("Mapped Count:", mapped.length);

  if (mapped.length > 0) {
    console.log("FIRST MAPPED EMPLOYEE:");
    console.dir(mapped[0], { depth: null });
  }

  const filtered = mapped.filter(
    (employee) =>
      employee.employeeCode?.trim() ||
      employee.name?.trim()
  );

  console.log("Filtered Count:", filtered.length);
  console.log("====================================\n");

  return filtered;
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

export async function getEmployeeByCode(employeeCode: string) {
  const employees = await getAllEmployees();

  return (
    employees.find((e) => e.employeeCode === employeeCode) ?? null
  );
}