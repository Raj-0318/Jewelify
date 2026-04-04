import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-toasts',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-24 right-6 z-[100] flex flex-col gap-4 pointer-events-none max-w-sm w-full">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="pointer-events-auto bg-white/90 backdrop-blur-md border-[0.5px] shadow-2xl p-4 flex items-center justify-between animate-toast-in group"
             [class.border-green-100]="toast.type === 'success'"
             [class.border-red-100]="toast.type === 'error'"
             [class.border-gray-100]="toast.type === 'info'">
          
          <div class="flex items-center gap-4">
            <!-- Icon -->
            @if (toast.type === 'success') {
              <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            } @else if (toast.type === 'error') {
              <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            } @else {
              <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
            
            <div>
              <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-0.5">Notification</p>
              <p class="text-xs font-medium text-gray-900 leading-tight">{{ toast.message }}</p>
            </div>
          </div>

          <button (click)="notificationService.remove(toast.id)" class="text-gray-300 hover:text-gray-900 transition-colors p-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-0 group-hover:w-full transition-all duration-[4000ms] ease-linear"></div>
        </div>
      }
    </div>
  `,
    styles: [`
    @keyframes toast-in {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-toast-in {
      animation: toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastsComponent {
    notificationService = inject(NotificationService);
}
