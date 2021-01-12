export interface DiscountCode {
	_id?: string;
	code: string;
	discount: number; // percentage - 1 - 100%
	uses: number;
}