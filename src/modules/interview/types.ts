export interface CreateInterviewInput {
	candidateId: string;
	jobOpeningId: string;
	interviewerId: string;
	interviewDate: Date;
	feedback?: string;
	rating?: number;
	status: string;
}

export interface UpdateInterviewInput {
	candidateId: string;
	jobOpeningId: string;
	interviewerId: string;
	interviewDate: Date;
	feedback?: string;
	rating?: number;
	status: string;
}

export interface QueryInterviewInput {
	page : number;
	pageSize: number;

}
