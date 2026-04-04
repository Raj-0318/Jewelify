import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './about.html',
    styleUrl: './about.css'
})
export class About {
    stats = [
        { label: 'Happy Clients', value: '15k+' },
        { label: 'Bespoke Creations', value: '1.2k+' },
        { label: 'Excellence Years', value: '25+' },
        { label: 'Master Artisans', value: '45+' }
    ];

    values = [
        {
            icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
            title: 'Exquisite Craftsmanship',
            description: 'Every piece is a masterpiece, handcrafted by master artisans with decades of experience.'
        },
        {
            icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
            title: 'Timeless Elegance',
            description: 'Designs that transcend trends, capturing the essence of classic beauty and modern sophistication.'
        },
        {
            icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
            title: 'Ethical Brilliance',
            description: 'We are committed to sourcing diamonds and metals responsibly, ensuring every sparkle is conflict-free.'
        }
    ];
}
