export interface CreateLeaveApplicationInput {
	employeeId: string;
	leaveTypeId: string;
	startDate: Date;
	endDate: Date;
	numberOfDay: number;
	reason: string;
	status: string;
	approvedBy?: any;
}

export interface UpdateLeaveApplicationInput {
	employeeId: string;
	leaveTypeId: string;
	startDate: Date;
	endDate: Date;
	numberOfDay: number;
	reason: string;
	status: string;
	approvedBy?: any;
}

export interface QueryLeaveApplicationInput {
	page : number;
	pageSize: number;

}
