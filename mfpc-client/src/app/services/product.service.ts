import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  async getProducts(): Promise<Product[]> {
    return this.http.get<Product[]>('products').toPromise();
  }

  async getProductsById(ids: string[]) {
    return this.http
      .get<Product[]>('products', { params: { ids: ids.join(',') } })
      .toPromise();
  }
}
