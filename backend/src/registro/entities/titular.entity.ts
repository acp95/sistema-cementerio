import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Inhumacion } from './inhumacion.entity';
import { Pago } from '../../caja/entities/pago.entity';
import { Difunto } from './difunto.entity';

@Entity('titulares')
export class Titular {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 15, unique: true })
    dni: string;

    @Column({ type: 'varchar', length: 100 })
    nombres: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    direccion: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email: string;

    @OneToMany(() => Inhumacion, (inhumacion) => inhumacion.titular)
    inhumaciones: Inhumacion[];

    @OneToMany(() => Pago, (pago) => pago.titular)
    pagos: Pago[];

    @OneToMany(() => Difunto, (difunto) => difunto.titular)
    difuntos: Difunto[];
}
