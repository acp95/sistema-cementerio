import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('permisos')
export class Permiso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    descripcion: string;

    @OneToMany('RolPermiso', 'permiso')
    roles: any[];
}
