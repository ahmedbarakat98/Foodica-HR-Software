export interface LeaveType {
  id: string;
  arName: string;
  enName: string;
  deductsFromAnnualBalance: boolean;
  status: "Active" | "Inactive";
}

export interface LeaveRecord {
  leaveId: string;
  employeeCode: string;
  employeeName: string;
  department?: string;
  branch?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  calculatedDays: number;
  excludeFridays: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  status: "Active" | "Cancelled";
}

export interface LeaveBalance {
  employeeCode: string;
  usedDays: number;
  allowedDays: number;
  suggestedDays: number;
  remainingDays: number;
}
