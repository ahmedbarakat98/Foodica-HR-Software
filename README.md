# Foodica HR

Lightweight HR web application for Foodica.

## Core decisions

- Google Sheets is the primary data source.
- Excel is used for import/export/backup only.
- Arabic/English UI with RTL/LTR switching.
- Roles: Admin, HR, Employee.
- Employee login: Employee Code + Password.
- Admin/HR login: Username + Password.
- High performance first: table-first UI, side-panel editing, batch writes, lazy charts.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill Google Sheets credentials in `.env.local`.

## Google Sheets tabs expected

- Employees_Current
- Employees_Former
- Users
- Roles
- FieldSchema
- FieldOptions
- LeaveTypes
- LeaveRecords
- LeavePolicies
- ManagerScopes
- Settings
- AuditLog_Lite
