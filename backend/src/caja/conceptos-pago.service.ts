import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptoPago } from './entities/concepto-pago.entity';
import { CreateConceptoPagoDto } from './dto/create-concepto-pago.dto';
import { UpdateConceptoPagoDto } from './dto/update-concepto-pago.dto';

@Injectable()
export class ConceptosPagoService {
    constructor(
        @InjectRepository(ConceptoPago)
        private conceptosRepository: Repository<ConceptoPago>,
    ) { }

    async create(createConceptoDto: CreateConceptoPagoDto): Promise<ConceptoPago> {
        const concepto = this.conceptosRepository.create(createConceptoDto);
        return await this.conceptosRepository.save(concepto);
    }

    async update(id: number, updateConceptoDto: UpdateConceptoPagoDto): Promise<ConceptoPago> {
        const concepto = await this.findOne(id);
        this.conceptosRepository.merge(concepto, updateConceptoDto);
        return await this.conceptosRepository.save(concepto);
    }

    async findAll(includeInactive: boolean = false): Promise<ConceptoPago[]> {
        if (includeInactive) {
            return await this.conceptosRepository.find();
        }
        return await this.conceptosRepository.find({
            where: { activo: true },
        });
    }

    async findOne(id: number): Promise<ConceptoPago> {
        const concepto = await this.conceptosRepository.findOne({
            where: { id },
        });

        if (!concepto) {
            throw new NotFoundException(`Concepto de pago con ID ${id} no encontrado`);
        }

        return concepto;
    }

    async remove(id: number): Promise<void> {
        const concepto = await this.findOne(id);
        await this.conceptosRepository.remove(concepto);
    }
}
