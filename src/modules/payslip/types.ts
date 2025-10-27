export interface CreatePayslipInput {
	employeeId: string;
	payPeriodStart: Date;
	payPeriodEnd: Date;
	grossSalary: number;
	netSalary: number;
	deductionsAmount: number;
	allowancesAmount: number;
	pdfUrl: string;
}

export interface UpdatePayslipInput {
	employeeId: string;
	payPeriodStart: Date;
	payPeriodEnd: Date;
	grossSalary: number;
	netSalary: number;
	deductionsAmount: number;
	allowancesAmount: number;
	pdfUrl: string;
}

export interface QueryPayslipInput {
	page : number;
	pageSize: number;

}
