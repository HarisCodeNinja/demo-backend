export interface CreateRoleCompetencyInput {
	designationId: string;
	competencyId: string;
	requiredProficiency?: string;
}

export interface UpdateRoleCompetencyInput {
	designationId: string;
	competencyId: string;
	requiredProficiency?: string;
}

export interface QueryRoleCompetencyInput {
	page : number;
	pageSize: number;

}
