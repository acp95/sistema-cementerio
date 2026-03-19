import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty({
        description: 'Token JWT de acceso',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({
        description: 'Información del usuario autenticado',
        example: {
            id: 1,
            username: 'admin',
            nombreCompleto: 'Administrador del Sistema',
            email: 'admin@example.com',
            rol: {
                id: 1,
                nombre: 'Administrador',
            },
        },
    })
    user: {
        id: number;
        username: string;
        nombreCompleto: string;
        email: string;
        rol: {
            id: number;
            nombre: string;
        };
        permisos?: string[];
    };
}
