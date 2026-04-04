import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/auth';

  // Signal to track user state
  currentUser = signal<any>(this.getUserFromStorage());

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  updateProfile(userData: any): Observable<any> {
    const userId = this.currentUser()?.id;
    return this.http.put(`http://localhost:5000/api/users/profile`, userData).pipe(
      tap((updatedUser: any) => {
        // Merge the new data with existing session data to keep the token
        const currentSession = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = { ...currentSession, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        this.currentUser.set(newUser);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
