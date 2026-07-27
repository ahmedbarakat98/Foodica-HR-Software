import fs from "node:fs";

const jsonPath = process.argv[2];
const sheetId = process.argv[3];

if (!jsonPath || !sheetId) {
  console.error("Usage: node scripts-make-env-from-json.mjs <json-file-path> <google-sheet-id>");
  process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
  console.error("JSON file not found:", jsonPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

if (!serviceAccount.client_email || !serviceAccount.private_key) {
  console.error("Invalid service account JSON file.");
  process.exit(1);
}

const envContent = `GOOGLE_SHEET_ID=${sheetId}
GOOGLE_SERVICE_ACCOUNT_EMAIL=${serviceAccount.client_email}
GOOGLE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, "\\n")}"

SESSION_SECRET=foodica-hr-super-secret-change-this-123456789
NEXT_PUBLIC_DEFAULT_LOCALE=ar
`;

fs.writeFileSync(".env.local", envContent, "utf8");

console.log(".env.local was created successfully.");
console.log("Service account email:", serviceAccount.client_email);
console.log("Do not upload the JSON file or .env.local anywhere.");