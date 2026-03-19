import { Titular } from './registro.model';

// ConceptoPago Models
export interface ConceptoPago {
    id: number;
    codigo: string;
    descripcion: string;
    monto: number;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Pago Models
export interface Pago {
    id: number;
    titularId: number;
    titular?: Titular;
    conceptoPagoId: number;
    conceptoPago?: ConceptoPago;
    monto: number;
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    numeroRecibo: string;
    fechaPago: Date;
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePagoDto {
    titularId: number;
    conceptoPagoId: number;
    monto: number;
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    observaciones?: string;
}

export interface UpdatePagoDto extends Partial<CreatePagoDto> { }
