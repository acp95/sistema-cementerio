import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DetallePago } from './detalle-pago.entity';

@Entity('conceptos_pago')
export class ConceptoPago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ name: 'precio_base', type: 'decimal', precision: 10, scale: 2 })
    precioBase: number;

    @Column({ name: 'es_periodico', type: 'boolean', default: false })
    esPeriodico: boolean;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @OneToMany(() => DetallePago, (detalle) => detalle.concepto)
    detalles: DetallePago[];
}
