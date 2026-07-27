import path from "path";
import * as XLSX from "xlsx";

/**
 * دالة لقراءة البيانات من شيت محدد داخل ملف Excel المحالي (lib/data.xlsx)
 * @param sheetName اسم الشيت المراد قراءته (اختياري - افتراضياً يقرأ أول شيت)
 * @returns الأسطر الموجودة في الشيت على هيئة قائمة من الأبjects (JSON)
 */
export function getExcelData<T = Record<string, any>>(sheetName?: string): T[] {
  try {
    // تحديد المسار الكامل لملف الاكسيل داخل مجلد lib
    const filePath = path.join(process.cwd(), "lib", "data.xlsx");

    // قراءة الملف
    const workbook = XLSX.readFile(filePath);

    // اختيار الشيت المطلوب أو أول شيت إذا لم يتم تحديد اسم
    const targetSheetName = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[targetSheetName];

    if (!worksheet) {
      throw new Error(`Sheet "${targetSheetName}" not found in file.`);
    }

    // تحويل البيانات من أسطر في Excel إلى JSON
    const data = XLSX.utils.sheet_to_json<T>(worksheet);

    return data;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
}

/**
 * دالة اختيارية في حال كنت تريد جلب أسماء جميع الشيتات المتاحة في الملف
 */
export function getExcelSheetNames(): string[] {
  const filePath = path.join(process.cwd(), "lib", "data.xlsx");
  const workbook = XLSX.readFile(filePath);
  return workbook.SheetNames;
}