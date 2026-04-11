import { Component, inject, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.html',
    styleUrl: './contact.css'
})
export class Contact implements AfterViewInit {
    private http = inject(HttpClient);
    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const targets = this.el.nativeElement.querySelectorAll('.scroll-animate');
        if (targets) {
            targets.forEach((t: any) => observer.observe(t));
        }
    }

    formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    submitted = false;
    isSubmitting = false;
    errorMessage: string | null = null;

    onSubmit() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        this.errorMessage = null;

        this.http.post('http://localhost:5000/api/messages', this.formData).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.submitted = true;
                this.formData = { name: '', email: '', subject: '', message: '' };
                setTimeout(() => this.submitted = false, 5000);
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.message || 'We are currently unable to reach our concierge. Please try again shortly or contact us directy via email.';
            }
        });
    }
}
