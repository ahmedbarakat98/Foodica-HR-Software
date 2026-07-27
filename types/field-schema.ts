import type { UserRole } from "./user";

export type FieldType =
  | "Text"
  | "Number"
  | "Date"
  | "Email"
  | "Phone"
  | "Dropdown"
  | "Boolean"
  | "Status"
  | "Currency"
  | "Long Text";

export interface FieldSchemaItem {
  fieldId: string;
  arabicLabel: string;
  englishLabel: string;
  sourceColumn: string;
  fieldType: FieldType;
  category: string;
  visibleTo: UserRole[];
  editableBy: UserRole[];
  showInTable: boolean;
  showInProfile: boolean;
  searchable: boolean;
  required: boolean;
  isSensitive: boolean;
  optionsSource?: string;
  displayOrder: number;
  status: "Active" | "Inactive";
}
