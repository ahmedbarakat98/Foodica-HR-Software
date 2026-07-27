import { NextResponse } from "next/server";
import {
  deleteEmployee,
  findEmployeeById,
  updateEmployee,
} from "@/lib/excel/employees.service";

type Params = {
  params: {
    id: string;
  };
};

/**
 * GET /api/employees/:id
 */
export async function GET(
  _req: Request,
  { params }: Params,
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 },
      );
    }

    const employee = await findEmployeeById(id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    console.error("GET Employee:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/employees/:id
 */
export async function PUT(
  req: Request,
  { params }: Params,
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const updatedEmployee = await updateEmployee(id, {
      employeeCode: body.employeeCode,
      fullName: body.fullName,
      department: body.department,
      jobTitle: body.jobTitle,
      email: body.email,
      phone: body.phone,
      managerId: body.managerId,
      hireDate: body.hireDate,
      status: body.status,
      location: body.location,
      shift: body.shift,
    });

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("PUT Employee:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/employees/:id
 */
export async function DELETE(
  _req: Request,
  { params }: Params,
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 },
      );
    }

    const employee = await findEmployeeById(id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const deleted = await deleteEmployee(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Failed to delete employee" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Employee:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}