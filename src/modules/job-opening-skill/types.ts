export interface CreateJobOpeningSkillInput {
	jobOpeningId: string;
	skillId: string;
	requiredLevel?: string;
}

export interface UpdateJobOpeningSkillInput {
	jobOpeningId: string;
	skillId: string;
	requiredLevel?: string;
}

export interface QueryJobOpeningSkillInput {
	page : number;
	pageSize: number;

}
