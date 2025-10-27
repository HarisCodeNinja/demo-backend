// from auth interface creator 
export interface AuthUserRegisterInput {
	email: string;
	username: string;
	password: string;

}

export interface AuthUserProfileUpdateInput {
	email: string;
	username: string;
	password: string;
	role: string;

}

export interface AuthUserSessionRecordsInput {
	userId: string;
	email: string;
	username: string;
	password: string;
	role: string;
	createdAt: Date;
	updatedAt: Date;

}

