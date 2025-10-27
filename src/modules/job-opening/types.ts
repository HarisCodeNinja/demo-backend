export interface CreateJobOpeningInput {
	title: string;
	description: string;
	departmentId: string;
	designationId: string;
	locationId: string;
	requiredExperience: number;
	status: string;
	publishedAt?: Date;
	closedAt?: Date;
}

export interface UpdateJobOpeningInput {
	title: string;
	description: string;
	departmentId: string;
	designationId: string;
	locationId: string;
	requiredExperience: number;
	status: string;
	publishedAt?: Date;
	closedAt?: Date;
}

export interface QueryJobOpeningInput {
	page : number;
	pageSize: number;

}
