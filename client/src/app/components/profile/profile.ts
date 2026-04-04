import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class Profile implements OnInit {
    authService = inject(AuthService);
    private orderService = inject(OrderService);

    recentOrders: any[] = [];
    loadingOrders = true;

    // Edit logic
    isEditing = false;
    tempName = '';
    tempEmail = '';

    get user() {
        return this.authService.currentUser();
    }

    ngOnInit() {
        if (this.user) {
            this.tempName = this.user.name;
            this.tempEmail = this.user.email;
            this.orderService.getOrders(this.user.id).subscribe({
                next: (data) => {
                    this.recentOrders = data.slice(0, 3); // Show only top 3 recent orders
                    this.loadingOrders = false;
                },
                error: () => this.loadingOrders = false
            });
        }
    }

    toggleEdit() {
        if (this.user) {
            this.tempName = this.user.name;
            this.tempEmail = this.user.email;
        }
        this.isEditing = !this.isEditing;
    }

    saveProfile() {
        if (!this.tempName || !this.tempEmail) return;

        this.authService.updateProfile({ name: this.tempName, email: this.tempEmail }).subscribe({
            next: (updatedUser) => {
                this.isEditing = false;
            },
            error: (err) => {
                console.error('Update failed', err);
                alert('Failed to update profile. Please try again.');
            }
        });
    }

    formatOrderId(id: any): string {
        if (!id) return '';
        return String(id).slice(-6).toUpperCase();
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
