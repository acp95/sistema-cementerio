import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../auth/entities/usuario.entity';

@Entity('auditoria')
export class Auditoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id', nullable: true })
    usuarioId: number;

    @Column({ type: 'varchar', length: 50 })
    accion: string;

    @Column({ name: 'tabla_afectada', type: 'varchar', length: 50, nullable: true })
    tablaAfectada: string;

    @Column({ name: 'registro_id', nullable: true })
    registroId: number;

    @Column({ name: 'datos_anteriores', type: 'jsonb', nullable: true })
    datosAnteriores: any;

    @Column({ name: 'datos_nuevos', type: 'jsonb', nullable: true })
    datosNuevos: any;

    @Column({ name: 'ip_origen', type: 'varchar', length: 45, nullable: true })
    ipOrigen: string;

    @CreateDateColumn()
    fecha: Date;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
}
