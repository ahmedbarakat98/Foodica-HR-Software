import path from "path";
import ExcelJS from "exceljs";

export const EXCEL_PATH = path.join(
  process.cwd(),
  "lib",
  "data.xlsx"
);

export async function loadWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);
  return workbook;
}

export async function saveWorkbook(workbook: ExcelJS.Workbook) {
  await workbook.xlsx.writeFile(EXCEL_PATH);
}

export function getSheetOrThrow(
  workbook: ExcelJS.Workbook,
  sheetName: string,
) {
  const sheet = workbook.getWorksheet(sheetName);

  if (!sheet) {
    throw new Error(`Worksheet "${sheetName}" not found`);
  }

  return sheet;
}