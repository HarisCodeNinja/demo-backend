export interface CreatePerformanceReviewInput {
	employeeId: string;
	reviewerId: string;
	reviewPeriod: string;
	reviewDate: Date;
	selfAssessment?: string;
	managerFeedback?: string;
	overallRating?: number;
	recommendation?: string;
	status: string;
}

export interface UpdatePerformanceReviewInput {
	employeeId: string;
	reviewerId: string;
	reviewPeriod: string;
	reviewDate: Date;
	selfAssessment?: string;
	managerFeedback?: string;
	overallRating?: number;
	recommendation?: string;
	status: string;
}

export interface QueryPerformanceReviewInput {
	page : number;
	pageSize: number;

}
