import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-admin-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.html',
})
export class AdminUserList implements OnInit {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    users = signal<any[]>([]);

    ngOnInit() {
        this.fetchUsers();
    }

    fetchUsers() {
        const token = localStorage.getItem('token');
        this.http.get<any[]>('http://localhost:5000/api/users', {
            headers: { 'x-auth-token': token || '' }
        }).subscribe({
            next: (data) => this.users.set(data),
            error: (err) => console.error('Error fetching users', err)
        });
    }

    deleteUser(id: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            const token = localStorage.getItem('token');
            this.http.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { 'x-auth-token': token || '' }
            }).subscribe({
                next: () => {
                    this.users.update(list => list.filter(u => u._id !== id));
                    this.notification.info('User account removed.');
                },
                error: (err: any) => {
                    console.error('Delete failed:', err);
                    this.notification.error('Failed to delete user.');
                }
            });
        }
    }
}
