import { loadWorkbook, getSheetOrThrow, saveWorkbook } from "./workbook";

export async function openSheet(name: string) {
  const workbook = await loadWorkbook();

  const sheet = getSheetOrThrow(workbook, name);

  return {
    workbook,
    sheet,
  };
}

export async function save(workbook: any) {
  await saveWorkbook(workbook);
}