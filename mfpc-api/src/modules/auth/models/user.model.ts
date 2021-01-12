import { ObjectId } from 'mongodb';

export interface User {
	_id?: string | ObjectId;
	email: string;
	name: string;
	password?: string; // bcrypt hash
	points?: number;
	discountCodes?: {
		_id: string | ObjectId;
		code: string;
		discount: number;
		used: boolean;
	}[];
}