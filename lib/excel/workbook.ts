
import ExcelJS from "exceljs";
import path from "path";

const EXCEL_FILE_PATH = path.join(process.cwd(), "data", "Data.xlsx");

export async function loadWorkbook() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_FILE_PATH);
  return workbook;
}

export async function saveWorkbook(workbook: ExcelJS.Workbook) {
  await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
}

export function getSheetOrThrow(
  workbook: ExcelJS.Workbook,
  sheetName: string,
) {
  const sheet = workbook.getWorksheet(sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" was not found in Data.xlsx`);
  }

  return sheet;
}