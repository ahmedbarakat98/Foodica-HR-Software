import path from "path";
import * as XLSX from "xlsx";
import type { EmployeeRecord, EmployeeStatus } from "@/types/employee";

type Row = Record<string, any>;

// دالة لالتقاط القيمة بغض النظر عن الاختلافات الطفيفة في اسم العمود
function pick(row: Row, ...keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return undefined;
}

// دالة تحويل الصف من Excel إلى EmployeeRecord
export function mapEmployee(row: Row, status: EmployeeStatus): EmployeeRecord {
  return {
    serial: pick(row, "م"),
    nationalId: pick(row, "الرقم القومى", "الرقم القومي"),
    employeeCode: pick(row, "الكود الوظيفي", "Employee Code") ?? "",
    fingerprintCode: pick(row, "كود البصمة الجديد", "كود البصمة"),
    insuranceNumber: pick(row, "الرقم التامينى", "الرقم التأميني"),
    insuranceSalary: pick(row, "الاجر التأميني", "الأجر التأميني"),
    insuranceDate: pick(row, "تاريخ التامين", "تاريخ التأمين"),
    name: pick(row, "الاسم", "Name") ?? "",
    jobTitle: pick(row, "الوظيفه", "الوظيفة"),
    administration: pick(row, "الاداره", "الإدارة"),
    department: pick(row, "القسم"),
    branch: pick(row, "الفرع"),
    birthDate: pick(row, "تاريخ الميلاد"),
    hiringDate: pick(row, "تاريخ التعيين"),
    phone: pick(row, "رقم التليفون", "رقم الهاتف"),
    address: pick(row, "العنوان"),
    email: pick(row, "الايميل", "الإيميل", "Email"),
    bankAccount: pick(row, "رقم الحساب"),
    medicalInsurance: pick(row, "تأمين طبي"),
    trustReceipts: pick(row, "ايصالات الامانة", "إيصالات الأمانة"),
    gender: pick(row, "النوع"),
    healthCertificate: pick(row, "شهادة صحية"),
    expirationDate: pick(row, "تاريخ الانتهاء"),
    terminationDate: pick(row, "تاريخ انتهاء العمل"),
    status,
    raw: row,
  };
}

/**
 * دالة لقراءة الموظفين مباشرة من ملف Excel بناءً على اسم الشيت والحالة
 */
export function getEmployeesFromExcel(
  sheetName: "Employees_Current" | "Employees_Former",
  status: EmployeeStatus
): EmployeeRecord[] {
  try {
    const filePath = path.join(process.cwd(), "lib", "data.xlsx");
    
    // raw: false أو cellDates: true تضمن قراءة التواريخ والنصوص بشكل صحيح
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      console.warn(`Sheet "${sheetName}" not found in Excel file.`);
      return [];
    }

    // تحويل الشيت إلى JSON
    const rows = XLSX.utils.sheet_to_json<Row>(worksheet, { defval: "" });

    // تحويل كل صف إلى EmployeeRecord
    return rows.map((row) => mapEmployee(row, status));
  } catch (error) {
    console.error(`Error reading sheet ${sheetName}:`, error);
    return [];
  }
}