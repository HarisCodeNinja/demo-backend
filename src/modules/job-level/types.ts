export interface CreateJobLevelInput {
	levelName: string;
	description?: string;
}

export interface UpdateJobLevelInput {
	levelName: string;
	description?: string;
}

export interface QueryJobLevelInput {
	page : number;
	pageSize: number;

}
