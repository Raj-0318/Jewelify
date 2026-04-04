import { Injectable, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private apiUrl = 'http://localhost:5000/api/wishlist';
    private wishlistSubject = new BehaviorSubject<any[]>([]);
    wishlist$ = this.wishlistSubject.asObservable();

    constructor(private http: HttpClient, private authService: AuthService) {
        effect(() => {
            const user = this.authService.currentUser();
            if (user && (user.id || user._id)) {
                this.loadWishlist();
            } else {
                this.wishlistSubject.next([]);
            }
        });
    }

    loadWishlist() {
        const user = this.authService.currentUser();
        const userId = user ? (user.id || user._id) : null;
        if (userId) {
            this.http.get<any>(`${this.apiUrl}/${userId}`).subscribe(
                data => {
                    this.wishlistSubject.next(data.products || []);
                },
                error => console.error('Error loading wishlist', error)
            );
        }
    }

    addToWishlist(productId: string): Observable<any> {
        const user = this.authService.currentUser();
        const userId = user ? (user.id || user._id) : null;
        return this.http.post(`${this.apiUrl}/add`, { userId, productId }).pipe(
            tap(() => this.loadWishlist())
        );
    }

    removeFromWishlist(productId: string): Observable<any> {
        // Optimistic update
        const currentList = this.wishlistSubject.value;
        const newList = currentList.filter((item: any) => item.productId._id !== productId);
        this.wishlistSubject.next(newList);

        const user = this.authService.currentUser();
        const userId = user ? (user.id || user._id) : null;
        return this.http.delete(`${this.apiUrl}/remove/${userId}/${productId}`).pipe(
            tap(() => this.loadWishlist())
        );
    }

    isInWishlist(productId: string): boolean {
        return this.wishlistSubject.value.some((item: any) => item.productId._id === productId || item.productId === productId);
    }
}
