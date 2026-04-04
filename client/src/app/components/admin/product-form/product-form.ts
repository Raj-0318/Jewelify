import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-admin-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './product-form.html',
})
export class AdminProductForm implements OnInit {
    private http = inject(HttpClient);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);
    private notification = inject(NotificationService);

    isEditMode = false;
    productId: string | null = null;

    product: any = {
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        stock: true
    };

    ngOnInit() {
        this.productId = this.route.snapshot.paramMap.get('id');
        if (this.productId) {
            this.isEditMode = true;
            this.fetchProduct(this.productId);
        }
    }

    fetchProduct(id: string) {
        this.http.get(`http://localhost:5000/api/products/${id}`).subscribe({
            next: (data) => {
                this.product = data;
                this.cdr.detectChanges(); // Force view update
            },
            error: (err) => {
                console.error('Error fetching product:', err);
                alert('Failed to fetch product');
            }
        });
    }

    onSubmit() {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };
        console.log('Submitting product:', this.product);

        if (this.isEditMode) {
            console.log('Updating product with ID:', this.productId);
            this.http.put(`http://localhost:5000/api/products/${this.productId}`, this.product, { headers }).subscribe({
                next: (res) => {
                    console.log('Update successful:', res);
                    this.notification.success('Catalog updated successfully.');
                    this.router.navigate(['/admin/products']);
                },
                error: (err: any) => {
                    console.error('Update failed:', err);
                    this.notification.error('Failed to update catalog: ' + (err.error?.message || err.statusText));
                }
            });
        } else {
            console.log('Creating new product');
            this.http.post('http://localhost:5000/api/products', this.product, { headers }).subscribe({
                next: (res) => {
                    console.log('Creation successful:', res);
                    this.notification.success('New piece added to catalog.');
                    this.router.navigate(['/admin/products']);
                },
                error: (err: any) => {
                    console.error('Creation failed:', err);
                    this.notification.error('Failed to create piece: ' + (err.error?.message || err.statusText));
                }
            });
        }
    }
}
