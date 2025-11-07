import { Request } from 'express';
import { Op } from 'sequelize';
import { Candidate } from '../../candidate/model';
import { JobOpening } from '../../job-opening/model';
import { Interview } from '../../interview/model';
import { OfferLetter } from '../../offer-letter/model';
import { Employee } from '../../employee/model';
import { Department } from '../../department/model';
import { Designation } from '../../designation/model';
import { Skill } from '../../skill/model';
import { CandidateSkill } from '../../candidate-skill/model';
import { JobOpeningSkill } from '../../job-opening-skill/model';
import { PendingFeedback, CandidateMatch, HiringFunnel, PipelineSummary, OverdueInterview, RecruiterPerformance } from './types';

/**
 * Get interviews pending feedback
 */
export const getPendingFeedback = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const interviews = await Interview.findAll({
    where: {
      feedback: {
        [Op.or]: [null, ''],
      } as any,
      interviewDate: {
        [Op.lt]: new Date(), // Past interviews only
      },
    },
    include: [
      {
        model: Candidate,
        as: 'candidate',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: JobOpening,
        as: 'jobOpening',
        include: [
          {
            model: Designation,
            as: 'designation',
            attributes: ['designationName'],
          },
        ],
      },
      {
        model: Employee,
        as: 'interviewer',
        attributes: ['firstName', 'lastName'],
      },
    ],
    order: [['interviewDate', 'ASC']],
    limit,
    offset,
  });

  const pendingFeedbackData: PendingFeedback[] = interviews.map((interview) => {
    const interviewDate = new Date(interview.interviewDate);
    const daysPending = Math.floor((Date.now() - interviewDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      interviewId: interview.interviewId,
      candidateName: `${(interview as any).candidate?.firstName || ''} ${(interview as any).candidate?.lastName || ''}`,
      jobTitle: (interview as any).jobOpening?.designation?.designationName || 'N/A',
      interviewerName: `${(interview as any).interviewer?.firstName || ''} ${(interview as any).interviewer?.lastName || ''}`,
      interviewDate,
      daysPending,
      interviewRound: 'Interview', // Field not available in schema
    };
  });

  return {
    data: pendingFeedbackData,
    meta: {
      total: pendingFeedbackData.length,
      message: `Found ${pendingFeedbackData.length} interviews pending feedback`,
    },
  };
};

/**
 * Get candidate matching scores for a job opening
 */
export const getCandidateMatching = async (req: Request, query: any) => {
  const { jobOpeningId, minMatchScore = 0 } = query;
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get job opening with required skills
  const jobOpening = await JobOpening.findByPk(jobOpeningId, {
    include: [
      {
        model: JobOpeningSkill,
        as: 'requiredSkills',
        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: ['skillName'],
          },
        ],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
    ],
  });

  if (!jobOpening) {
    return {
      data: [],
      meta: { total: 0, message: 'Job opening not found' },
    };
  }

  const requiredSkills = (jobOpening as any).requiredSkills || [];
  const requiredSkillNames = requiredSkills.map((rs: any) => rs.skill?.skillName);

  // Get all candidates for this job
  const candidates = await Candidate.findAll({
    where: {
      jobOpeningId,
    },
    include: [
      {
        model: CandidateSkill,
        as: 'skills',
        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: ['skillName'],
          },
        ],
      },
    ],
    limit,
    offset,
  });

  const candidateMatches: CandidateMatch[] = candidates
    .map((candidate) => {
      const candidateSkills = (candidate as any).skills || [];
      const candidateSkillNames = candidateSkills.map((cs: any) => cs.skill?.skillName);

      // Calculate matching score
      const matchingSkills = requiredSkillNames.filter((skill: string) => candidateSkillNames.includes(skill));
      const missingSkills = requiredSkillNames.filter((skill: string) => !candidateSkillNames.includes(skill));

      const matchScore = requiredSkillNames.length > 0 ? Math.round((matchingSkills.length / requiredSkillNames.length) * 100) : 0;

      return {
        candidateId: candidate.candidateId,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        phone: candidate.phoneNumber || '',
        matchScore,
        matchingSkills,
        missingSkills,
        experienceYears: 0, // Field not available in schema
        currentStage: candidate.currentStatus || 'Applied',
        appliedDate: candidate.createdAt,
      };
    })
    .filter((match) => match.matchScore >= minMatchScore)
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    data: candidateMatches,
    meta: {
      total: candidateMatches.length,
      message: `Found ${candidateMatches.length} matching candidates`,
      jobTitle: (jobOpening as any).designation?.designationName || 'N/A',
      requiredSkills: requiredSkillNames,
    },
  };
};

/**
 * Get hiring funnel statistics
 */
