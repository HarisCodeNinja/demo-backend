export interface CreateAuditLogInput {
	userId: string;
	action: string;
	tableName: string;
	recordId: string;
	oldValue?: object;
	newValue?: object;
}

export interface UpdateAuditLogInput {
	userId: string;
	action: string;
	tableName: string;
	recordId: string;
	oldValue?: object;
	newValue?: object;
}

export interface QueryAuditLogInput {
	page : number;
	pageSize: number;

}
