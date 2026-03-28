import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio, EstadoEspacio } from './entities/espacio.entity';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';
import { FilterEspaciosDto } from './dto/filter-espacios.dto';

@Injectable()
export class EspaciosService {
    constructor(
        @InjectRepository(Espacio)
        private espaciosRepository: Repository<Espacio>,
    ) { }

    async create(createEspacioDto: CreateEspacioDto): Promise<Espacio> {
        const espacio = this.espaciosRepository.create(createEspacioDto);
        return await this.espaciosRepository.save(espacio);
    }

    async findAll(filters?: FilterEspaciosDto): Promise<Espacio[]> {
        const query = this.espaciosRepository.createQueryBuilder('espacio')
            .leftJoinAndSelect('espacio.sector', 'sector');

        if (filters?.sectorId) {
            query.andWhere('espacio.sectorId = :sectorId', { sectorId: filters.sectorId });
        }

        if (filters?.estado) {
            query.andWhere('espacio.estado = :estado', { estado: filters.estado });
        }

        query.orderBy('espacio.id', 'DESC');

        return await query.getMany();
    }

    async findOne(id: number): Promise<Espacio> {
        const espacio = await this.espaciosRepository.findOne({
            where: { id },
            relations: ['sector', 'inhumaciones'],
        });

        if (!espacio) {
            throw new NotFoundException(`Espacio con ID ${id} no encontrado`);
        }

        return espacio;
    }

    async findLibres(): Promise<Espacio[]> {
        return await this.espaciosRepository.find({
            where: { estado: EstadoEspacio.LIBRE },
            relations: ['sector'],
        });
    }

    async getMapaBySector(sectorId: number) {
        const espacios = await this.espaciosRepository
            .createQueryBuilder('espacio')
            .leftJoinAndSelect('espacio.sector', 'sector')
            .leftJoinAndSelect('espacio.inhumaciones', 'inhumacion')
            .leftJoinAndSelect('inhumacion.difunto', 'difunto')
            .leftJoinAndSelect('inhumacion.titular', 'titular')
            .where('espacio.sectorId = :sectorId', { sectorId })
            .orderBy('espacio.fila', 'ASC')
            .addOrderBy('espacio.columna', 'ASC')
            .addOrderBy('espacio.numero', 'ASC')
            .getMany();

        // Transform to include occupancy information
        return espacios.map(espacio => {
            const inhumacionActiva = espacio.inhumaciones?.find(
                inh => inh.estado === 'ACTIVO'
            );

            return {
                id: espacio.id,
                codigo: espacio.codigo,
                fila: espacio.fila,
                columna: espacio.columna,
                numero: espacio.numero,
                tipoEspacio: espacio.tipoEspacio,
                estado: espacio.estado,
                sector: espacio.sector ? {
                    id: espacio.sector.id,
                    nombre: espacio.sector.nombre,
                } : null,
                ocupado: !!inhumacionActiva,
                ocupante: inhumacionActiva ? {
                    difunto: inhumacionActiva.difunto
                        ? `${inhumacionActiva.difunto.nombres || ''} ${inhumacionActiva.difunto.apellidos || ''}`.trim()
                        : 'Sin datos',
                    titular: inhumacionActiva.titular
                        ? `${inhumacionActiva.titular.nombres || ''} ${inhumacionActiva.titular.apellidos || ''}`.trim()
                        : 'Sin titular',
                    fechaInhumacion: inhumacionActiva.fechaInhumacion,
                } : null,
            };
        });
    }

    async update(id: number, updateEspacioDto: UpdateEspacioDto): Promise<Espacio> {
        const espacio = await this.findOne(id);
        Object.assign(espacio, updateEspacioDto);
        return await this.espaciosRepository.save(espacio);
    }

    async cambiarEstado(id: number, nuevoEstado: EstadoEspacio): Promise<Espacio> {
        const espacio = await this.findOne(id);
        espacio.estado = nuevoEstado;
        return await this.espaciosRepository.save(espacio);
    }

    async remove(id: number): Promise<void> {
        const espacio = await this.findOne(id);
        await this.espaciosRepository.remove(espacio);
    }

    /**
     * Marca un espacio como OCUPADO (usado al registrar una inhumación)
     */
    async marcarOcupado(id: number): Promise<Espacio> {
        const espacio = await this.findOne(id);
        espacio.estado = EstadoEspacio.OCUPADO;
        return await this.espaciosRepository.save(espacio);
    }

    /**
     * Marca un espacio como LIBRE (usado al eliminar una inhumación)
     */
    async marcarLibre(id: number): Promise<Espacio> {
        const espacio = await this.findOne(id);
        espacio.estado = EstadoEspacio.LIBRE;
        return await this.espaciosRepository.save(espacio);
    }

    /**
     * Sincronizar estados de espacios con inhumaciones activas
     */
    async syncEstados(): Promise<{ updated: number; espacios: string[] }> {
        // Buscar todos los espacios con inhumaciones activas
        const espaciosConInhumacion = await this.espaciosRepository
            .createQueryBuilder('espacio')
            .leftJoin('espacio.inhumaciones', 'inhumacion')
            .where('inhumacion.estado = :estado', { estado: 'ACTIVO' })
            .andWhere('espacio.estado != :ocupado', { ocupado: EstadoEspacio.OCUPADO })
            .getMany();

        const codigosActualizados: string[] = [];

        for (const espacio of espaciosConInhumacion) {
            espacio.estado = EstadoEspacio.OCUPADO;
            await this.espaciosRepository.save(espacio);
            codigosActualizados.push(espacio.codigo || `ID-${espacio.id}`);
        }

        return {
            updated: espaciosConInhumacion.length,
            espacios: codigosActualizados,
        };
    }
}
