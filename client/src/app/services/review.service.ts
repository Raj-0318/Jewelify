import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewModel {
  _id?: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/reviews';

  getReviewsByProduct(productId: string): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}?productId=${productId}`);
  }

  addReview(productId: string, rating: number, comment: string): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(this.apiUrl, { productId, rating, comment });
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
