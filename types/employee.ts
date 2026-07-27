export type EmployeeStatus = "current" | "former";

export interface EmployeeRecord {
  serial?: string;
  nationalId?: string;
  employeeCode: string;
  fingerprintCode?: string;
  insuranceNumber?: string;
  insuranceSalary?: string;
  insuranceDate?: string;
  name: string;
  jobTitle?: string;
  administration?: string;
  department?: string;
  branch?: string;
  birthDate?: string;
  hiringDate?: string;
  phone?: string;
  address?: string;
  email?: string;
  bankAccount?: string;
  medicalInsurance?: string;
  trustReceipts?: string;
  gender?: string;
  healthCertificate?: string;
  expirationDate?: string;
  terminationDate?: string;
  status: EmployeeStatus;
  raw: Record<string, string>;
}

export interface EmployeeFilters {
  query?: string;
  administration?: string;
  department?: string;
  branch?: string;
  jobTitle?: string;
  status?: EmployeeStatus | "all";
}
