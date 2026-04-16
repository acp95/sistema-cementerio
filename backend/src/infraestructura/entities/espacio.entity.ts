import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Sector } from './sector.entity';
import { Inhumacion } from '../../registro/entities/inhumacion.entity';
import { Titular } from '../../registro/entities/titular.entity';

export enum EstadoEspacio {
    LIBRE = 'LIBRE',
    OCUPADO = 'OCUPADO',
    MANTENIMIENTO = 'MANTENIMIENTO',
    RESERVADO = 'RESERVADO',
}

@Entity('espacios')
export class Espacio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'sector_id' })
    sectorId: number;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    codigo: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    fila: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    columna: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    numero: string;

    @Column({
        name: 'tipo_espacio',
        type: 'varchar',
        length: 20,
        default: 'NICHO',
    })
    tipoEspacio: string;

    @Column({
        type: 'enum',
        enum: EstadoEspacio,
        default: EstadoEspacio.LIBRE,
    })
    estado: EstadoEspacio;

    @Column({
        name: 'coordenadas_lat',
        type: 'decimal',
        precision: 10,
        scale: 8,
        nullable: true,
    })
    coordenadasLat: number;

    @Column({ name: 'coordenadas_lng', type: 'decimal', precision: 11, scale: 8, nullable: true })
    coordenadasLng: number;

    @Column({ name: 'titular_id', nullable: true })
    titularId: number;

    @ManyToOne(() => Titular)
    @JoinColumn({ name: 'titular_id' })
    titular: Titular;

    @ManyToOne(() => Sector, (sector) => sector.espacios)
    @JoinColumn({ name: 'sector_id' })
    sector: Sector;

    @OneToMany(() => Inhumacion, (inhumacion) => inhumacion.espacio)
    inhumaciones: Inhumacion[];
}
