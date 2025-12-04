# Schema Hardening – Iteration 1 Summary

This note documents the concrete schema-level adjustments already applied so future migrations and audits stay aligned with the codebase.

## 1. Employee lifecycle consistency
- **What changed:** Removed the automatic `NOW()` defaults from `Employee.dateOfBirth` and `Employee.employmentEndDate` (`src/modules/employee/model.ts`).
- **Why:** Auto-filled dates made every new record look like the employee was born or terminated today, corrupting analytics and compliance exports.
- **Benefit:** HR must supply real values (or leave `employmentEndDate` null), resulting in accurate tenure calculations and reducing accidental data privacy risks.

## 2. Attendance integrity
- **What changed:** `attendanceDate` must be explicitly provided (no default), and `totalHour` now uses a numeric column (DECIMAL) instead of string storage (`src/modules/attendance/model.ts` and Swagger docs).
- **Why:** Silent defaults produced wrong historical dates, and string-based durations couldn’t be aggregated reliably.
- **Benefit:** Accurate reporting for time tracking, plus easier validation when enforcing overtime, lateness, or payroll rules.

## 3. Leave application accuracy
- **What changed:** `LeaveApplication.numberOfDay` switched to a numeric column; the DTOs/validators now require a positive number (`src/modules/leave-application/model.ts`, `types.ts`, `validation.ts`, Swagger).
- **Why:** Storing day counts as text prevented numeric queries, encouraged client-side inconsistencies, and made fraud detection harder.
- **Benefit:** HR workflows can enforce fractional-day policies, and analytics/approvals can run precise calculations without casting.

## 4. Recruiting lifecycle timestamps
- **What changed:** `JobOpening.publishedAt` and `closedAt` no longer auto-default to `NOW()` (`src/modules/job-opening/model.ts`).
- **Why:** Draft openings looked published/closed immediately, confusing dashboards and downstream automation.
- **Benefit:** Publish/close dates now reflect actual workflow events, enabling accurate SLA and funnel tracking.

## 5. Payroll period enforcement
- **What changed:** `Payslip.payPeriodStart`/`payPeriodEnd` no longer default to current time (`src/modules/payslip/model.ts`); callers must supply real periods.
- **Why:** Zero-length or overlapping pay periods were silently created, which made reconciliation and tax filings error-prone.
- **Benefit:** Each payslip clearly maps to an intentional payroll window, simplifying compliance checks and duplicate detection.

---

These updates were completed alongside the Iteration‑1 TypeScript changes (`npm run build` validated), but **database migrations still need to be generated/applied** to align persistent datasets (e.g., changing column types from string to numeric). Use this document as a reference when writing SQL migrations or reviewing production rollouts.

## 6. Index & Constraint Hardening (Iteration 2)

- **Attendance uniqueness:** Added a composite unique index on `(employee_id, attendance_date)` so duplicate day entries are rejected at the database level (`src/modules/attendance/model.ts`). This prevents double clock-ins from skewing KPIs and reduces cleanup work.
- **Employee roster filtering:** Replaced the plain `department` index with a composite `(department_id, status)` index (`src/modules/employee/model.ts`) to accelerate “active employees per department” dashboards and HR filters.
- **Leave workflow queries:** Added an `(employee_id, status)` index for leave applications (`src/modules/leave-application/model.ts`), which speeds up approval queues and historical lookups for a given employee.
- **Recruiting funnels:** Introduced `(status, department_id)` and `(status, location_id)` indexes on job openings (`src/modules/job-opening/model.ts`) so open-role queries stay fast even with large requisition pools.
- **Payroll integrity:** Added a unique `(employee_id, pay_period_start, pay_period_end)` index for payslips (`src/modules/payslip/model.ts`) to block overlapping payroll runs and ensure deterministic reconciliation.

> **Reminder:** These index/constraint updates require matching database migrations (CREATE/DROP INDEX, UNIQUE constraints). Apply them in your migration tool of choice before deploying code changes to production.
