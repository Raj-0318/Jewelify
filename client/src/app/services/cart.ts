import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProductModel } from './product';

export interface CartItem {
  productId: ProductModel;
  quantity: number;
  _id: string;
}

export interface CartModel {
  _id: string;
  userId: string;
  products: CartItem[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/cart';

  cart = signal<CartModel | null>(null);

  getCart(userId: string): Observable<CartModel> {
    return this.http.get<CartModel>(`${this.apiUrl}/${userId}`).pipe(
      tap(data => this.cart.set(data))
    );
  }

  addToCart(userId: string, productId: string, quantity: number = 1): Observable<CartModel> {
    return this.http.post<CartModel>(`${this.apiUrl}/add`, { userId, productId, quantity }).pipe(
      tap(data => this.cart.set(data))
    );
  }

  updateQuantity(userId: string, productId: string, quantity: number): Observable<CartModel> {
    return this.http.put<CartModel>(`${this.apiUrl}/update`, { userId, productId, quantity }).pipe(
      tap(data => this.cart.set(data))
    );
  }

  removeFromCart(userId: string, productId: string): Observable<CartModel> {
    return this.http.delete<CartModel>(`${this.apiUrl}/remove/${userId}/${productId}`).pipe(
      tap(data => this.cart.set(data))
    );
  }

  clearCart(userId: string): Observable<CartModel> {
    return this.http.delete<CartModel>(`${this.apiUrl}/clear/${userId}`).pipe(
      tap(data => this.cart.set(data))
    );
  }
}
