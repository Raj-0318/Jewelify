import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private http = inject(HttpClient);
  private notification = inject(NotificationService);
  
  newsletterEmail: string = '';

  subscribeNewsletter(event: Event) {
    event.preventDefault();
    if (!this.newsletterEmail) return;

    const data = {
      name: 'Newsletter Subscriber',
      email: this.newsletterEmail,
      subject: 'Newsletter Subscription',
      message: 'New newsletter subscription request from footer.'
    };

    this.http.post('http://localhost:5000/api/messages', data).subscribe({
      next: () => {
        this.notification.success('Welcome to the inner circle!');
        this.newsletterEmail = '';
      },
      error: (err) => {
        console.error('Newsletter error:', err);
        this.notification.error('Subscription failed. Please try again.');
      }
    });
  }
}
