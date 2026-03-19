import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Difunto } from './difunto.entity';
import { Espacio } from '../../infraestructura/entities/espacio.entity';
import { Titular } from './titular.entity';

@Entity('inhumaciones')
export class Inhumacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'difunto_id', unique: true })
    difuntoId: number;

    @Column({ name: 'espacio_id' })
    espacioId: number;

    @Column({ name: 'titular_id', nullable: true })
    titularId: number;

    @Column({ name: 'fecha_inhumacion', type: 'date', default: () => 'CURRENT_DATE' })
    fechaInhumacion: Date;

    @Column({
        name: 'tipo_concesion',
        type: 'varchar',
        length: 20,
        default: 'TEMPORAL',
    })
    tipoConcesion: string;

    @Column({ name: 'fecha_vencimiento', type: 'date', nullable: true })
    fechaVencimiento: Date;

    @Column({ type: 'varchar', length: 20, default: 'ACTIVO' })
    estado: string;

    @Column({ name: 'hora_inhumacion', type: 'time', nullable: true })
    horaInhumacion: string;

    @Column({ name: 'numero_acta', type: 'varchar', length: 50, nullable: true })
    numeroActa: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @OneToOne(() => Difunto, (difunto) => difunto.inhumacion)
    @JoinColumn({ name: 'difunto_id' })
    difunto: Difunto;

    @ManyToOne(() => Espacio, (espacio) => espacio.inhumaciones)
    @JoinColumn({ name: 'espacio_id' })
    espacio: Espacio;

    @ManyToOne(() => Titular, (titular) => titular.inhumaciones)
    @JoinColumn({ name: 'titular_id' })
    titular: Titular;

    @OneToMany('Pago', 'inhumacion')
    pagos: any[];
}
