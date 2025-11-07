import { Request } from 'express';
import { Op } from 'sequelize';
import { Employee } from '../../employee/model';
import { Department } from '../../department/model';
import { Designation } from '../../designation/model';
import { Document } from '../../document/model';
import { SalaryStructure } from '../../salary-structure/model';
import { User } from '../../user/model';
import { MissingDocument, IncompleteOnboarding, DepartmentChange, RoleMismatch, PendingVerification, NewHire } from './types';

/**
 * Get employees with missing documents
 */
export const getMissingDocuments = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get all employees with their documents
  const employees = await Employee.findAll({
    include: [
      {
        model: Document,
        as: 'documents',
        required: false,
      },
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
    ],
    limit,
    offset,
  });

  // Required document types for all employees
  const requiredDocuments = ['Resume/CV', 'ID Card/Passport', 'Educational Certificates', 'Experience Letters', 'Bank Account Details'];

  const missingDocumentsData: MissingDocument[] = [];

  for (const employee of employees) {
    const employeeDocs = (employee as any).documents || [];
    const existingDocTypes = employeeDocs.map((doc: any) => doc.documentType);
    const missing = requiredDocuments.filter((reqDoc) => !existingDocTypes.includes(reqDoc));

    if (missing.length > 0) {
      const joinDate = new Date(employee.employmentStartDate || Date.now());
      const daysOverdue = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

      missingDocumentsData.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: (employee as any).department?.departmentName || 'N/A',
        missingDocuments: missing,
        daysOverdue,
      });
    }
  }

  return {
    data: missingDocumentsData,
    meta: {
      total: missingDocumentsData.length,
      message: `Found ${missingDocumentsData.length} employees with missing documents`,
    },
  };
};

/**
 * Get employees with incomplete onboarding
 */
export const getIncompleteOnboarding = async (req: Request, query: any) => {
  const daysThreshold = query.days || 30;
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get recent hires
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

  const employees = await Employee.findAll({
    where: {
      employmentStartDate: {
        [Op.gte]: thresholdDate,
      },
    },
    include: [
      {
        model: Document,
        as: 'documents',
        required: false,
      },
      {
        model: SalaryStructure,
        as: 'salaryStructures',
        required: false,
      },
      {
        model: User,
        as: 'user',
        required: false,
      },
    ],
    limit,
    offset,
  });

  const incompleteOnboardingData: IncompleteOnboarding[] = [];

  for (const employee of employees) {
    const pendingItems: string[] = [];
    let completedItems = 0;
    const totalItems = 5; // Total onboarding checklist items

    // Check documents
    const documents = (employee as any).documents || [];
    if (documents.length < 3) {
      pendingItems.push('Upload required documents');
    } else {
      completedItems++;
    }

    // Check salary structure
    const salaryStructures = (employee as any).salaryStructures || [];
    if (salaryStructures.length === 0) {
      pendingItems.push('Configure salary structure');
    } else {
      completedItems++;
    }

    // Check user account
    const user = (employee as any).user;
    if (!user) {
      pendingItems.push('Create user account');
    } else {
      completedItems++;
    }

    // Check basic profile completion
    if (!employee.personalEmail || !employee.phoneNumber) {
      pendingItems.push('Complete personal information');
    } else {
      completedItems++;
    }

    // Check reporting manager assignment
    if (!employee.reportingManagerId) {
      pendingItems.push('Assign reporting manager');
    } else {
      completedItems++;
    }

    const completionPercentage = Math.round((completedItems / totalItems) * 100);

    if (pendingItems.length > 0) {
      const joinDate = new Date(employee.employmentStartDate || Date.now());
      const daysDelayed = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

      incompleteOnboardingData.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        joinDate,
        daysDelayed,
        completionPercentage,
        pendingItems,
      });
    }
  }

  return {
    data: incompleteOnboardingData,
    meta: {
      total: incompleteOnboardingData.length,
      message: `Found ${incompleteOnboardingData.length} employees with incomplete onboarding`,
    },
  };
};

/**
 * Get department change requests/history
 */
export const getDepartmentChanges = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // For this demo, we'll track recent department changes
  // In production, you'd have a separate DepartmentChangeRequest table
  const employees = await Employee.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
    ],
    order: [['updatedAt', 'DESC']],
    limit,
    offset,
  });

  // This is a simplified version - in production you'd track historical changes
  const departmentChanges: DepartmentChange[] = employees
    .filter((emp) => {
      const updatedRecently = new Date(emp.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
      return updatedRecently;
    })
    .map((emp) => ({
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      previousDepartment: 'Previous Dept', // Would come from audit log
      newDepartment: (emp as any).department?.departmentName || 'N/A',
      changeDate: emp.updatedAt,
      approvalStatus: 'approved' as const,
    }));

  return {
    data: departmentChanges,
    meta: {
      total: departmentChanges.length,
      message: `Found ${departmentChanges.length} recent department changes`,
    },
  };
};

