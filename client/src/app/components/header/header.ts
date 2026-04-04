import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  cartService = inject(CartService); // Inject CartService
  isMenuOpen = false;
  showDropdown = false;
  isCollectionOpen = false;

  categories = [
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets'
  ];

  get cartCount(): number {
    const cart = this.cartService.cart();
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((count, item) => count + (item.quantity || 0), 0);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.group')) {
      this.isCollectionOpen = false;
      this.showDropdown = false;
    }
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';
  }
}
