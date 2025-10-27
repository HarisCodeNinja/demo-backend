export interface CreateAttendanceInput {
	employeeId: string;
	attendanceDate: Date;
	checkInTime: Date;
	checkOutTime?: Date;
	status: string;
}

export interface UpdateAttendanceInput {
	employeeId: string;
	attendanceDate: Date;
	checkInTime: Date;
	checkOutTime?: Date;
	status: string;
}

export interface QueryAttendanceInput {
	page : number;
	pageSize: number;

}
