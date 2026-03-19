// Auth DTOs
export interface LoginDto {
    username?: string;
    email?: string;
    password: string;
}

export interface RegisterDto {
    nombre: string;
    email: string;
    password: string;
    rol?: 'admin' | 'usuario';
}

export interface AuthResponse {
    access_token: string;
    user: Usuario;
}

// User Model
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'usuario';
    activo: boolean;
    createdAt: Date;
}
