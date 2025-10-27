export interface CreateLeaveTypeInput {
	typeName: string;
	maxDaysPerYear: number;
	isPaid: boolean;
}

export interface UpdateLeaveTypeInput {
	typeName: string;
	maxDaysPerYear: number;
	isPaid: boolean;
}

export interface QueryLeaveTypeInput {
	page : number;
	pageSize: number;

}
