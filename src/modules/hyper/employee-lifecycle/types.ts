export interface MissingDocument {
  employeeId: string;
  employeeName: string;
  department: string;
  missingDocuments: string[];
  daysOverdue: number;
}

export interface IncompleteOnboarding {
  employeeId: string;
  employeeName: string;
  joinDate: Date;
  daysDelayed: number;
  completionPercentage: number;
  pendingItems: string[];
}

export interface DepartmentChange {
  employeeId: string;
  employeeName: string;
  previousDepartment: string;
  newDepartment: string;
  changeDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface RoleMismatch {
  employeeId: string;
  employeeName: string;
  hrmRole: string;
  payrollRole: string;
  department: string;
  issueType: 'designation_mismatch' | 'salary_structure_missing' | 'department_mismatch';
}

export interface PendingVerification {
  employeeId: string;
  employeeName: string;
  verificationType: 'document' | 'profile' | 'credentials';
  itemName: string;
  submittedDate: Date;
  pendingDays: number;
}

export interface NewHire {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joinDate: Date;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  assignedMentor?: string;
}

export interface OffboardingItem {
  employeeId: string;
  employeeName: string;
  lastWorkingDay: Date;
  exitType: 'resignation' | 'termination' | 'retirement';
  clearanceItems: {
    item: string;
    status: 'pending' | 'completed';
    completedDate?: Date;
  }[];
  finalSettlementStatus: 'pending' | 'processed';
}
