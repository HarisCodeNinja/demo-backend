export interface CreateCandidateInput {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	resumeText?: string;
	source?: string;
	currentStatus: string;
	jobOpeningId?: string;
	referredByEmployeeId?: string;
}

export interface UpdateCandidateInput {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	resumeText?: string;
	source?: string;
	currentStatus: string;
	jobOpeningId?: string;
	referredByEmployeeId?: string;
}

export interface QueryCandidateInput {
	page : number;
	pageSize: number;

}
