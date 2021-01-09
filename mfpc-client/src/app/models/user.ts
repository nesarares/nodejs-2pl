import { DiscountCode } from './discount-code';

export interface User {
	_id?: string;
	name: string;
	email: string;
	discountCodes?: DiscountCode[];
	points: number;
}