export interface CreateDocumentInput {
	employeeId: string;
	documentType: string;
	fileName: string;
	fileUrl: string;
}

export interface UpdateDocumentInput {
	employeeId: string;
	documentType: string;
	fileName: string;
	fileUrl: string;
}

export interface QueryDocumentInput {
	page : number;
	pageSize: number;

}
