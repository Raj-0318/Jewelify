import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ProductService, ProductModel } from '../../services/product';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
  searchTerm: string = '';
  sortBy: string = 'featured';

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
            this.selectedCategory = this.categories.find(c => c.toLowerCase() === category.toLowerCase()) || category;
          } else {
            this.selectedCategory = 'All';
          }
          this.applyFilters();
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
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let tempProducts = [...this.products];

    // Category Filter
    if (this.selectedCategory.toLowerCase() !== 'all') {
      tempProducts = tempProducts.filter(p => 
        p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Search Filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    // Sorting
    this.sortProducts(tempProducts);

    this.filteredProducts = tempProducts;
    this.currentPage = 1; // Reset to first page
    this.cdr.detectChanges();
  }

  sortProducts(products: ProductModel[]) {
    switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default 'featured' or no specific sort
        break;
    }
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
