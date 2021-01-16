import { ObjectId } from 'mongodb';

export interface Product {
	_id: string | ObjectId;
	name: string;
	price: number;
	category: string;
	description?: string;
	imageUrl?: string;
}