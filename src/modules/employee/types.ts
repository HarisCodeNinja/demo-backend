export interface CreateEmployeeInput {
	userId: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	gender?: string;
	phoneNumber?: string;
	address?: string;
	personalEmail?: string;
	employmentStartDate: Date;
	employmentEndDate?: Date;
	departmentId: string;
	designationId: string;
	reportingManagerId?: string;
	status: string;
}

export interface UpdateEmployeeInput {
	userId: string;
	firstName: string;
	lastName: string;
	dateOfBirth?: Date;
	gender?: string;
	phoneNumber?: string;
	address?: string;
	personalEmail?: string;
	employmentStartDate: Date;
	employmentEndDate?: Date;
	departmentId: string;
	designationId: string;
	reportingManagerId?: string;
	status: string;
}

export interface QueryEmployeeInput {
	page : number;
	pageSize: number;

}
