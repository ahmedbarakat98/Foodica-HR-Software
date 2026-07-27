import { NextResponse } from "next/server";
import {
  createEmployee,
  getAllEmployees,
} from "@/lib/excel/employees.service";

export async function GET() {
  try {
    const employees = await getAllEmployees();

    return NextResponse.json({
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    console.error("GET /api/employees error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fullName = String(body?.fullName ?? "").trim();
    const employeeCode = String(body?.employeeCode ?? "").trim();
    const department = String(body?.department ?? "").trim();
    const jobTitle = String(body?.jobTitle ?? "").trim();

    if (!fullName) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 },
      );
    }

    const newEmployee = await createEmployee({
      employeeCode,
      fullName,
      department,
      jobTitle,
      email: String(body?.email ?? "").trim(),
      phone: String(body?.phone ?? "").trim(),
      managerId: String(body?.managerId ?? "").trim(),
      hireDate: String(body?.hireDate ?? "").trim(),
      status: String(body?.status ?? "Active").trim(),
      location: String(body?.location ?? "").trim(),
      shift: String(body?.shift ?? "").trim(),
    });

    return NextResponse.json(
      {
        message: "Employee created successfully",
        data: newEmployee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/employees error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

