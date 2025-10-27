export interface CreateGoalInput {
	employeeId: string;
	title: string;
	description?: string;
	kpi?: object;
	period: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export interface UpdateGoalInput {
	employeeId: string;
	title: string;
	description?: string;
	kpi?: object;
	period: string;
	startDate: Date;
	endDate: Date;
	status: string;
}

export interface QueryGoalInput {
	page : number;
	pageSize: number;

}
