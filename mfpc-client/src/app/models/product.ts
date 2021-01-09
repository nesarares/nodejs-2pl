export interface Product {
	_id: string;
	name: string;
	price: number;
	category: string;
	description?: string;
	imageUrl?: string;
}