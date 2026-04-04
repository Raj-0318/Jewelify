import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './order-history.html',
    styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    orders: any[] = [];
    loading = true;

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user) {
            this.orderService.getOrders(user.id).subscribe({
                next: (data) => {
                    console.log('Orders data:', data);
                    this.orders = data;
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
            this.loading = false;
        }
    }
    formatOrderId(id: any): string {
        if (!id) return '';
        return String(id).slice(-6).toUpperCase();
    }

    selectedOrder: any = null;

    openModal(order: any) {
        this.selectedOrder = order;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.selectedOrder = null;
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}
