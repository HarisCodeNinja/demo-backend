export interface CreateSalaryStructureInput {
	employeeId: string;
	basicSalary: number;
	allowance?: object;
	deduction?: object;
	effectiveDate: Date;
	status: string;
}

export interface UpdateSalaryStructureInput {
	employeeId: string;
	basicSalary: number;
	allowance?: object;
	deduction?: object;
	effectiveDate: Date;
	status: string;
}

export interface QuerySalaryStructureInput {
	page : number;
	pageSize: number;

}
