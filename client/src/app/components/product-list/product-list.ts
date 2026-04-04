import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ProductService, ProductModel } from '../../services/product';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  categories: string[] = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets'];
  selectedCategory: string = 'All';

  // Pagination
  currentPage = 1;
  pageSize = 9;

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get paginatedProducts(): ProductModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;

        // Listen to query params to handle navigation from header
        this.route.queryParams.subscribe(params => {
          const category = params['category'];
          if (category) {
            this.filterCategory(category);
          } else {
            this.filterCategory('All');
          }
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching products:', err)
    });

    // Subscribe to wishlist changes to trigger UI update
    this.wishlistService.wishlist$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  filterCategory(category: string) {
    if (category.toLowerCase() === 'all') {
      this.selectedCategory = 'All';
      this.filteredProducts = this.products;
    } else {
      // Find the display name from the categories array
      const matchingCategory = this.categories.find(c => c.toLowerCase() === category.toLowerCase());
      this.selectedCategory = matchingCategory || category;

      this.filteredProducts = this.products.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    this.currentPage = 1; // Reset to first page on filter change
    this.cdr.detectChanges();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
