import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    toasts = signal<ToastMessage[]>([]);
    private nextId = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'success') {
        const id = this.nextId++;
        const toast: ToastMessage = { id, message, type };
        this.toasts.update(current => [...current, toast]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            this.remove(id);
        }, 4000);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    info(message: string) {
        this.show(message, 'info');
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
