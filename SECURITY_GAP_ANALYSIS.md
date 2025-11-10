# HRMS Hardening & Security Gap Analysis

This document captures the most critical security, privacy, and operational gaps that remain in the current HRMS backend. It focuses on how the existing implementation impacts the four declared personas (admin, HR admin, manager, employee) and what must change to reach an enterprise-ready baseline.

---

## 1. Identity & Access Management (IAM)

| Gap | Evidence | Impact | Recommendation |
| --- | --- | --- | --- |
| **Scopes do not map to real roles.** The platform only assigns `user`, `user:employee`, `user:manager`, `user:hr`, and `user:admin`, but you also operate with “HR admin”. | `src/helper/auth.ts:34-49` | HR admins cannot be differentiated from HR users, so least privilege and approval chains cannot be enforced. | Introduce discrete scopes for each persona (`user:hr_admin`, etc.), migrate routers to check them, and store them in tokens. |
| **Employees can edit any user record (role escalation).** `PUT /user/:userId` allows `user:employee` scope and updates whichever ID is supplied. | `src/modules/user/router.ts:52-70` | Any employee can change another user’s email, role, or password hash, making lateral movement trivial. | Restrict the route to privileged roles, or require that employees can only update `req.user.userId`. |
| **Admin self-deletion and last-admin removal are allowed.** `DELETE /user/:userId` only checks that the caller is `user:admin`; the service deletes the row outright. | Routes `src/modules/user/router.ts:87-99`; logic `src/modules/user/service.ts:131-148` | An admin can remove their own account (locking themselves out) or delete the only HR admin, leaving no privileged accounts. | Prevent deleting the authenticated user, enforce “at least one admin” invariants, and replace hard deletes with soft deletes + audit entries. |
| **User list exposes password hashes to anyone with HR scope.** Fetching users returns the hashed `password` column. | `src/modules/user/service.ts:11-28` | Hashes can be exfiltrated and cracked offline, exposing every account. | Drop `password` from every read model; never send it back to clients or include it in caches. |
| **Authentication tokens embed passwords.** During login/registration the hashed password is put into `sessionData` and subsequently signed into both access and refresh tokens. | `src/modules/user-auth/service.ts:53-74` and `76-124` | Anyone holding a token can extract and reuse the hash; tokens become PII containers, increasing breach scope. | Limit token claims to non-sensitive identifiers (userId, scopes, tenant, userVersion). |
| **Attendance & employee data lack row-level security.** Employees can list all attendance records and supply any `employeeId` in create/update payloads. Managers/HR can pull full employee rosters without department filters. | Attendance router `src/modules/attendance/router.ts:12-28` and service `src/modules/attendance/service.ts:8-51`; Employee router `src/modules/employee/router.ts:10-68` & service `src/modules/employee/service.ts:11-67` | Front-line staff can enumerate salaries, PII, and insert fraudulent hours for peers or executives. | Apply ownership filters (`WHERE employee_id = req.user.employeeId`) for employee-scoped endpoints, introduce row-level department scoping for managers, and split create/update flows by role. |
| **No approval gates for sensitive actions.** Offer letters, payroll updates, and employee deletions are single-step service calls guarded only by a role string. | e.g., `src/modules/offer-letter/service.ts`, `src/modules/payslip/service.ts`, `src/modules/employee/router.ts:84-109` | A compromised admin token is enough to alter payroll, offers, or terminate staff without dual control. | Introduce workflow states with multi-party approvals (especially for payroll, offer letters, terminations). |

---

## 2. Authentication & Session Hardening

1. **No account lockout / rate limiting on login.** The login service performs synchronous password checks with no back-off or max attempts (`src/modules/user-auth/service.ts:19-74`), so brute-force attacks are feasible.
2. **Refresh tokens are stateless and cannot be revoked.** `generateRefreshToken` signs a JWT but there is no datastore for `jti` tracking or invalidation (`src/helper/auth.ts:17-32`, `validateRefreshToken`), so stolen tokens remain valid until expiry.
3. **No MFA or device binding.** Nothing in the authentication flow enforces second factors, trusted devices, or IP-based anomalies—crucial for HR/payroll access.
4. **Password hygiene is minimal.** There is no complexity/rotation policy, and the random password generator uses `Math.random` which is not cryptographically secure (`src/helper/auth.ts:100-117`).

