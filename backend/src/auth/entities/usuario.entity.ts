import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'rol_id' })
    rolId: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    username: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ name: 'nombre_completo', type: 'varchar', length: 150 })
    nombreCompleto: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email: string;

    @Column({ name: 'ultimo_login', type: 'timestamp', nullable: true })
    ultimoLogin: Date;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Rol, (rol) => rol.usuarios)
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;
}
