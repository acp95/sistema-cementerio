# Módulo de Autenticación

Este módulo maneja la seguridad y control de acceso.

## Funcionalidades

- Login con JWT
- Registro de usuarios
- Control de roles (ADMIN, OPERADOR, CONSULTA)
- Guards para protección de rutas

## Entidades

### Usuario
- Credenciales de acceso
- Rol asignado
- Estado (activo/inactivo)

### Rol
- Define permisos del sistema


## Servicios

- `auth.service.ts` - Login, registro, validación JWT
- `usuarios.service.ts` - CRUD de usuarios
- `roles.service.ts` - CRUD de roles

## Guards

- `JwtAuthGuard` - Verifica token JWT
- `RolesGuard` - Verifica permisos de rol

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/login | Iniciar sesión |
| POST | /auth/register | Registrar usuario |
| GET | /auth/profile | Perfil del usuario actual |
| GET | /usuarios | Lista usuarios |
| GET | /roles | Lista roles |
