import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Titular } from './titular.entity';

@Entity('difuntos')
export class Difunto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombres: string;

    @Column({ type: 'varchar', length: 100 })
    apellidos: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    dni: string;

    @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
    fechaNacimiento: Date;

    @Column({ name: 'fecha_defuncion', type: 'date' })
    fechaDefuncion: Date;

    @Column({ name: 'acta_defuncion', type: 'varchar', length: 50, nullable: true })
    actaDefuncion: string;

    @Column({ type: 'char', length: 1, nullable: true })
    sexo: string;

    @Column({ name: 'causa_muerte', type: 'varchar', length: 200, nullable: true })
    causaMuerte: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @OneToOne('Inhumacion', 'difunto')
    inhumacion: any;

    @ManyToOne(() => Titular, (titular) => titular.difuntos, { nullable: true })
    @JoinColumn({ name: 'titular_id' })
    titular: Titular;
}
