import { Component, inject } from '@angular/core';
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
export class Contact {
    private http = inject(HttpClient);
    formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    submitted = false;

    onSubmit() {
        this.http.post('http://localhost:5000/api/messages', this.formData).subscribe({
            next: () => {
                this.submitted = true;
                this.formData = { name: '', email: '', subject: '', message: '' };
                setTimeout(() => this.submitted = false, 3000);
            },
            error: (err) => alert('Failed to send message: ' + (err.error?.message || 'Server Error'))
        });
    }
}
