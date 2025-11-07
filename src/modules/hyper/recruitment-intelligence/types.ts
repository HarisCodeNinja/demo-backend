export interface PendingFeedback {
  interviewId: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  interviewDate: Date;
  daysPending: number;
  interviewRound: string;
}

export interface CandidateMatch {
  candidateId: string;
  candidateName: string;
  email: string;
  phone: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceYears: number;
  currentStage: string;
  appliedDate: Date;
}

export interface HiringFunnel {
  stage: string;
  count: number;
  percentage: number;
  avgDaysInStage: number;
}

export interface PipelineSummary {
  jobOpeningId: string;
  jobTitle: string;
  department: string;
  totalApplicants: number;
  newApplications: number;
  shortlisted: number;
  interviewing: number;
  offered: number;
  hired: number;
  rejected: number;
  daysOpen: number;
  recruiters: string[];
}

export interface OverdueInterview {
  interviewId: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  scheduledDate: Date;
  daysOverdue: number;
  feedbackStatus: 'not_submitted' | 'pending_review';
}

export interface RecruiterPerformance {
  recruiterId: string;
  recruiterName: string;
  activeJobOpenings: number;
  totalCandidates: number;
  candidatesShortlisted: number;
  interviewsScheduled: number;
  offersExtended: number;
  hires: number;
  avgTimeToHire: number;
  avgTimeToShortlist: number;
}