*Mitigations:* add rate limiting + lockout, store refresh token metadata for revocation, enforce configurable password rules, migrate to crypto-grade randomness, and provide optional MFA / SSO.

---

## 3. Data Protection & Privacy

| Issue | Evidence | Risk | Needed Controls |
| --- | --- | --- | --- |
| **PII overexposed in bulk endpoints.** Employee list returns DOB, personal email, address, phone, etc., without masking or field-level authorization. | `src/modules/employee/service.ts:11-67` | Violates data-minimization principles and privacy regulations. | Introduce view-specific DTOs, mask fields for non-HR users, and instrument consents. |
| **Hard deletes remove forensic evidence.** Users, employees, attendance entries, etc., are destroyed with `destroy()` and no audit trail. | e.g., `src/modules/employee/service.ts:247-276`, `src/modules/attendance/service.ts:150-166` | Impossible to trace malicious changes or recover from mistakes; may breach legal retention rules. | Implement soft deletes with `deletedAt`, record change events in `audit_log`, and expose restore tooling. |
| **Automatic outbound email on boot.** `registerEmployeeOnboardingEmailWorkflow()` is called unconditionally when the server starts (`src/config/db.ts:101-122`), so any environment spins up automation emails even in test/sandbox contexts. | External email may leak internal data or spam customers during local dev or incident response exercises. | Gate workflows behind feature flags / environment checks and centralize outbound approval. |
| **No encryption at rest / in transit.** Sensitive columns (salary, bank info, documents) are stored plaintext in Postgres and served over HTTP without TLS termination defined in the repo. | Data theft on DB snapshot leads to clear-text leakage. | Use column-level encryption or an HSM/KMS for critical payloads and enforce HTTPS via reverse proxy or app-level redirection. |

---

## 4. Auditability & Monitoring

1. **Audit-log model is initialized but unused.** No services write to the audit table when privileged actions occur, so you can’t reconstruct who changed payroll or approved leave.
2. **Security events are not logged.** Login failures, role changes, and token refreshes produce no structured logs or alerts.
3. **No integrity monitoring.** There are no checksums, tamper-evident logs, or change notifications for key master data (roles, salary structures, documents).

*Path forward:* implement audit logging middleware, push events to SIEM, and wire alerts for anomalous activity (mass downloads, repeated login failures, etc.).

---

## 5. Compliance & Operational Readiness

1. **Row-level consent & DSR tooling missing.** There is no way to honor GDPR/CCPA requests (export or delete), nor to track consent for storing personal data.
2. **Segregation of duties is absent.** Payroll, recruitment, and offboarding flows each rely on a single role; no enforcement of “4 eyes” reviews.
3. **Backups / disaster recovery are undocumented.** No scripts or docs describe backup cadence, encryption, or restore drills.
4. **Testing environments share production secrets.** Because workflow registration and email sending happen at boot, it is easy to connect a developer box to production SMTP/DB by mistake.

---

## 6. Prioritized Remediation Plan

1. **Lock down user & employee endpoints (critical).**
   - Remove `user:employee` from global user update routes.
   - Ensure every employee-scoped request filters by `req.user.userId` / `req.user.employeeId`.
   - Add “cannot delete self/last admin” checks and switch to soft deletes with audit logging.
2. **Sanitize authentication payloads (critical).**
   - Strip `password` fields from every read response.
   - Minimize JWT claims and store authentication state server-side for refresh tokens.
3. **Introduce granular scopes & approver workflows (high).**
   - Add distinct scopes (`hr_admin`, `payroll_admin`, etc.) and adapt routers/services.
   - Require dual approvals for payroll, offer letters, and termination actions.
4. **Improve security hygiene (high).**
   - Enforce MFA, rate limiting, password policies, and lockouts.
   - Create a secrets management strategy and rotate keys regularly.
5. **Deliver audit & monitoring (medium).**
   - Instrument every privileged action into the audit log with request metadata.
   - Ship security logs to centralized monitoring with alert thresholds.
6. **Data protection & compliance (medium).**
   - Mask PII based on role, encrypt critical columns, and document DSR processes.
   - Gate outbound automations and emails via env flags/feature toggles.

Implementing the above will align the system with common HRMS expectations—least privilege, auditable workflows, strong authentication, and privacy-by-design—closing the most serious risks before expanding functionality.

