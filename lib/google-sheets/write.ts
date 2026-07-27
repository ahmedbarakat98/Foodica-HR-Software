import { sheetsFetch } from "./client";

export async function updateRange(range: string, values: unknown[][]) {
  await sheetsFetch(
    `/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      body: JSON.stringify({ values }),
    }
  );
}

export async function appendRows(range: string, values: unknown[][]) {
  await sheetsFetch(
    `/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({ values }),
    }
  );
}

export async function batchUpdateRanges(
  updates: Array<{ range: string; values: unknown[][] }>
) {
  await sheetsFetch(`/values:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({
      valueInputOption: "USER_ENTERED",
      data: updates,
    }),
  });
}
