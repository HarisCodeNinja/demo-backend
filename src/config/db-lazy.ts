import { Sequelize, Options } from 'sequelize';
import { env } from './env';
import logger from '../util/logger';

// Import all your model initializers (same as before)
import { initializeUser } from './../modules/user/model';
import { initializeDepartment } from './../modules/department/model';
import { initializeLocation } from './../modules/location/model';
import { initializeSkill } from './../modules/skill/model';
import { establishRelationsJobOpening, initializeJobOpening } from './../modules/job-opening/model';
import { establishRelationsCandidateSkill, initializeCandidateSkill } from './../modules/candidate-skill/model';
import { establishRelationsJobOpeningSkill, initializeJobOpeningSkill } from './../modules/job-opening-skill/model';
import { establishRelationsDocument, initializeDocument } from './../modules/document/model';
import { establishRelationsLeaveApplication, initializeLeaveApplication } from './../modules/leave-application/model';
import { initializeLeaveType } from './../modules/leave-type/model';
import { establishRelationsSalaryStructure, initializeSalaryStructure } from './../modules/salary-structure/model';
import { establishRelationsPayslip, initializePayslip } from './../modules/payslip/model';
import { establishRelationsGoal, initializeGoal } from './../modules/goal/model';
import { initializeJobLevel } from './../modules/job-level/model';
import { establishRelationsPerformanceReview, initializePerformanceReview } from './../modules/performance-review/model';
import { establishRelationsEmployeeCompetency, initializeEmployeeCompetency } from './../modules/employee-competency/model';
import { establishRelationsLearningPlan, initializeLearningPlan } from './../modules/learning-plan/model';
import { establishRelationsRoleCompetency, initializeRoleCompetency } from './../modules/role-competency/model';
import { establishRelationsAttendance, initializeAttendance } from './../modules/attendance/model';
import { establishRelationsAuditLog, initializeAuditLog } from './../modules/audit-log/model';
import { establishRelationsCandidate, initializeCandidate } from './../modules/candidate/model';
import { initializeCompetency } from './../modules/competency/model';
import { initializeDesignation } from './../modules/designation/model';
import { establishRelationsEmployee, initializeEmployee } from './../modules/employee/model';
import { establishRelationsInterview, initializeInterview } from './../modules/interview/model';
import { establishRelationsOfferLetter, initializeOfferLetter } from './../modules/offer-letter/model';
import { initializePasswordResetToken, establishRelationsPasswordResetToken } from './../modules/password/models/password-reset-token';
import { registerEmployeeOnboardingEmailWorkflow } from '../automations/employee-onboarding-email-workflow';

const CONFIG: Options = {
  host: env.DB_HOST,
  dialect: 'postgres',
  port: Number(process.env.DB_PORT),
  timezone: '+05:00',
  dialectOptions: {
    useUTC: false,
    timezone: '+05:00',
    typeCast: true,
    pgLocal: true,
  },
  logging: false,
  pool: {
    max: 15,
    min: 0,
    acquire: 50000,
    idle: 10000,
  },
  define: {
    timestamps: false,
  },
};

export const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASS as string, CONFIG);

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) {
    return sequelize;
  }

  try {
    await sequelize.authenticate();
    console.error('Database connected successfully');

    await sequelize.sync({ force: false });
    console.error('Database synced');

    // Initialize all models
    initializeUser(sequelize);
    initializeDepartment(sequelize);
    initializeLocation(sequelize);
    initializeSkill(sequelize);
    initializeJobOpening(sequelize);
    initializeCandidateSkill(sequelize);
    initializeJobOpeningSkill(sequelize);
    initializeDocument(sequelize);
    initializeLeaveApplication(sequelize);
    initializeLeaveType(sequelize);
    initializeSalaryStructure(sequelize);
    initializePayslip(sequelize);
    initializeGoal(sequelize);
    initializeJobLevel(sequelize);
    initializePerformanceReview(sequelize);
    initializeEmployeeCompetency(sequelize);
    initializeLearningPlan(sequelize);
    initializeRoleCompetency(sequelize);
    initializeAttendance(sequelize);
    initializeAuditLog(sequelize);
    initializeCandidate(sequelize);
    initializeCompetency(sequelize);
    initializeDesignation(sequelize);
    initializeEmployee(sequelize);
    initializeInterview(sequelize);
    initializeOfferLetter(sequelize);
    initializePasswordResetToken(sequelize);

    // Establish all relations
    establishRelationsJobOpening();
    establishRelationsCandidateSkill();
    establishRelationsJobOpeningSkill();
    establishRelationsDocument();
    establishRelationsLeaveApplication();
    establishRelationsSalaryStructure();
    establishRelationsPayslip();
    establishRelationsGoal();
    establishRelationsPerformanceReview();
    establishRelationsEmployeeCompetency();
    establishRelationsLearningPlan();
    establishRelationsRoleCompetency();
    establishRelationsAttendance();
    establishRelationsAuditLog();
    establishRelationsCandidate();
    establishRelationsEmployee();
    establishRelationsInterview();
    establishRelationsOfferLetter();
    establishRelationsPasswordResetToken();

    registerEmployeeOnboardingEmailWorkflow();

    isInitialized = true;
    console.error('Database initialization complete');

    return sequelize;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}
