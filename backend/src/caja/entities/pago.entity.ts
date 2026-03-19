import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Titular } from '../../registro/entities/titular.entity';
import { Usuario } from '../../auth/entities/usuario.entity';
import { Inhumacion } from '../../registro/entities/inhumacion.entity';
import { DetallePago } from './detalle-pago.entity';

export enum MetodoPago {
    EFECTIVO = 'EFECTIVO',
    TARJETA = 'TARJETA',
    TRANSFERENCIA = 'TRANSFERENCIA',
    YAPE_PLIN = 'YAPE/PLIN',
}

@Entity('pagos')
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'codigo_recibo', type: 'varchar', length: 20, unique: true, nullable: true })
    codigoRecibo: string;

    @Column({ name: 'titular_id', nullable: true })
    titularId: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @Column({ name: 'inhumacion_id', nullable: true })
    inhumacionId: number;

    @Column({ name: 'monto_total', type: 'decimal', precision: 10, scale: 2 })
    montoTotal: number;

    @Column({
        name: 'metodo_pago',
        type: 'enum',
        enum: MetodoPago,
        default: MetodoPago.EFECTIVO,
    })
    metodoPago: MetodoPago;

    @CreateDateColumn({ name: 'fecha_pago' })
    fechaPago: Date;

    @Column({ type: 'varchar', length: 20, default: 'PAGADO' })
    estado: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => Titular, (titular) => titular.pagos)
    @JoinColumn({ name: 'titular_id' })
    titular: Titular;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @ManyToOne(() => Inhumacion, (inhumacion) => inhumacion.pagos)
    @JoinColumn({ name: 'inhumacion_id' })
    inhumacion: Inhumacion;

    @OneToMany(() => DetallePago, (detalle) => detalle.pago, { cascade: true })
    detalles: DetallePago[];
}
