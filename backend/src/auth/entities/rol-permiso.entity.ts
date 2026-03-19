import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Permiso } from './permiso.entity';

@Entity('rol_permisos')
export class RolPermiso {
    @PrimaryColumn({ name: 'rol_id' })
    rolId: number;

    @PrimaryColumn({ name: 'permiso_id' })
    permisoId: number;

    @ManyToOne(() => Rol, (rol) => rol.permisos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @ManyToOne(() => Permiso, (permiso) => permiso.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permiso_id' })
    permiso: Permiso;
}
