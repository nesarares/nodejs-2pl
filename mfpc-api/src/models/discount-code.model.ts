import { ObjectId } from 'mongodb';

export interface DiscountCode {
	_id?: string | ObjectId;
	code: string;
	discount: number; // percentage - 1 - 100%
	uses: number;
}