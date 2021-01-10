export interface User {
	_id?: string;
	email: string;
	name: string;
	password?: string; // bcrypt hash
	points?: number;
	discountCodes?: any[];
}