/**
 * Detect role/data mismatches between HRM and Payroll
 */
export const getRoleMismatches = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const employees = await Employee.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
      {
        model: SalaryStructure,
        as: 'salaryStructures',
        required: false,
      },
    ],
    limit,
    offset,
  });

  const mismatches: RoleMismatch[] = [];

  for (const employee of employees) {
    const salaryStructures = (employee as any).salaryStructures || [];

    // Check if employee has no salary structure (mismatch)
    if (salaryStructures.length === 0) {
      mismatches.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        hrmRole: (employee as any).designation?.designationName || 'N/A',
        payrollRole: 'Missing',
        department: (employee as any).department?.departmentName || 'N/A',
        issueType: 'salary_structure_missing',
      });
    }
  }

  return {
    data: mismatches,
    meta: {
      total: mismatches.length,
      message: `Found ${mismatches.length} role/data mismatches`,
    },
  };
};

/**
 * Get items pending verification
 */
export const getPendingVerifications = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get documents pending verification
  const employees = await Employee.findAll({
    include: [
      {
        model: Document,
        as: 'documents',
        where: {
          verificationStatus: {
            [Op.or]: ['pending', 'submitted', null],
          },
        },
        required: true,
      },
    ],
    limit,
    offset,
  });

  const pendingVerifications: PendingVerification[] = [];

  for (const employee of employees) {
    const documents = (employee as any).documents || [];

    for (const doc of documents) {
      const submittedDate = new Date(doc.uploadDate || doc.createdAt);
      const pendingDays = Math.floor((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));

      pendingVerifications.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        verificationType: 'document',
        itemName: doc.documentType || 'Unknown Document',
        submittedDate,
        pendingDays,
      });
    }
  }

  return {
    data: pendingVerifications,
    meta: {
      total: pendingVerifications.length,
      message: `Found ${pendingVerifications.length} items pending verification`,
    },
  };
};

/**
 * Get new hires summary
 */
export const getNewHiresSummary = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Default to last 30 days
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  const employees = await Employee.findAll({
    where: {
      employmentStartDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
      {
        model: Employee,
        as: 'reportingManager',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: Document,
        as: 'documents',
        required: false,
      },
      {
        model: SalaryStructure,
        as: 'salaryStructures',
        required: false,
      },
    ],
    order: [['joiningDate', 'DESC']],
    limit,
    offset,
  });

  const newHires: NewHire[] = employees.map((emp) => {
    const documents = (emp as any).documents || [];
    const salaryStructures = (emp as any).salaryStructures || [];
    const hasBasicInfo = emp.personalEmail && emp.phoneNumber;

    let onboardingStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started';

    const completionItems = [documents.length >= 3, salaryStructures.length > 0, hasBasicInfo, emp.reportingManagerId];

    const completedCount = completionItems.filter(Boolean).length;

    if (completedCount === 0) {
      onboardingStatus = 'not_started';
    } else if (completedCount === completionItems.length) {
      onboardingStatus = 'completed';
    } else {
      onboardingStatus = 'in_progress';
    }

    return {
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      designation: (emp as any).designation?.designationName || 'N/A',
      department: (emp as any).department?.departmentName || 'N/A',
      joinDate: new Date(emp.employmentStartDate || Date.now()),
      onboardingStatus,
      assignedMentor: (emp as any).reportingManager ? `${(emp as any).reportingManager.firstName} ${(emp as any).reportingManager.lastName}` : undefined,
    };
  });

  return {
    data: newHires,
    meta: {
      total: newHires.length,
      message: `Found ${newHires.length} new hires`,
      summary: {
        notStarted: newHires.filter((h) => h.onboardingStatus === 'not_started').length,
        inProgress: newHires.filter((h) => h.onboardingStatus === 'in_progress').length,
        completed: newHires.filter((h) => h.onboardingStatus === 'completed').length,
      },
    },
  };
};

/**
 * Get offboarding checklist
 * Note: This requires additional table for tracking exit/offboarding
 * This is a placeholder implementation
 */
export const getOffboardingChecklist = async (req: Request, query: any) => {
  // This would typically query an Offboarding or Exit table
  // For now, returning empty data structure
  return {
    data: [],
    meta: {
      total: 0,
      message: 'No active offboarding processes',
      note: 'Requires Offboarding table implementation',
    },
  };
};
