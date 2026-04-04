import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartModel } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);

  cart: CartModel | null = null;
  loading = false;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.loading = true;
      this.cartService.getCart(user.id).subscribe({
        next: (data) => {
          console.log('Cart Data Received:', data);
          this.cart = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Redirect to login if not logged in? Or show empty state asking to login
    }
  }

  removeFromCart(productId: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    this.cartService.removeFromCart(user.id, productId).subscribe({
      next: (data) => {
        this.cart = data;
        this.notification.info('Piece removed from your bag.');
        this.cdr.detectChanges();
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    const user = this.authService.currentUser();
    if (!user) return;

    if (quantity < 1) return;

    // Optimistic Update
    if (this.cart) {
      const item = this.cart.products.find(p => p.productId._id === productId);
      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = quantity; // Update UI immediately
        this.cdr.detectChanges(); // Force UI refresh

        this.cartService.updateQuantity(user.id, productId, quantity).subscribe({
          next: (data) => {
            this.cart = data; // Sync with server
            this.notification.success('Bag updated successfully.');
            this.cdr.detectChanges();
          },
          error: (err) => {
            // Revert on error
            item.quantity = oldQuantity;
            this.notification.error('Failed to update bag.');
            console.error('Failed to update quantity', err);
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  get totalAmount() {
    if (!this.cart) return 0;
    return this.cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
