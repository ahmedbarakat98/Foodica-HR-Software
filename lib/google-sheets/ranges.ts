export const sheetTabs = {
  currentEmployees: "Employees_Current",
  formerEmployees: "Employees_Former",
  users: "Users",
  roles: "Roles",
  fieldSchema: "FieldSchema",
  fieldOptions: "FieldOptions",
  leaveTypes: "LeaveTypes",
  leaveRecords: "LeaveRecords",
  leavePolicies: "LeavePolicies",
  managerScopes: "ManagerScopes",
  settings: "Settings",
  auditLog: "AuditLog_Lite"
} as const;

export function fullTabRange(tab: string): string {
  return `'${tab}'!A:ZZ`;
}
