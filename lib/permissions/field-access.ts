import type { FieldSchemaItem } from "@/types/field-schema";
import type { UserRole } from "@/types/user";

export function canViewField(field: FieldSchemaItem, role: UserRole): boolean {
  return field.status === "Active" && field.visibleTo.includes(role);
}

export function canEditField(field: FieldSchemaItem, role: UserRole): boolean {
  return field.status === "Active" && field.editableBy.includes(role);
}
