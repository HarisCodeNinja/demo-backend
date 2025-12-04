# Generator Audit – Required Hardening Steps

This document consolidates every shortcoming observed in the generated codebase so future scaffolds can be hardened immediately. Treat it as the minimum checklist after running the generator.

| # | Gap | Explanation | Fix/Ownership |
|---|-----|-------------|---------------|
| 1 | **Schema defaults & data types** | Generators blindly set `defaultValue: DataTypes.NOW` on all dates (see `Employee.dateOfBirth`, `JobOpening.publishedAt`) and use `STRING` for numeric metrics (`Attendance.totalHour`, `LeaveApplication.numberOfDay`). This corrupts analytics and requires manual casting. | Review every generated column. Only add defaults where semantically correct, and enforce proper numeric/boolean types. |
| 2 | **Missing domain constraints** | Only primary keys are enforced; there’s no uniqueness for `(employee_id, attendance_date)` or `(employee_id, pay_period_start, pay_period_end)`, so duplicates slip through. | Add composite unique indexes immediately after scaffolding to encode real-world business rules. |
| 3 | **Row-level security & ownership checks** | Routes re-use `requireRoles` without checking the current user’s ownership. Employees can update/delete any user or attendance record. | Post-generation, add middleware that enforces `req.user.userId/employeeId` for self-service endpoints and guards admin operations with additional checks (e.g., “cannot delete yourself/last admin”). |
| 4 | **DTO/validator drift** | When we adjust a schema (e.g., numeric `numberOfDay`), the generator leaves DTOs, Zod validators, Swagger docs, and seeders untouched, causing runtime/coercion bugs. | Whenever a column changes, propagate the update to `types.ts`, validators, Swagger, and fixture scripts immediately. |
| 5 | **Indexing strategy** | Generators dump multiple single-column indexes (e.g., `employees_departmentid_idx`, `employees_status_idx`) regardless of query patterns. Dashboards end up scanning entire tables. | Replace redundant indexes with composite/filtered indexes per module: `(department_id, status)` for employees, `(status, location_id)` for job openings, etc. |
| 6 | **Response contract & formatting** | Each controller crafts bespoke `{ message, data }` objects and errors vary widely. The frontend must special-case every endpoint. | Add a shared formatter (`success`, `error`) plus pagination envelope, and ensure the error handler uses it too. |
| 7 | **Request validation coverage** | Some query parameters and payloads skip validation entirely (pagination filters, optional booleans). | Require the generator to emit schemas for params, query, and body, and enforce validation middleware in every route. |
| 8 | **Transactions & audit logging** | Multi-step workflows (user+employee creation, payroll generation) run without transactions and never write to `audit_log`. | Wrap service flows in transactions by default and emit audit logging hooks so teams only fill in contextual info. |
| 9 | **Soft deletes & retention** | `destroy()` is called everywhere (users, employees, attendance) with no soft delete or recovery path. | Scaffold models with `paranoid: true` or manual `deletedAt`, expose restore endpoints, and ensure queries filter out soft-deleted rows. |
|10 | **Feature flags & environment safety** | Generated bootstraps register workflows/emails in every environment (see `registerEmployeeOnboardingEmailWorkflow()`), causing dev/test to trigger production side effects. | Provide a feature-flag helper in the scaffold and wrap automation hooks behind environment checks. |
|11 | **Background processing & retries** | Long-running tasks (email sends) execute inline using nodemailer helpers; no queues or retry logic exist. | Ship a job queue skeleton (Bull/Agenda/etc.) with retry/backoff utilities and move expensive work off the request thread. |
|12 | **Secrets & configuration hygiene** | Code accesses `process.env` everywhere with no validation, making misconfiguration or leaked secrets likely. | Generate a centralized config module that validates all env vars (zod/Joi) and exposes typed getters. |
|13 | **Automated testing templates** | The scaffold leaves `npm test` as a stub, so no one adds coverage later. | Provide ready-made unit/integration test templates for services and routers and hook them into CI from day zero. |
|14 | **Error handling consistency** | Only the global error handler standardizes errors, but services often return `{ errorCode, message }` themselves, bypassing middleware. | Encourage services to throw typed errors and rely on centralized handling, reducing duplicated logic. |
|15 | **Secrets exposure in responses** | Generated services often select every column, including `password` and tokens, then serialize them in list/detail endpoints. | Trim `attributes` to approved fields and add DTO transformers that redact sensitive properties before responding. |

## Usage
1. Run the generator.
2. Work through each row of the table, applying fixes before writing business logic.
3. Capture completed items in the project changelog/migrations so the next deployment is audit-ready.
