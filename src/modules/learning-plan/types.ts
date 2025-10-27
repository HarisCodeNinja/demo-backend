export interface CreateLearningPlanInput {
	employeeId: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export interface UpdateLearningPlanInput {
	employeeId: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export interface QueryLearningPlanInput {
	page : number;
	pageSize: number;

}
