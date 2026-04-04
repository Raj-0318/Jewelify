import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-admin-review-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './review-list.html',
})
export class AdminReviewList implements OnInit {
    private http = inject(HttpClient);
    messages = signal<any[]>([]);

    ngOnInit() {
        this.fetchMessages();
    }

    fetchMessages() {
        const token = localStorage.getItem('token');
        this.http.get<any[]>('http://localhost:5000/api/messages', {
            headers: { 'x-auth-token': token || '' }
        }).subscribe({
            next: (data) => this.messages.set(data),
            error: (err) => console.error('Error fetching messages', err)
        });
    }
}
