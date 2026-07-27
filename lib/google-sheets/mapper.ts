export function rowsToObjects<T extends Record<string, string>>(rows: string[][]): T[] {
  const [headers = [], ...dataRows] = rows;
  return dataRows
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[String(header).trim()] = String(row[index] ?? "").trim();
      });
      return obj as T;
    });
}

export function objectsToRows<T extends Record<string, unknown>>(objects: T[], headers: string[]): string[][] {
  return [headers, ...objects.map((obj) => headers.map((h) => String(obj[h] ?? "")))];
}
