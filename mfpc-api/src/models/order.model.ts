import { ObjectId } from 'mongodb';

export interface Order {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  products: {
    _id: string | ObjectId;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    amount: number;
  }[];
  subtotal: number;
  discount?: number;
  total: number;
  discountCode?: string;
  created: Date;
}
