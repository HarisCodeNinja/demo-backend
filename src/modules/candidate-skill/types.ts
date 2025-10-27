export interface CreateCandidateSkillInput {
	candidateId: string;
	skillId: string;
	proficiency?: string;
}

export interface UpdateCandidateSkillInput {
	candidateId: string;
	skillId: string;
	proficiency?: string;
}

export interface QueryCandidateSkillInput {
	page : number;
	pageSize: number;

}
