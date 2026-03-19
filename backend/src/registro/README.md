# Módulo de Registro

Este módulo maneja el registro de personas y eventos del cementerio.

## Entidades

### Difunto
- Datos personales del fallecido
- Relación 1:1 con Inhumación
- Validación: DNI único

### Titular
- Responsable legal de la inhumación
- Datos de contacto
- Puede tener múltiples inhumaciones a su cargo

### Inhumación
- Registro del acto de inhumación
- Une: Difunto + Espacio + Titular
- Validación: Un difunto solo puede ser inhumado una vez

## Servicios

- `difuntos.service.ts` - CRUD de difuntos + creación transaccional con inhumación
- `titulares.service.ts` - CRUD de titulares
- `inhumaciones.service.ts` - CRUD de inhumaciones + validaciones

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /difuntos | Lista todos los difuntos |
| POST | /difuntos | Crea difunto (+ inhumación opcional) |
| GET | /titulares | Lista todos los titulares |
| POST | /titulares | Crea nuevo titular |
| GET | /inhumaciones | Lista todas las inhumaciones |
| POST | /inhumaciones | Crea nueva inhumación |
