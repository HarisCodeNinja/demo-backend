export interface CreateOfferLetterInput {
	candidateId: string;
	jobOpeningId: string;
	salaryOffered: number;
	joiningDate: Date;
	termsAndCondition?: string;
	status: string;
	approvedBy?: any;
}

export interface UpdateOfferLetterInput {
	candidateId: string;
	jobOpeningId: string;
	salaryOffered: number;
	joiningDate: Date;
	termsAndCondition?: string;
	status: string;
	approvedBy?: any;
}

export interface QueryOfferLetterInput {
	page : number;
	pageSize: number;

}
