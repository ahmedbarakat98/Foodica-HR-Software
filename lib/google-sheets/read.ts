import { sheetsFetch } from "./client";
import { fullTabRange } from "./ranges";
import { rowsToObjects } from "./mapper";

type SheetsValuesResponse = {
  range?: string;
  majorDimension?: string;
  values?: string[][];
};

export async function readSheetRows(tabName: string): Promise<string[][]> {
  const range = fullTabRange(tabName);

  const data = await sheetsFetch<SheetsValuesResponse>(
    `/values/${encodeURIComponent(range)}`
  );

  return data.values ?? [];
}

export async function readSheetObjects<T extends Record<string, string>>(
  tabName: string
): Promise<T[]> {
  const rows = await readSheetRows(tabName);
  return rowsToObjects<T>(rows);
}
