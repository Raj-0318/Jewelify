import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.email || !this.password) return;

    // Gmail Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = "Please enter a valid Gmail address (e.g., example@gmail.com)";
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        console.log('Login response:', res);
        this.notification.success('Welcome back! You have successfully logged in.');
        if (res.user && res.user.isAdmin) {
          console.log('Redirecting to admin...');
          this.router.navigate(['/admin']);
        } else {
          console.log('Redirecting to home...');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
        this.notification.error(this.errorMessage);
      }
    });
  }
}
