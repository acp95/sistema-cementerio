import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Si no hay permisos requeridos, permitir acceso
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Si no hay usuario autenticado, denegar
        if (!user) {
            throw new ForbiddenException('Usuario no autenticado');
        }

        // Obtener permisos del JWT payload
        const userPermissions: string[] = user.permisos || [];

        // Verificar si tiene alguno de los permisos requeridos
        const hasPermission = requiredPermissions.some(permission =>
            userPermissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                `Acceso denegado. Se requiere uno de los permisos: ${requiredPermissions.join(', ')}`,
            );
        }

        return true;
    }
}
