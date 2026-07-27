export const dictionaries = {
  ar: {
    appName: "Foodica HR",
    subtitle: "بوابة إدارة الموارد البشرية",
    login: "تسجيل الدخول",
    username: "اسم المستخدم",
    employeeCode: "الكود الوظيفي",
    password: "كلمة المرور",
    adminHrLogin: "دخول الأدمن / HR",
    employeeLogin: "دخول الموظف",
    dashboard: "لوحة التحليلات",
    currentEmployees: "الموظفون الحاليون",
    formerEmployees: "الموظفون السابقون",
    employees: "الموظفون",
    leaves: "الإجازات",
    settings: "الإعدادات",
    search: "بحث",
    tableView: "جدول",
    cardsView: "كروت",
    current: "حالي",
    former: "سابق",
    totalEmployees: "إجمالي الموظفين",
    monthlyHiring: "التعيينات الجديدة شهرياً",
    turnoverRate: "معدل ترك العمل",
    departmentCount: "عدد الموظفين حسب القسم",
    leaveConsumption: "أكثر الأقسام استهلاكاً للإجازات",
    save: "حفظ",
    cancel: "إلغاء"
  },
  en: {
    appName: "Foodica HR",
    subtitle: "Human Resources Management Portal",
    login: "Login",
    username: "Username",
    employeeCode: "Employee Code",
    password: "Password",
    adminHrLogin: "Admin / HR Login",
    employeeLogin: "Employee Login",
    dashboard: "Dashboard",
    currentEmployees: "Current Employees",
    formerEmployees: "Former Employees",
    employees: "Employees",
    leaves: "Leaves",
    settings: "Settings",
    search: "Search",
    tableView: "Table",
    cardsView: "Cards",
    current: "Current",
    former: "Former",
    totalEmployees: "Total Employees",
    monthlyHiring: "Monthly Hiring",
    turnoverRate: "Turnover Rate",
    departmentCount: "Employees by Department",
    leaveConsumption: "Top Leave Consumption",
    save: "Save",
    cancel: "Cancel"
  }
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale === "en" ? "en" : "ar"];
}
