import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductService, ProductModel } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ReviewService, ReviewModel } from '../../services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public authService = inject(AuthService); // Changed to public for template access
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);
  private reviewService = inject(ReviewService);

  product: ProductModel | undefined;
  quantity: number = 1;
  errorMessage: string = '';
  
  // Reviews
  reviews: ReviewModel[] = [];
  newReview = {
    rating: 5,
    comment: ''
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
        this.loadReviews(id);
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.errorMessage = 'Product not found. Please return to the collections.';
        this.cdr.detectChanges();
      }
    });
  }

  loadReviews(productId: string) {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.detectChanges();
      }
    });
  }

  submitReview() {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product && this.newReview.comment) {
      this.reviewService.addReview(this.product._id, this.newReview.rating, this.newReview.comment).subscribe({
        next: (review) => {
          this.notification.success('Your appreciation has been recorded.');
          this.reviews.unshift(review);
          this.newReview = { rating: 5, comment: '' };
          this.cdr.detectChanges();
        },
        error: () => this.notification.error('Failed to submit review.')
      });
    }
  }

  addToCart() {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.cartService.addToCart(this.authService.currentUser().id, this.product._id, this.quantity).subscribe({
        next: () => this.notification.success('Exquisite choice! Piece added to your bag.'),
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.notification.error('Failed to add piece to bag.');
        }
      });
    }
  }
}
