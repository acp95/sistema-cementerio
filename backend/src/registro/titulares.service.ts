import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Titular } from './entities/titular.entity';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';

@Injectable()
export class TitularesService {
    constructor(
        @InjectRepository(Titular)
        private titularesRepository: Repository<Titular>,
    ) { }

    async create(createTitularDto: CreateTitularDto): Promise<Titular> {
        // Verificar que no exista un titular con el mismo DNI (solo si se proporciona DNI)
        if (createTitularDto.dni) {
            const existente = await this.titularesRepository.findOne({
                where: { dni: createTitularDto.dni },
            });

            if (existente) {
                throw new ConflictException(
                    `Ya existe un titular con DNI ${createTitularDto.dni}`,
                );
            }
        }

        const titular = this.titularesRepository.create(createTitularDto);
        return await this.titularesRepository.save(titular);
    }

    async findAll(): Promise<Titular[]> {
        return await this.titularesRepository.find({
            relations: ['inhumaciones'],
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Titular> {
        const titular = await this.titularesRepository.findOne({
            where: { id },
            relations: ['inhumaciones', 'pagos'],
        });

        if (!titular) {
            throw new NotFoundException(`Titular con ID ${id} no encontrado`);
        }

        return titular;
    }

    async findByDni(dni: string): Promise<Titular> {
        const titular = await this.titularesRepository.findOne({
            where: { dni },
            relations: ['inhumaciones'],
        });

        if (!titular) {
            throw new NotFoundException(`Titular con DNI ${dni} no encontrado`);
        }

        return titular;
    }

    async update(id: number, updateTitularDto: UpdateTitularDto): Promise<Titular> {
        const titular = await this.findOne(id);

        // Si se está actualizando el DNI, verificar que no exista otro titular con ese DNI
        if (updateTitularDto.dni && updateTitularDto.dni !== titular.dni) {
            const existente = await this.titularesRepository.findOne({
                where: { dni: updateTitularDto.dni },
            });

            if (existente) {
                throw new ConflictException(
                    `Ya existe otro titular con DNI ${updateTitularDto.dni}`,
                );
            }
        }

        Object.assign(titular, updateTitularDto);
        return await this.titularesRepository.save(titular);
    }

    async remove(id: number): Promise<void> {
        const titular = await this.findOne(id);
        await this.titularesRepository.remove(titular);
    }
}
