import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.html',
})
export class AdminDashboard implements OnInit {
    private http = inject(HttpClient);

    stats = signal<any>({
        totalSales: 0,
        activeOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: [],
        recentReviews: []
    });

    isLoading = signal(true);

    ngOnInit() {
        this.fetchStats();
    }

    fetchStats() {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        this.http.get('http://localhost:5000/api/dashboard/stats', { headers }).subscribe({
            next: (data) => {
                this.stats.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error fetching dashboard stats:', err);
                this.isLoading.set(false);
            }
        });
    }

    formatOrderId(id: string): string {
        return id ? id.toString().slice(-6).toUpperCase() : '';
    }
}