export const getHiringFunnel = async (req: Request, query: any) => {
  const { startDate, endDate, jobOpeningId, departmentId } = query;

  const dateFilter: any = {};
  if (startDate) {
    dateFilter[Op.gte] = new Date(startDate);
  }
  if (endDate) {
    dateFilter[Op.lte] = new Date(endDate);
  }

  const whereClause: any = {};
  if (Object.keys(dateFilter).length > 0) {
    whereClause.applicationDate = dateFilter;
  }
  if (jobOpeningId) {
    whereClause.jobOpeningId = jobOpeningId;
  }

  // Get all candidates matching filters
  const candidates = await Candidate.findAll({
    where: whereClause,
    include: jobOpeningId
      ? []
      : [
          {
            model: JobOpening,
            as: 'jobOpening',
            where: departmentId ? { departmentId } : {},
          },
        ],
  });

  // Count candidates by stage
  const stageCounts: Record<string, number> = {
    Applied: 0,
    Screening: 0,
    'Phone Screen': 0,
    Interview: 0,
    'Technical Test': 0,
    Offered: 0,
    Hired: 0,
    Rejected: 0,
  };

  candidates.forEach((candidate) => {
    const status = candidate.currentStatus || 'Applied';
    if (stageCounts[status] !== undefined) {
      stageCounts[status]++;
    } else {
      stageCounts['Applied']++;
    }
  });

  const totalCandidates = candidates.length;
  const funnel: HiringFunnel[] = Object.entries(stageCounts).map(([stage, count]) => ({
    stage,
    count,
    percentage: totalCandidates > 0 ? (count / totalCandidates) * 100 : 0,
    avgDaysInStage: 0, // Would require stage transition tracking
  }));

  return {
    data: funnel,
    meta: {
      total: totalCandidates,
      message: `Hiring funnel for ${totalCandidates} candidates`,
    },
  };
};

/**
 * Get recruitment pipeline summary
 */
export const getPipelineSummary = async (req: Request, query: any) => {
  const { departmentId, status = 'open' } = query;
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const whereClause: any = { status };
  if (departmentId) {
    whereClause.departmentId = departmentId;
  }

  const jobOpenings = await JobOpening.findAll({
    where: whereClause,
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
        model: Candidate,
        as: 'candidates',
        attributes: ['candidateId', 'status', 'applicationDate'],
        required: false,
      },
      {
        model: OfferLetter,
        as: 'offerLetters',
        attributes: ['offerLetterId', 'status'],
        required: false,
      },
    ],
    limit,
    offset,
  });

  const pipelineSummaries: PipelineSummary[] = jobOpenings.map((job) => {
    const candidates = (job as any).candidates || [];
    const offers = (job as any).offerLetters || [];

    const newApplications = candidates.filter((c: any) => {
      const appDate = new Date(c.applicationDate || c.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return appDate >= sevenDaysAgo;
    }).length;

    const shortlisted = candidates.filter((c: any) => c.currentStatus === 'Screening' || c.currentStatus === 'Phone Screen').length;

    const interviewing = candidates.filter((c: any) => c.currentStatus === 'Interview' || c.currentStatus === 'Technical Test').length;

    const offered = offers.filter((o: any) => o.status === 'sent').length;
    const hired = candidates.filter((c: any) => c.currentStatus === 'Hired').length;
    const rejected = candidates.filter((c: any) => c.currentStatus === 'Rejected').length;

    const postedDate = new Date(job.publishedAt || job.createdAt);
    const daysOpen = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      jobOpeningId: job.jobOpeningId,
      jobTitle: (job as any).designation?.designationName || 'N/A',
      department: (job as any).department?.departmentName || 'N/A',
      totalApplicants: candidates.length,
      newApplications,
      shortlisted,
      interviewing,
      offered,
      hired,
      rejected,
      daysOpen,
      recruiters: [], // Would need a JobOpening-Recruiter mapping table
    };
  });

  return {
    data: pipelineSummaries,
    meta: {
      total: pipelineSummaries.length,
      message: `Found ${pipelineSummaries.length} active job openings`,
    },
  };
};

/**
 * Get overdue interviews
 */
export const getOverdueInterviews = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get interviews that are overdue (scheduled in the past but no feedback)
  const interviews = await Interview.findAll({
    where: {
      interviewDate: {
        [Op.lt]: new Date(),
      },
      feedback: {
        [Op.or]: [null, ''],
      } as any,
    },
    include: [
      {
        model: Candidate,
        as: 'candidate',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: JobOpening,
        as: 'jobOpening',
        include: [
          {
            model: Designation,
            as: 'designation',
            attributes: ['designationName'],
          },
        ],
      },
      {
        model: Employee,
        as: 'interviewer',
        attributes: ['firstName', 'lastName'],
      },
    ],
    order: [['interviewDate', 'ASC']],
    limit,
    offset,
  });

  const overdueInterviews: OverdueInterview[] = interviews.map((interview) => {
    const scheduledDate = new Date(interview.interviewDate);
    const daysOverdue = Math.floor((Date.now() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      interviewId: interview.interviewId,
      candidateName: `${(interview as any).candidate?.firstName || ''} ${(interview as any).candidate?.lastName || ''}`,
      jobTitle: (interview as any).jobOpening?.designation?.designationName || 'N/A',
      interviewerName: `${(interview as any).interviewer?.firstName || ''} ${(interview as any).interviewer?.lastName || ''}`,
      scheduledDate,
      daysOverdue,
      feedbackStatus: 'not_submitted',
    };
  });

  return {
    data: overdueInterviews,
    meta: {
      total: overdueInterviews.length,
      message: `Found ${overdueInterviews.length} overdue interviews`,
    },
  };
};

/**
 * Get recruiter performance metrics
 */
export const getRecruiterPerformance = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get all HR/Recruiters (users with hr role)
  const recruiters = await Employee.findAll({
    include: [
      {
        model: JobOpening,
        as: 'managedJobOpenings', // This would need a proper relation
        required: false,
      },
    ],
    limit,
    offset,
  });

  // This is a simplified version - in production, you'd have proper recruiter assignments
  const recruiterPerformances: RecruiterPerformance[] = [];

  return {
    data: recruiterPerformances,
    meta: {
      total: 0,
      message: 'Recruiter performance tracking requires additional schema',
      note: 'Requires JobOpening-Recruiter mapping table',
    },
  };
};
