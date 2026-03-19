import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Espacio } from './espacio.entity';

@Entity('sectores')
export class Sector {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    tipo: string;

    @Column({ name: 'tipo_espacio', type: 'varchar', length: 20, default: 'nicho' })
    tipoEspacio: string;

    @Column({ name: 'capacidad_total', type: 'int', default: 0 })
    capacidadTotal: number;

    @Column({ name: 'coordenadas_geo', type: 'text', nullable: true })
    coordenadasGeo: string;

    @OneToMany(() => Espacio, (espacio) => espacio.sector)
    espacios: Espacio[];
}
