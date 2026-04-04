import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService, ProductModel } from '../../services/product';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);

  featuredProducts: ProductModel[] = [];
  loading = true;

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data.slice(0, 4); // Get top 4 products
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Subscribe to wishlist changes to trigger UI update
    this.wishlistService.wishlist$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(event: Event, productId: string) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => this.notification.info('Removed from your collection.')
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => this.notification.success('Added to your desired collection.')
      });
    }
  }
}
