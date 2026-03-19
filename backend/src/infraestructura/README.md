# Módulo de Infraestructura

Este módulo maneja la infraestructura física del cementerio.

## Entidades

### Sector
- División física del cementerio
- Puede contener múltiples espacios
- Tipos: nicho, fosa

### Espacio
- Ubicación específica (nicho/fosa)
- Estados: LIBRE, OCUPADO, MANTENIMIENTO, RESERVADO
- Coordenadas: fila, columna, número

## Servicios

- `sectores.service.ts` - CRUD de sectores
- `espacios.service.ts` - CRUD de espacios + mapa visual + sincronización de estados

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /sectores | Lista todos los sectores |
| POST | /sectores | Crea nuevo sector |
| GET | /espacios | Lista espacios (con filtros) |
| GET | /espacios/libres | Solo espacios disponibles |
| GET | /espacios/mapa-sector/:id | Mapa visual de un sector |
| POST | /espacios/sync-estados | Sincroniza estados con inhumaciones |
