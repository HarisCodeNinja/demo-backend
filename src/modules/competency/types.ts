export interface CreateCompetencyInput {
	competencyName: string;
	description?: string;
}

export interface UpdateCompetencyInput {
	competencyName: string;
	description?: string;
}

export interface QueryCompetencyInput {
	page : number;
	pageSize: number;

}
