import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-admin-order-list',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule],
    templateUrl: './order-list.html',
})
export class AdminOrderList implements OnInit {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    orders = signal<any[]>([]);

    // Dropdown State
    openDropdownId = signal<string | null>(null);

    ngOnInit() {
        this.fetchOrders();
        // Close dropdown when clicking outside (simple implementation)
        document.addEventListener('click', (e: any) => {
            if (!e.target.closest('.dropdown-container')) {
                this.openDropdownId.set(null);
            }
        });
    }

    toggleDropdown(id: string, event: Event) {
        event.stopPropagation();
        if (this.openDropdownId() === id) {
            this.openDropdownId.set(null);
        } else {
            this.openDropdownId.set(id);
        }
    }

    fetchOrders() {
        const token = localStorage.getItem('token');
        this.http.get<any[]>('http://localhost:5000/api/orders', {
            headers: { 'x-auth-token': token || '' }
        }).subscribe({
            next: (data) => this.orders.set(data),
            error: (err) => console.error('Error fetching orders', err)
        });
    }

    updateStatus(id: string, status: string) {
        const token = localStorage.getItem('token');
        this.openDropdownId.set(null); // Close dropdown logic

        this.http.put(`http://localhost:5000/api/orders/${id}/status`, { status }, {
            headers: { 'x-auth-token': token || '' }
        }).subscribe({
            next: () => {
                // Optimistic update
                this.orders.update(list => list.map(o => o._id === id ? { ...o, status } : o));
                this.notification.success('Order status updated successfully.');
            },
            error: (err: any) => {
                console.error('Update status failed:', err);
                this.notification.error('Failed to update order status.');
            }
        });
    }

    viewOrder(order: any) {
        this.selectedOrder.set(order);
    }

    closeModal() {
        this.selectedOrder.set(null);
    }

    printInvoice() {
        window.print();
    }

    formatOrderId(id: any): string {
        if (!id) return '';
        return String(id).slice(-6).toUpperCase();
    }

    // Modal State
    selectedOrder = signal<any | null>(null);
}
