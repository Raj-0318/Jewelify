import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Important for *ngIf
import { filter } from 'rxjs/operators';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ToastsComponent } from './components/shared/toasts/toasts.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule, ToastsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  isAdminRoute = signal(false);
  protected readonly title = signal('client');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute.set(event.url.startsWith('/admin'));
    });
  }
}
