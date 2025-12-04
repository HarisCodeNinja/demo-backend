# Code Generator Gaps & Quality Checklist

This project started from a boilerplate generator, which explains several recurring problems across modules. Use this checklist whenever we generate a new HRMS module (or any CRUD service) so we don’t repeat the same mistakes.

## 1. Schema Defaults & Data Types
- **Problem:** Generators add `defaultValue: DataTypes.NOW` to every `DATE` field, even when the column represents a birth date, employment end date, or publish/close timestamp. They also stringify numeric metrics (`totalHour`, `numberOfDay`).
- **Impact:** Incorrect analytics, impossible validation (every new record looks “today”), and slow queries due to casting strings.
- **Checklist:** Inspect every timestamp and numeric column. Only apply defaults where they make sense (e.g., `createdAt`) and ensure numeric business values use numeric types.

## 2. Ownership & Uniqueness Constraints
- **Problem:** Generated models lack composite unique indexes (attendance per day, payslip per pay period) and rely solely on `id` constraints.
- **Impact:** Duplicate clock-ins or overlapping payroll records slip through and must be cleaned manually.
- **Checklist:** Add domain-specific unique constraints right after scaffolding. For HRMS this means `(employee_id, attendance_date)`, `(employee_id, pay_period_start, pay_period_end)`, `(candidate_id, job_opening_id)` in active states, etc.

## 3. Access Control & Row-Level Filters
- **Problem:** Routers reuse the same `requireRoles` call for every endpoint without considering ownership. Employees can update arbitrary users; attendance endpoints allow any `employeeId`.
- **Impact:** Role escalation and data privacy violations.
- **Checklist:** Post-generate, lock down each route:
  - Self-service endpoints must enforce `req.user.userId` / `employeeId`.
  - Admin/HR routes need audit logging and self-deletion safeguards.

## 4. DTOs, Validators, and Models Drift
- **Problem:** The generator emits DTOs/validators once; any later schema edits (e.g., numeric day counts) aren’t propagated.
- **Impact:** Runtime casts, Zod schemas that still expect strings, and type mismatches during builds.
- **Checklist:** Whenever a column type changes, immediately update:
  - `types.ts`
  - Zod validators
  - Swagger/OpenAPI docs
  - Seed scripts / fixtures

## 5. Indexing Strategy
- **Problem:** Every table gets a handful of single-column indexes, but no composite or filtered indexes that match real queries.
- **Impact:** Table scans on dashboards (active employees, open positions, leave queues) as data grows.
- **Checklist:** After scaffolding, replace redundant indexes with real patterns:
  - `(department_id, status)` for employees
  - `(status, location_id)` for job openings
  - `(employee_id, status)` for leave approvals

## 6. Referential Integrity
- **Problem:** Foreign keys are declared in Sequelize but migrations don’t specify `onDelete` or `onUpdate`. Some relationships (e.g., `appliedBy`) are plain strings with no FK.
- **Impact:** Orphaned rows, inconsistent audits, and brittle workflows when parents are deleted.
- **Checklist:** Define FK behavior up front (CASCADE, SET NULL, RESTRICT) and model actor IDs with real foreign keys.

## 7. Automation & Side Effects
- **Problem:** Generators often register workflows/emails in the DB bootstrap (`registerEmployeeOnboardingEmailWorkflow()`), so any environment boot triggers production-like automations.
- **Impact:** Test/staging environments send real emails or mutate production services unintentionally.
- **Checklist:** Guard automation hooks behind feature flags or environment checks the moment the generator lays down boilerplate.

## 8. Security Defaults
- **Problem:** Password hashes and sensitive fields are returned in list endpoints because the generator exposes every column.
- **Impact:** Any HR or admin token can extract credential hashes.
- **Checklist:** Sanitize `attributes` arrays after generation—never expose `password`, `resetToken`, or other secrets, and add DTOs that explicitly whitelist response fields.

## 9. Response Contract & Formatting
- **Problem:** Every controller builds ad-hoc `{ message, data }` or `{ errorCode, message }` objects; there is no shared success/error formatter or pagination envelope.
- **Impact:** Front-end consumers must special-case each endpoint, making error handling brittle and increasing integration bugs.
- **Checklist:** Add a reusable response helper (e.g., `success(data, meta?)`, `failure(code, message, details?)`) and ensure routers always return standardized shapes. Integrate with the global error handler so validation/Sequelize errors also follow the contract.

## 10. Request Validation Coverage
- **Problem:** Some generators only create validators for params, leaving query strings/payloads unchecked (e.g., pagination filters that accept arbitrary strings, boolean flags, or SQL fragments).
- **Impact:** Services accept malformed data, forcing defensive coding inside every service and opening the door to injection or logic bugs.
- **Checklist:** Ensure the scaffold emits Zod/Joi schemas for **every** input surface (params, query, body) and that routers always pass through `validateZodSchema` before hitting business logic.

## 11. Transactions & Audit Logging
- **Problem:** Multi-step operations (creating users + employees, issuing offers + documents) run without transactions or audit hooks even though an `audit_log` model exists.
- **Impact:** Partial writes leave the database inconsistent, and there is no forensic trail for privileged actions.
- **Checklist:** Have the generator wrap create/update flows in transactions by default and emit audit logging stubs so teams only need to fill in entity-specific metadata.

## 12. Soft Deletes & Record Retention
- **Problem:** Every `delete*` service calls `destroy()` permanently (see `src/modules/employee/service.ts`, `attendance/service.ts`).
- **Impact:** Mistakes or malicious deletes cannot be recovered, violating compliance requirements.
- **Checklist:** Scaffold models with `paranoid: true` (soft deletes) for high-value tables and ensure generators output restore/recover endpoints or admin tooling.

## 13. Feature Flags & Environment Safety
- **Problem:** Bootstrap code executes production workflows (e.g., `registerEmployeeOnboardingEmailWorkflow()` in `src/config/db.ts`) in all environments because the generator lacks feature-flag hooks.
- **Impact:** Local/test environments accidentally trigger external emails or third-party calls.
- **Checklist:** Include environment-aware feature toggles in generated apps and wrap automation registration behind explicit flags.

## 14. Background Processing & Retry Strategy
- **Problem:** Generators wire nodemailer (or similar) directly inside request flows (`src/helper/email.ts`), with no queues or retry logic.
- **Impact:** Slow or failed external calls block API responses and provide no reliability guarantees.
- **Checklist:** Emit a background job skeleton (Bull, Agenda, etc.) plus retry/backoff helpers so time-consuming work never happens inline.

## 15. Secrets & Configuration Hygiene
- **Problem:** Generated code accesses `process.env` all over the codebase and trusts whatever is set, even though misconfiguration can break auth/email/DB.
- **Impact:** Typos or missing env vars only surface at runtime; secrets are harder to audit or rotate.
- **Checklist:** Have the generator produce a single configuration module that performs schema validation (e.g., zod), enforces required secrets, and centralizes access.

## 16. Automated Testing & Contract Verification
- **Problem:** No tests are produced; `npm test` simply exits with an error message.
- **Impact:** Teams rarely add coverage later, so regressions slip through despite the generator providing a “complete” module.
- **Checklist:** Ship baseline unit/integration test templates with every generated module (e.g., happy-path service tests, schema validation tests, contract tests for routers), and wire them into CI from day one.

---

**Takeaway:** Code generators accelerate scaffolding, but they do not capture HR-specific constraints, security posture, or performance considerations. Treat generated code as a starting point and immediately run through this checklist before committing a new module. That keeps the system robust without giving up the productivity benefits of the generator.
