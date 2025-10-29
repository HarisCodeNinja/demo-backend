export interface CreateUserInput {
	email: string;
	username: string;
	password: string;
	role: string;
}

export interface UpdateUserInput {
	email: string;
	username: string;
	password?: string;
	role: string;
}

export interface QueryUserInput {
	page : number;
	pageSize: number;

}
