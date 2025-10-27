export interface CreateEmployeeCompetencyInput {
	employeeId: string;
	competencyId: string;
	currentProficiency?: string;
	lastEvaluated?: Date;
}

export interface UpdateEmployeeCompetencyInput {
	employeeId: string;
	competencyId: string;
	currentProficiency?: string;
	lastEvaluated?: Date;
}

export interface QueryEmployeeCompetencyInput {
	page : number;
	pageSize: number;

}
