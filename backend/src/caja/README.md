# Módulo de Caja

Este módulo maneja la gestión financiera del cementerio.

## Entidades

### ConceptoPago
- Define tipos de cobro (renovación, mantenimiento, etc.)
- Precio base configurable

### Pago
- Registro de pagos realizados
- Vinculado a inhumación y concepto
- Estados: PENDIENTE, PAGADO, ANULADO

## Servicios

- `conceptos-pago.service.ts` - CRUD de conceptos de pago
- `pagos.service.ts` - CRUD de pagos + reportes

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /conceptos-pago | Lista conceptos |
| POST | /conceptos-pago | Crea concepto |
| GET | /pagos | Lista pagos |
| POST | /pagos | Registra pago |
| GET | /pagos/reporte | Reporte de pagos |
