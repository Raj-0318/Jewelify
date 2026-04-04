import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { inject, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-wishlist',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './wishlist.component.html',
})
export class Wishlist implements OnInit {
    private wishlistService = inject(WishlistService);
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private notification = inject(NotificationService);

    wishlistProducts: any[] = [];
    loading = true;

    ngOnInit() {
        this.wishlistService.wishlist$.subscribe(products => {
            this.wishlistProducts = products;
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    removeFromWishlist(productId: string) {
        this.wishlistService.removeFromWishlist(productId).subscribe({
            next: () => this.notification.info('Piece removed from your wishlist.')
        });
    }

    addToCart(product: any) {
        const user = this.authService.currentUser();
        const userId = user ? (user.id || user._id) : null;
        if (userId) {
            this.cartService.addToCart(userId, product._id, 1).subscribe({
                next: () => this.notification.success('Exquisite choice! Piece added to your bag.')
            });
        }
    }
}
