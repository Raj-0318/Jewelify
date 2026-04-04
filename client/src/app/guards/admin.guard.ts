import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user && user.isAdmin) {
        return true;
    }

    // Redirect to home or login if not admin
    router.navigate(['/']);
    return false;
};
