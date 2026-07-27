import fs from "node:fs";
import { JWT } from "google-auth-library";

function readEnvFile() {
  if (!fs.existsSync(".env.local")) {
    throw new Error(".env.local file was not found in the project root.");
  }

  const env = {};
  const content = fs.readFileSync(".env.local", "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) continue;

    const key = trimmed.slice(0, equalIndex).trim();
    let value = trimmed.slice(equalIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function mask(value) {
  if (!value) return "MISSING";
  if (value.length <= 14) return "***";
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

async function googleFetch(spreadsheetId, token, path) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

async function main() {
  const env = readEnvFile();

  const spreadsheetId = env.GOOGLE_SHEET_ID;
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  console.log("ENV CHECK");
  console.log("GOOGLE_SHEET_ID:", mask(spreadsheetId));
  console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", email || "MISSING");
  console.log("GOOGLE_PRIVATE_KEY exists:", privateKey ? "YES" : "NO");
  console.log(
    "PRIVATE_KEY starts correctly:",
    privateKey?.startsWith("-----BEGIN PRIVATE KEY-----") ? "YES" : "NO"
  );
  console.log(
    "PRIVATE_KEY ends correctly:",
    privateKey?.includes("-----END PRIVATE KEY-----") ? "YES" : "NO"
  );

  const auth = new JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("\nAuthorizing service account...");
  await auth.authorize();

  const token = auth.credentials.access_token;

  console.log("Access token exists:", token ? "YES" : "NO");

  if (!token) {
    throw new Error("No access token returned from Google.");
  }

  console.log("Connecting to Google Sheet through REST API...");

  const spreadsheet = await googleFetch(
    spreadsheetId,
    token,
    "?fields=properties.title,sheets.properties.title"
  );

  const tabs =
    spreadsheet.sheets?.map((s) => s.properties?.title).filter(Boolean) || [];

  console.log("CONNECTED");
  console.log("Spreadsheet title:", spreadsheet.properties?.title);
  console.log("Tabs found:", tabs.join(", "));

  const range = encodeURIComponent("'Employees_Current'!A1:Z5");

  const rows = await googleFetch(spreadsheetId, token, `/values/${range}`);

  console.log("\nEmployees_Current sample rows:");
  console.log(rows.values);

  console.log("\nSUCCESS: Google Sheets connection works.");
}

main().catch((error) => {
  console.error("\nFAILED:");
  console.error(error.message);
  process.exit(1);
});
