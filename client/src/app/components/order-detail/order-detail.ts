import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './order-detail.html',
})
export class OrderDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private orderService = inject(OrderService);

    order: any | null = null;
    loading = true;
    error = '';

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        // Check for pre-loaded data from navigation state
        const navigation = history.state;
        if (navigation && navigation.order) {
            console.log('Using pre-loaded order data');
            this.order = navigation.order;
            this.loading = false;
        }

        if (id) {
            // Fetch fresh data in background (or foreground if no state)
            this.orderService.getOrder(id).subscribe({
                next: (data) => {
                    this.order = data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading order', err);
                    if (!this.order) { // Only show error if we don't have pre-loaded data
                        this.error = 'Order not found';
                    }
                    this.loading = false;
                }
            });
        } else {
            this.error = 'Invalid Order ID';
            this.loading = false;
        }
    }

    formatOrderId(id: any): string {
        if (!id) return '';
        return String(id).slice(-6).toUpperCase();
    }
}
