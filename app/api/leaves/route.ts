import { NextResponse } from "next/server";
import { calculateLeaveDays } from "@/lib/leaves/calculate-days";

export async function POST(request: Request) {
  const body = (await request.json()) as { fromDate?: string; toDate?: string; excludeFridays?: boolean };
  if (!body.fromDate || !body.toDate) {
    return NextResponse.json({ message: "fromDate and toDate are required" }, { status: 400 });
  }
  const calculatedDays = calculateLeaveDays(body.fromDate, body.toDate, body.excludeFridays ?? true);
  return NextResponse.json({ calculatedDays });
}
