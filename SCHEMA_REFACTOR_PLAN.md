# HRMS Schema Modernization Recommendations

This companion document outlines structural changes that will make the data model safer, more consistent, and easier to query at scale.

## 1. Core Identity & Employment Records

- **Remove misleading defaults for human timelines.** `Employee.dateOfBirth` and `employmentEndDate` currently default to `NOW()` (`src/modules/employee/model.ts:56-85`), causing every new hire to look as if they were born or terminated today. Drop those defaults and require explicit values (with `NULL` allowed for `employmentEndDate` until separation).
- **Normalize status fields.** Many tables treat status as a free-form string (e.g., `Employee.status`, `JobOpening.status`, `Attendance.status`). Define ENUMs or lookup tables so downstream analytics and RBAC checks can rely on a bounded set.
- **Add ownership constraints.** There is no uniqueness on `(employee_id, attendance_date)` or `(employee_id, pay_period_start, pay_period_end)`. Add composite unique indexes to prevent duplicate day-level attendance or overlapping payslips.
- **Introduce tenant/organization scoping (if multi-tenant is required).** None of the tables carry an `orgId` or similar discriminator, which makes it impossible to safely host multiple companies in the same schema.

## 2. Attendance & Time Tracking

- **Store numeric hours.** `Attendance.totalHour` is defined as `DataTypes.STRING` even though the TypeScript type is numeric (`src/modules/attendance/model.ts:12,48-51`), forcing conversions and preventing aggregates. Switch to `DECIMAL(5,2)` or integer minutes.
- **Enforce immutable timestamps.** The model defaults `attendanceDate` to `NOW()` (`src/modules/attendance/model.ts:30-34`). When importing historic data the default causes silent inaccuracies. Require the date to be supplied and reject future dates beyond a tolerance window.
- **Capture source metadata.** Consider adding columns such as `source` (`manual`, `biometric`, `geo`) and `approvedBy` to support audit trails and workflow rules.

## 3. Leave & Payroll

- **Fix data types for day counts.** `LeaveApplication.numberOfDay` is stored as `STRING` (`src/modules/leave-application/model.ts:47-50`), which breaks numeric filters. Change it to `DECIMAL(5,2)` or integer minutes/day fractions.
- **Track requester vs approver.** `LeaveApplication.appliedBy` is a `STRING` without foreign key constraints (`src/modules/leave-application/model.ts:60-63`). Replace it with `appliedById` referencing `Employee`, and add `approvedById`, `approvedAt`, `approvalStatus`.
- **Remove auto-generated pay periods.** Payslip start/end dates default to `NOW()` (`src/modules/payslip/model.ts:33-42`), so uninitialized inserts create zero-length payroll windows. Require explicit pay periods and add a unique constraint on `(employee_id, pay_period_start, pay_period_end)`.
- **Model structured compensation.** `SalaryStructure.allowance` / `deduction` are generic JSON blobs (`src/modules/salary-structure/model.ts:35-46`). Define nested tables (e.g., `salary_components`) with type, amount, currency for reporting and auditing.

## 4. Recruiting & Lifecycle

- **Nullable lifecycle dates with intent.** `JobOpening.closedAt` and `publishedAt` default to `NOW()` (`src/modules/job-opening/model.ts:62-71`), which misrepresents drafts. Remove defaults and only set timestamps when an opening actually publishes or closes.
- **Introduce constraint for unique active offers.** Offer letters should be unique per candidate per job in an “active” state to prevent duplicates. A partial unique index on `(candidate_id, job_opening_id)` where `status IN ('Draft','Issued')` would prevent conflicting offers.
- **Document management integrity.** Employee documents currently allow any `documentType` string (`src/modules/document/model.ts:33-44`). Normalize the types via reference table and enforce required documents per employment type to support compliance automations.

## 5. Referential Integrity & Auditing

- **Add cascading strategies deliberately.** Today most foreign keys are logical only (no `onDelete`/`onUpdate`). Decide which relations should `CASCADE`, `SET NULL`, or forbid deletes to protect history (e.g., prevent deleting a department that still has employees).
- **Soft delete semantics.** Replace hard deletes with `deletedAt` columns on high-value tables (users, employees, attendance, payslip) and include them in every index filter. This preserves forensic trails and complies with retention rules.
- **Versioned audit tables.** Core entities (salary structures, offers, leave approvals) need history tables that capture prior values, actor IDs, and timestamps. The existing `audit_log` model is never used; extend it to cover DML triggers or explicit service writes.

## 6. Indexing & Performance Hygiene

- **Review redundant single-column indexes.** Several tables (e.g., `employees_*_idx` series at `src/modules/employee/model.ts:118-130`) add many non-selective indexes that slow writes. Consolidate into composite indexes that match actual query patterns (e.g., `(department_id, status)`).
- **Add filtered indexes for “active” lookups.** Most dashboards query “active employees”, “open job openings”, etc. Filtered indexes on `status='active'` produce better plans without the maintenance overhead of multiple full indexes.
- **Standardize naming.** Current index names mix snake_case and camelCase prefixes. Adopt a naming convention (`idx_<table>_<columns>`) to simplify migrations and operations scripts.

---

Implementing these schema changes in tandem with the security hardening plan will significantly reduce data inconsistencies, unlock analytics, and prepare the platform for stricter compliance requirements.
