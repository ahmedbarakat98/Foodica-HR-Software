import type { EmployeeRecord } from "@/types/employee";
import type { LeaveBalance, LeaveRecord } from "@/types/leave";
import { suggestedAnnualLeaveDays } from "./policy";

export function buildLeaveBalance(employee: EmployeeRecord, records: LeaveRecord[], allowedOverride?: number): LeaveBalance {
  const employeeLeaves = records.filter((record) => record.employeeCode === employee.employeeCode && record.status === "Active");
  const usedDays = employeeLeaves.reduce((sum, record) => sum + Number(record.calculatedDays || 0), 0);
  const suggestedDays = suggestedAnnualLeaveDays(employee.hiringDate);
  const allowedDays = allowedOverride ?? suggestedDays;
  return {
    employeeCode: employee.employeeCode,
    usedDays,
    suggestedDays,
    allowedDays,
    remainingDays: allowedDays - usedDays
  };
}
