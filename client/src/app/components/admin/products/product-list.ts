import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-admin-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './product-list.html',
})
export class AdminProductList implements OnInit {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    protected Math = Math; // Expose Math to template

    // Data Signals
    products = signal<any[]>([]);

    // Pagination & Filter Signals
    searchQuery = signal('');
    currentPage = signal(1);
    pageSize = signal(8);

    // Computed: Filtered & Paginated Products
    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.products().filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    });

    paginatedProducts = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredProducts().slice(start, end);
    });

    totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize()));

    ngOnInit() {
        this.fetchProducts();
    }

    fetchProducts() {
        this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
            next: (data) => {
                this.products.set(data);
                this.currentPage.set(1); // Reset to first page on fetch
            },
            error: (err) => console.error('Error fetching products', err)
        });
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this product?')) {
            const token = localStorage.getItem('token');
            this.http.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { 'x-auth-token': token || '' }
            }).subscribe({
                next: () => {
                    this.products.update(list => list.filter(p => p._id !== id));
                    this.notification.info('Piece removed from catalog.');
                },
                error: (err: any) => {
                    console.error('Delete failed:', err);
                    this.notification.error('Failed to delete piece: ' + (err.error?.message || 'Server error'));
                }
            });
        }
    }

    // Pagination Helpers
    nextPage() {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(p => p + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
        }
    }
}
