import { RouteConfig } from '../../util/routeConfig';
import { AttendanceRoutes } from '../../modules/attendance/router';
import { AuditLogRoutes } from '../../modules/audit-log/router';
import { CandidateRoutes } from '../../modules/candidate/router';
import { CandidateSkillRoutes } from '../../modules/candidate-skill/router';
import { CompetencyRoutes } from '../../modules/competency/router';
import { DashboardRoutes } from '../../modules/dashboard/router';
import { DepartmentRoutes } from '../../modules/department/router';
import { DesignationRoutes } from '../../modules/designation/router';
import { DocumentRoutes } from '../../modules/document/router';
import { EmployeeCompetencyRoutes } from '../../modules/employee-competency/router';
import { EmployeeRoutes } from '../../modules/employee/router';
import { GoalRoutes } from '../../modules/goal/router';
import { InterviewRoutes } from '../../modules/interview/router';
import { JobLevelRoutes } from '../../modules/job-level/router';
import { JobOpeningRoutes } from '../../modules/job-opening/router';
import { JobOpeningSkillRoutes } from '../../modules/job-opening-skill/router';
import { LearningPlanRoutes } from '../../modules/learning-plan/router';
import { LeaveApplicationRoutes } from '../../modules/leave-application/router';
import { LeaveTypeRoutes } from '../../modules/leave-type/router';
import { LocationRoutes } from '../../modules/location/router';
import { OfferLetterRoutes } from '../../modules/offer-letter/router';
import { PayslipRoutes } from '../../modules/payslip/router';
import { PerformanceReviewRoutes } from '../../modules/performance-review/router';
import { RoleCompetencyRoutes } from '../../modules/role-competency/router';
import { SalaryStructureRoutes } from '../../modules/salary-structure/router';
import { SkillRoutes } from '../../modules/skill/router';
import { UserRoutes } from '../../modules/user/router';
import { UserAuthRoutes } from '../../modules/user-auth/router';
export const defaultRoutes: RouteConfig[] = [
{ path: '/attendances', tags: ['api', 'Attendance'], routes: AttendanceRoutes },
{ path: '/audit-logs', tags: ['api', 'Audit Log'], routes: AuditLogRoutes },
{ path: '/candidates', tags: ['api', 'Candidate'], routes: CandidateRoutes },
{ path: '/candidate-skills', tags: ['api', 'Candidate Skill'], routes: CandidateSkillRoutes },
{ path: '/competencies', tags: ['api', 'Competency'], routes: CompetencyRoutes },
{ path: '/dashboard', tags: ['api', 'Dashboard'], routes: DashboardRoutes },
{ path: '/departments', tags: ['api', 'Department'], routes: DepartmentRoutes },
{ path: '/designations', tags: ['api', 'Designation'], routes: DesignationRoutes },
{ path: '/documents', tags: ['api', 'Document'], routes: DocumentRoutes },
{ path: '/employee-competencies', tags: ['api', 'Employee Competency'], routes: EmployeeCompetencyRoutes },
{ path: '/employees', tags: ['api', 'Employee'], routes: EmployeeRoutes },
{ path: '/goals', tags: ['api', 'Goal'], routes: GoalRoutes },
{ path: '/interviews', tags: ['api', 'Interview'], routes: InterviewRoutes },
{ path: '/job-levels', tags: ['api', 'Job Level'], routes: JobLevelRoutes },
{ path: '/job-openings', tags: ['api', 'Job Opening'], routes: JobOpeningRoutes },
{ path: '/job-opening-skills', tags: ['api', 'Job Opening Skill'], routes: JobOpeningSkillRoutes },
{ path: '/learning-plans', tags: ['api', 'Learning Plan'], routes: LearningPlanRoutes },
{ path: '/leave-applications', tags: ['api', 'Leave Application'], routes: LeaveApplicationRoutes },
{ path: '/leave-types', tags: ['api', 'Leave Type'], routes: LeaveTypeRoutes },
{ path: '/locations', tags: ['api', 'Location'], routes: LocationRoutes },
{ path: '/offer-letters', tags: ['api', 'Offer Letter'], routes: OfferLetterRoutes },
{ path: '/payslips', tags: ['api', 'Payslip'], routes: PayslipRoutes },
{ path: '/performance-reviews', tags: ['api', 'Performance Review'], routes: PerformanceReviewRoutes },
{ path: '/role-competencies', tags: ['api', 'Role Competency'], routes: RoleCompetencyRoutes },
{ path: '/salary-structures', tags: ['api', 'Salary Structure'], routes: SalaryStructureRoutes },
{ path: '/skills', tags: ['api', 'Skill'], routes: SkillRoutes },
{ path: '/users', tags: ['api', 'User'], routes: UserRoutes },
{ path: '/users-auth', tags: ['api', 'User Auth'], routes: UserAuthRoutes },
];