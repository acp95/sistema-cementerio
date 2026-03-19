import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Obtener permisos requeridos de la ruta
    const requiredPermissions = route.data['permissions'] as string[] | undefined;

    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }

    // Verificar si el usuario está autenticado
    if (!authService.hasToken()) {
        router.navigate(['/login']);
        return false;
    }

    // Verificar si tiene alguno de los permisos requeridos
    const hasPermission = authService.hasAnyPermission(requiredPermissions);

    if (!hasPermission) {
        // Redirigir a dashboard con mensaje de acceso denegado
        console.warn('Acceso denegado. Permisos requeridos:', requiredPermissions);
        router.navigate(['/dashboard']);
        return false;
    }

    return true;
};
