import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Transaction, Model, ModelStatic } from 'sequelize';

import { sequelize } from '../config/db';
import { Attendance } from '../modules/attendance/model';
import { Candidate } from '../modules/candidate/model';
import { Department } from '../modules/department/model';
import { Designation } from '../modules/designation/model';
import { Document } from '../modules/document/model';
import { Employee } from '../modules/employee/model';
import { Goal } from '../modules/goal/model';
import { Interview } from '../modules/interview/model';
import { JobOpening } from '../modules/job-opening/model';
import { LeaveApplication } from '../modules/leave-application/model';
import { LeaveType } from '../modules/leave-type/model';
import { Location } from '../modules/location/model';
import { OfferLetter } from '../modules/offer-letter/model';
import { Payslip } from '../modules/payslip/model';
import { PerformanceReview } from '../modules/performance-review/model';
import { SalaryStructure } from '../modules/salary-structure/model';
import { User } from '../modules/user/model';

const REQUIRED_DOCUMENTS = ['Resume/CV', 'ID Card/Passport', 'Educational Certificates', 'Experience Letters', 'Bank Account Details'];

const daysAgo = (days: number) => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() - days);
  return value;
};

const daysFromNow = (days: number) => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  value.setDate(value.getDate() + days);
  return value;
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

async function truncateTables(transaction: Transaction, shouldWipe: boolean) {
  if (!shouldWipe) {
    console.warn('Skipping destructive truncate because WIPE_EXISTING_DATA=false');
    return;
  }

  const tables: ModelStatic<Model>[] = [
    Attendance,
    LeaveApplication,
    OfferLetter,
    Interview,
    Candidate,
    JobOpening,
    Payslip,
    Goal,
    PerformanceReview,
    SalaryStructure,
    Document,
    Employee,
    User,
    LeaveType,
    Designation,
    Department,
    Location,
  ].map((model) => model as unknown as ModelStatic<Model>);

  for (const model of tables) {
    await model.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true, transaction });
  }

  console.info('All related tables truncated successfully');
}

