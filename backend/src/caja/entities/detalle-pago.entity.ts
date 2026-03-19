import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Pago } from './pago.entity';
import { ConceptoPago } from './concepto-pago.entity';

@Entity('detalle_pagos')
export class DetallePago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'pago_id' })
    pagoId: number;

    @Column({ name: 'concepto_id' })
    conceptoId: number;

    @Column({ type: 'int', default: 1 })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Pago, (pago) => pago.detalles)
    @JoinColumn({ name: 'pago_id' })
    pago: Pago;

    @ManyToOne(() => ConceptoPago, (concepto) => concepto.detalles)
    @JoinColumn({ name: 'concepto_id' })
    concepto: ConceptoPago;
}
