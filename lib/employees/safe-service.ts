import { seedEmployees } from "./seed";
import { getCurrentEmployees, getFormerEmployees, getAllEmployees, getEmployeeByCode } from "./service";
import type { EmployeeRecord } from "@/types/employee";

async function withFallback<T>(fn: () => Promise<T> | T, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn("Using seed data fallback:", error);
    return fallback;
  }
}

export function getCurrentEmployeesSafe(): Promise<EmployeeRecord[]> {
  return withFallback(
    () => getCurrentEmployees(),
    seedEmployees.filter((e) => (e.status as string) === "active" || (e.status as string) === "current")
  );
}

export function getFormerEmployeesSafe(): Promise<EmployeeRecord[]> {
  return withFallback(
    () => getFormerEmployees(),
    seedEmployees.filter((e) => (e.status as string) === "inactive" || (e.status as string) === "former")
  );
}

export function getAllEmployeesSafe(): Promise<EmployeeRecord[]> {
  return withFallback(() => getAllEmployees(), seedEmployees);
}

export function getEmployeeByCodeSafe(code: string): Promise<EmployeeRecord | null> {
  return withFallback(
    () => getEmployeeByCode(code),
    seedEmployees.find((e) => e.employeeCode === code) ?? null
  );
}