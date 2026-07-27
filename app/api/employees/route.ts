import { NextResponse } from "next/server";
import { getCurrentEmployeesSafe, getFormerEmployeesSafe } from "@/lib/employees/safe-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "current";
  const data = status === "former" ? await getFormerEmployeesSafe() : await getCurrentEmployeesSafe();
  return NextResponse.json({ data });
}
