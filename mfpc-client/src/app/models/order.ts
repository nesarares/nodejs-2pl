import { Product } from './product';

export interface Order {
  _id?: string;
  products: {
    _id: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    amount: number;
  }[];
  subtotal: number;
  discountCode: string;
}