async function seed(shouldWipe: boolean, passwordHash: string) {
  await sequelize.transaction(async (transaction) => {
    await truncateTables(transaction, shouldWipe);

    const locations = await Location.bulkCreate(
      [
        { locationName: 'New York HQ' },
        { locationName: 'London Remote' },
        { locationName: 'Singapore Hub' },
      ],
      { transaction, returning: true },
    );
    const locationMap: Record<string, Location> = {};
    locations.forEach((loc) => {
      locationMap[loc.locationName] = loc;
    });

    const departments = await Department.bulkCreate(
      [
        { departmentName: 'Engineering' },
        { departmentName: 'Product' },
        { departmentName: 'People Operations' },
        { departmentName: 'Analytics' },
      ],
      { transaction, returning: true },
    );
    const departmentMap: Record<string, Department> = {};
    departments.forEach((dept) => {
      departmentMap[dept.departmentName] = dept;
    });

    const designations = await Designation.bulkCreate(
      [
        { designationName: 'Director of Engineering' },
        { designationName: 'Senior Software Engineer' },
        { designationName: 'Product Manager' },
        { designationName: 'People Operations Manager' },
        { designationName: 'People Ops Specialist' },
        { designationName: 'Data Analyst' },
      ],
      { transaction, returning: true },
    );
    const designationMap: Record<string, Designation> = {};
    designations.forEach((des) => {
      designationMap[des.designationName] = des;
    });

    const leaveTypes = await LeaveType.bulkCreate(
      [
        { typeName: 'Paid Time Off', maxDaysPerYear: 24, isPaid: true },
        { typeName: 'Sick Leave', maxDaysPerYear: 12, isPaid: true },
        { typeName: 'Work From Home', maxDaysPerYear: 30, isPaid: true },
      ],
      { transaction, returning: true },
    );
    const leaveTypeMap: Record<string, LeaveType> = {};
    leaveTypes.forEach((type) => {
      leaveTypeMap[type.typeName] = type;
    });

    const userSeeds = [
      { username: 'ava.patel', email: 'ava.patel@acmecorp.com', role: 'admin' },
      { username: 'ryan.chen', email: 'ryan.chen@acmecorp.com', role: 'employee' },
      { username: 'priya.nair', email: 'priya.nair@acmecorp.com', role: 'manager' },
      { username: 'jamal.king', email: 'jamal.king@acmecorp.com', role: 'hr' },
      { username: 'ella.rodriguez', email: 'ella.rodriguez@acmecorp.com', role: 'employee' },
      { username: 'noah.khan', email: 'noah.khan@acmecorp.com', role: 'employee' },
    ];
    const users = await User.bulkCreate(
      userSeeds.map((user) => ({
        ...user,
        password: passwordHash,
      })),
      { transaction, returning: true },
    );
    const userMap: Record<string, User> = {};
    users.forEach((user) => {
      userMap[user.username] = user;
    });

    const employees: Record<string, Employee> = {};
    type EmployeeSeedConfig = {
      key: string;
      user: string;
      uniqueId: string;
      firstName: string;
      lastName: string;
      department: string;
      designation: string;
      startDate: Date;
      status: string;
      personalEmail: string;
      phone: string;
      managerKey?: string;
      employmentEndDate?: Date;
    };
    const employeeConfigs: EmployeeSeedConfig[] = [
      {
        key: 'ava',
        user: 'ava.patel',
        uniqueId: 'EMP-1001',
        firstName: 'Ava',
        lastName: 'Patel',
        department: 'Engineering',
        designation: 'Director of Engineering',
        startDate: new Date('2018-01-15'),
        status: 'active',
        personalEmail: 'ava.patel@acmecorp.com',
        phone: '+1-555-0101',
      },
      {
        key: 'ryan',
        user: 'ryan.chen',
        uniqueId: 'EMP-1042',
        firstName: 'Ryan',
        lastName: 'Chen',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        managerKey: 'ava',
        startDate: new Date('2021-05-10'),
        status: 'active',
        personalEmail: 'ryan.chen@acmecorp.com',
        phone: '+1-555-0128',
      },
      {
        key: 'priya',
        user: 'priya.nair',
        uniqueId: 'EMP-1070',
        firstName: 'Priya',
        lastName: 'Nair',
        department: 'Product',
        designation: 'Product Manager',
        managerKey: 'ava',
        startDate: new Date('2022-03-01'),
        status: 'active',
        personalEmail: 'priya.nair@acmecorp.com',
        phone: '+44-20-555-0199',
      },
      {
        key: 'jamal',
        user: 'jamal.king',
        uniqueId: 'EMP-1093',
        firstName: 'Jamal',
        lastName: 'King',
        department: 'People Operations',
        designation: 'People Operations Manager',
        startDate: new Date('2017-09-18'),
        status: 'inactive',
        personalEmail: 'jamal.king@acmecorp.com',
        phone: '+1-555-0192',
      },
      {
        key: 'ella',
        user: 'ella.rodriguez',
        uniqueId: 'EMP-1111',
        firstName: 'Ella',
        lastName: 'Rodriguez',
        department: 'Analytics',
        designation: 'Data Analyst',
        managerKey: 'priya',
        startDate: new Date('2023-08-07'),
        status: 'active',
        personalEmail: 'ella.rodriguez@acmecorp.com',
        phone: '+65-555-2099',
      },
      {
        key: 'noah',
        user: 'noah.khan',
        uniqueId: 'EMP-1130',
        firstName: 'Noah',
        lastName: 'Khan',
        department: 'People Operations',
        designation: 'People Ops Specialist',
        managerKey: 'jamal',
        startDate: daysAgo(12),
        status: 'active',
        personalEmail: 'noah.khan@acmecorp.com',
        phone: '+1-555-0240',
      },
    ];

    for (const config of employeeConfigs) {
      const managerId = config.managerKey ? employees[config.managerKey].employeeId : undefined;
      const employeePayload: any = {
        userId: userMap[config.user].userId,
        employeeUniqueId: config.uniqueId,
        firstName: config.firstName,
        lastName: config.lastName,
        dateOfBirth: new Date('1990-01-01'),
        gender: 'unspecified',
        phoneNumber: config.phone,
        address: 'Not Provided',
        personalEmail: config.personalEmail,
        employmentStartDate: config.startDate,
        departmentId: departmentMap[config.department].departmentId,
        designationId: designationMap[config.designation].designationId,
        status: config.status,
      };

      if (config.employmentEndDate) {
        employeePayload.employmentEndDate = config.employmentEndDate;
      }

      if (managerId) {
        employeePayload.reportingManagerId = managerId;
      }

      const employee = await Employee.create(employeePayload, { transaction });

      employees[config.key] = employee;
    }

    const docBaseUrl = 'https://cdn.acme-hrms.com/docs';
    const documentPayload = [
      { employee: 'ryan', doc: 'Resume/CV' },
      { employee: 'ryan', doc: 'ID Card/Passport' },
      { employee: 'ryan', doc: 'Educational Certificates' },
      { employee: 'ryan', doc: 'Bank Account Details' },
      { employee: 'priya', doc: 'Resume/CV' },
      { employee: 'priya', doc: 'ID Card/Passport' },
      { employee: 'ella', doc: 'Resume/CV' },
      { employee: 'ella', doc: 'ID Card/Passport' },
      { employee: 'noah', doc: 'Resume/CV' },
    ];

    await Document.bulkCreate(
      documentPayload.map((item) => ({
        employeeId: employees[item.employee].employeeId,
        documentType: item.doc,
        fileName: `${slugify(item.employee)}-${slugify(item.doc)}.pdf`,
        fileUrl: `${docBaseUrl}/${slugify(item.employee)}-${slugify(item.doc)}.pdf`,
        uploadedBy: 'jamal.king',
      })),
      { transaction },
    );

    const salaryStructures = [
      {
        employee: 'ava',
        basicSalary: 180000,
        allowance: { leadershipBonus: 25000, housing: 18000 },
        deduction: { federalTax: 32000 },
      },
      {
        employee: 'ryan',
        basicSalary: 135000,
        allowance: { housing: 12000, internet: 1200 },
        deduction: { federalTax: 25000 },
      },
      {
        employee: 'priya',
        basicSalary: 140000,
        allowance: { productBonus: 18000 },
        deduction: { tax: 26000 },
      },
      {
        employee: 'ella',
        basicSalary: 95000,
        allowance: { skillBonus: 6000 },
        deduction: { tax: 17000 },
      },
    ];

    await SalaryStructure.bulkCreate(
      salaryStructures.map((item) => ({
        employeeId: employees[item.employee].employeeId,
        basicSalary: item.basicSalary,
        allowance: item.allowance,
        deduction: item.deduction,
        effectiveDate: daysAgo(120),
        status: 'active',
      })),
      { transaction },
    );

    const leaveRequests = [
      { employee: 'ryan', leaveType: 'Paid Time Off', startOffset: 6, days: 2, status: 'Approved' },
      { employee: 'priya', leaveType: 'Sick Leave', startOffset: 2, days: 1, status: 'Pending' },
      { employee: 'ella', leaveType: 'Work From Home', startOffset: 1, days: 1, status: 'Rejected' },
      { employee: 'jamal', leaveType: 'Paid Time Off', startOffset: 0, days: 1, status: 'approved' },
    ];

    await LeaveApplication.bulkCreate(
      leaveRequests.map((request) => {
        const startDate = daysAgo(request.startOffset);
        const endDate = daysAgo(request.startOffset - (request.days - 1));
        return {
          employeeId: employees[request.employee].employeeId,
          leaveTypeId: leaveTypeMap[request.leaveType].leaveTypeId,
          startDate,
          endDate,
          numberOfDay: request.days,
          reason: `${request.leaveType} request`,
          status: request.status,
          appliedBy: employees[request.employee].employeeId,
        };
      }),
      { transaction },
    );

    const jobOpenings: Record<string, JobOpening> = {};
    const jobConfigs = [
      {
        key: 'platformLead',
        title: 'Platform Engineering Lead',
        department: 'Engineering',
        designation: 'Senior Software Engineer',
        location: 'New York HQ',
        description: 'Own observability, performance budgets, and reliability initiatives.',
        status: 'open',
        requiredExperience: 7,
        publishedOffset: 12,
      },
      {
        key: 'productAnalyst',
        title: 'Product Analytics Partner',
        department: 'Product',
        designation: 'Product Manager',
        location: 'London Remote',
        description: 'Marry qualitative research with product analytics to shape roadmap decisions.',
        status: 'open',
        requiredExperience: 4,
        publishedOffset: 8,
      },
      {
        key: 'peopleOpsPartner',
        title: 'People Ops Business Partner',
        department: 'People Operations',
        designation: 'People Ops Specialist',
        location: 'Singapore Hub',
        description: 'Scale onboarding, experience audits, and compliance readiness.',
        status: 'closed',
        requiredExperience: 5,
        publishedOffset: 25,
        closedOffset: 4,
      },
    ];

    for (const job of jobConfigs) {
      const created = await JobOpening.create(
        {
          title: job.title,
          description: job.description,
          departmentId: departmentMap[job.department].departmentId,
          designationId: designationMap[job.designation].designationId,
          locationId: locationMap[job.location].locationId,
          requiredExperience: job.requiredExperience,
          status: job.status,
          publishedAt: daysAgo(job.publishedOffset),
          createdBy: employees.ava.userId,
          ...(job.closedOffset ? { closedAt: daysAgo(job.closedOffset) } : {}),
        },
        { transaction },
      );
      jobOpenings[job.key] = created;
    }

    const candidateConfigs = [
      {
        key: 'arjun',
        firstName: 'Arjun',
        lastName: 'Mehta',
        email: 'arjun.mehta@example.com',
        status: 'Interviewing',
        source: 'Referral',
        job: 'platformLead',
        referredBy: 'ryan',
        createdOffset: 5,
      },
      {
        key: 'sophia',
        firstName: 'Sophia',
        lastName: 'Walsh',
        email: 'sophia.walsh@example.com',
        status: 'Offer Extended',
        source: 'LinkedIn',
        job: 'productAnalyst',
        createdOffset: 3,
      },
      {
        key: 'diego',
        firstName: 'Diego',
        lastName: 'Ramirez',
        email: 'diego.ramirez@example.com',
        status: 'Applied',
        source: 'Career Fair',
        job: 'platformLead',
        createdOffset: 1,
      },
      {
        key: 'lena',
        firstName: 'Lena',
        lastName: 'Schmidt',
        email: 'lena.schmidt@example.com',
        status: 'Rejected',
        source: 'Agency',
        job: 'peopleOpsPartner',
        createdOffset: 15,
      },
    ];
    const candidates: Record<string, Candidate> = {};
    for (const cand of candidateConfigs) {
      const candidate = await Candidate.create(
        {
          firstName: cand.firstName,
          lastName: cand.lastName,
          email: cand.email,
          phoneNumber: '+1-555-3000',
          resumeText: `${cand.firstName} ${cand.lastName} resume text`,
          source: cand.source,
          currentStatus: cand.status,
          jobOpeningId: jobOpenings[cand.job].jobOpeningId,
          ...(cand.referredBy ? { referredByEmployeeId: employees[cand.referredBy].employeeId } : {}),
          createdAt: daysAgo(cand.createdOffset),
          updatedAt: daysAgo(cand.createdOffset - 1),
        },
        { transaction },
      );
      candidates[cand.key] = candidate;
    }

    await OfferLetter.bulkCreate(
      [
        {
          candidateId: candidates.sophia.candidateId,
          jobOpeningId: jobOpenings.productAnalyst.jobOpeningId,
          salaryOffered: 105000,
          joiningDate: daysFromNow(30),
          status: 'Issued',
          issuedBy: 'jamal.king',
          termsAndCondition: 'Standard employment contract with equity options.',
        },
        {
          candidateId: candidates.arjun.candidateId,
          jobOpeningId: jobOpenings.platformLead.jobOpeningId,
          salaryOffered: 150000,
          joiningDate: daysFromNow(45),
          status: 'Draft',
          issuedBy: 'jamal.king',
          termsAndCondition: 'Pending board approval.',
        },
      ],
      { transaction },
    );

    await Interview.bulkCreate(
      [
        {
          candidateId: candidates.arjun.candidateId,
          jobOpeningId: jobOpenings.platformLead.jobOpeningId,
          interviewerId: employees.ava.employeeId,
          interviewDate: daysFromNow(2),
          status: 'Scheduled',
        },
        {
          candidateId: candidates.diego.candidateId,
          jobOpeningId: jobOpenings.platformLead.jobOpeningId,
          interviewerId: employees.ryan.employeeId,
          interviewDate: daysFromNow(5),
          status: 'Scheduled',
        },
        {
          candidateId: candidates.lena.candidateId,
          jobOpeningId: jobOpenings.peopleOpsPartner.jobOpeningId,
          interviewerId: employees.jamal.employeeId,
          interviewDate: daysAgo(2),
          status: 'Completed',
          feedback: 'Strong culture fit but another candidate accepted.',
          rating: 4,
        },
      ],
      { transaction },
    );

    const attendancePatterns: Record<
      string,
      {
        late?: number[];
        absent?: number[];
        missingCheckout?: number[];
      }
    > = {
      ryan: { late: [1], absent: [3] },
      priya: { late: [2] },
      jamal: { absent: [0] },
      ella: { late: [0, 4], missingCheckout: [0] },
      noah: { late: [0], absent: [5] },
    };

    const attendanceRows: Array<{
      employeeId: string;
      attendanceDate: Date;
      checkInTime: Date | null;
      checkOutTime: Date | null;
      status: string;
    }> = [];

    Object.entries(employees).forEach(([key, employee]) => {
      let recordedDays = 0;
      let dayOffset = 0;
      while (recordedDays < 12) {
        const attendanceDate = daysAgo(dayOffset);
        dayOffset += 1;
        const isWeekend = attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6;
        if (isWeekend) {
          continue;
        }

        const pattern = attendancePatterns[key] || {};
        let status: 'Present' | 'Late' | 'Absent' = 'Present';
        if (pattern.absent?.includes(recordedDays)) {
          status = 'Absent';
        } else if (pattern.late?.includes(recordedDays)) {
          status = 'Late';
        }

        let checkInTime: Date | null = null;
        let checkOutTime: Date | null = null;

        if (status !== 'Absent') {
          checkInTime = new Date(attendanceDate);
          const hourOffset = status === 'Late' ? 10 : 9;
          checkInTime.setHours(hourOffset, 15, 0, 0);

          checkOutTime = new Date(attendanceDate);
          checkOutTime.setHours(17, 30, 0, 0);

          if (pattern.missingCheckout?.includes(recordedDays)) {
            checkOutTime = null;
          }
        }

        attendanceRows.push({
          employeeId: employee.employeeId,
          attendanceDate,
          checkInTime,
          checkOutTime,
          status,
        });

        recordedDays += 1;
      }
    });

    await Attendance.bulkCreate(attendanceRows, { transaction });

    await PerformanceReview.bulkCreate(
      [
        {
          employeeId: employees.ryan.employeeId,
          reviewerId: employees.ava.employeeId,
          reviewPeriod: '2024-Q4',
          reviewDate: daysAgo(20),
          selfAssessment: 'Delivered observability overhaul.',
          managerFeedback: 'Great focus on reliability; continue mentoring juniors.',
          overallRating: 4,
          recommendation: 'Promotion ready within 6 months.',
          status: 'Completed',
        },
        {
          employeeId: employees.priya.employeeId,
          reviewerId: employees.ava.employeeId,
          reviewPeriod: '2025-Q1',
          reviewDate: daysFromNow(10),
          selfAssessment: 'Leading beta program planning.',
          status: 'Pending',
        },
      ],
      { transaction },
    );

    await Goal.bulkCreate(
      [
        {
          employeeId: employees.ryan.employeeId,
          title: 'Reduce MTTR',
          description: 'Bring incident mean time to recovery under 45 minutes.',
          kpi: { targetMinutes: 45 } as any,
          period: 'FY25-H1',
          startDate: daysAgo(45),
          endDate: daysFromNow(60),
          status: 'In Progress',
          assignedBy: employees.ava.employeeId,
        },
        {
          employeeId: employees.priya.employeeId,
          title: 'Launch insights workspace',
          description: 'Ship MVP for insights workspace with 3 lighthouse customers.',
          kpi: { customers: 3 } as any,
          period: 'FY25-H1',
          startDate: daysAgo(30),
          endDate: daysFromNow(45),
          status: 'Draft',
          assignedBy: employees.ava.employeeId,
        },
        {
          employeeId: employees.ella.employeeId,
          title: 'Data quality automation',
          description: 'Automate anomaly alerts for payroll and attendance feeds.',
          kpi: { alerts: 'daily' } as any,
          period: 'FY25-H1',
          startDate: daysAgo(60),
          endDate: daysAgo(5),
          status: 'Completed',
          assignedBy: employees.priya.employeeId,
        },
        {
          employeeId: employees.noah.employeeId,
          title: 'Onboarding revamp',
          description: 'Document new touchpoints for onboarding journey.',
          kpi: { steps: 12 } as any,
          period: 'FY25-H2',
          startDate: daysAgo(10),
          endDate: daysFromNow(30),
          status: 'Cancelled',
          assignedBy: employees.jamal.employeeId,
        },
      ],
      { transaction },
    );

    const payslipBaseUrl = 'https://cdn.acme-hrms.com/payslips';
    const payslipConfigs = [
      { employee: 'ryan', gross: 15000, net: 12500, allowances: 2800, deductions: 3500 },
      { employee: 'priya', gross: 15200, net: 12900, allowances: 3200, deductions: 3500 },
      { employee: 'ella', gross: 8200, net: 6900, allowances: 1400, deductions: 1700 },
    ];

    await Payslip.bulkCreate(
      payslipConfigs.map((item) => ({
        employeeId: employees[item.employee].employeeId,
        payPeriodStart: daysAgo(30),
        payPeriodEnd: daysAgo(1),
        grossSalary: item.gross,
        netSalary: item.net,
        deductionsAmount: item.deductions,
        allowancesAmount: item.allowances,
        pdfUrl: `${payslipBaseUrl}/${slugify(item.employee)}-${daysAgo(1).toISOString().split('T')[0]}.pdf`,
        generatedBy: 'payroll.bot',
      })),
      { transaction },
    );

    const [employeeCount, attendanceCount, jobOpeningCount, candidateCount, leaveCount] = await Promise.all([
      Employee.count({ transaction }),
      Attendance.count({ transaction }),
      JobOpening.count({ transaction }),
      Candidate.count({ transaction }),
      LeaveApplication.count({ transaction }),
    ]);

    console.info('Seed summary', { employees: employeeCount, attendance: attendanceCount, jobOpenings: jobOpeningCount, candidates: candidateCount, leaveApplications: leaveCount });
  });
}

async function run() {
  const shouldWipe = process.env.WIPE_EXISTING_DATA !== 'false';
  const defaultPassword = process.env.SEED_USER_PASSWORD ?? 'ChangeMe#2025';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  try {
    await seed(shouldWipe, passwordHash);
    console.info('Dashboard + Hyper data seeding finished successfully');
  } catch (error) {
    console.error('Seeding failed', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void run();
