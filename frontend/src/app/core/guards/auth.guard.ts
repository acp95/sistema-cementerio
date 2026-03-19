import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasToken()) {
        return true;
    }

    // Guardar la URL intentada para redirigir después del login
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
