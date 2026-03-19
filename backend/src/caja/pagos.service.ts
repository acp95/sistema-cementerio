import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { DetallePago } from './entities/detalle-pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
    constructor(
        @InjectRepository(Pago)
        private pagosRepository: Repository<Pago>,
        @InjectRepository(DetallePago)
        private detallesRepository: Repository<DetallePago>,
    ) { }

    async create(createPagoDto: CreatePagoDto): Promise<Pago> {
        // Generar código de recibo único
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const count = await this.pagosRepository.count();
        const numero = String(count + 1).padStart(6, '0');
        const codigoRecibo = `REC-${año}${mes}-${numero}`;

        // Crear el pago
        const pago = this.pagosRepository.create({
            ...createPagoDto,
            codigoRecibo,
            detalles: undefined, // No incluir detalles en el create principal
        });

        const savedPago = await this.pagosRepository.save(pago);

        // Crear los detalles solo si existen
        if (createPagoDto.detalles && createPagoDto.detalles.length > 0) {
            const detalles = createPagoDto.detalles.map((detalle) => {
                return this.detallesRepository.create({
                    pagoId: savedPago.id,
                    ...detalle,
                });
            });

            await this.detallesRepository.save(detalles);
        }

        // Retornar el pago con sus detalles
        return await this.findOne(savedPago.id);
    }

    async findAll(): Promise<Pago[]> {
        return await this.pagosRepository.find({
            relations: ['titular', 'usuario', 'inhumacion', 'inhumacion.difunto', 'detalles', 'detalles.concepto'],
            select: {
                id: true,
                codigoRecibo: true,
                fechaPago: true,
                montoTotal: true,
                estado: true,
                metodoPago: true,
                titular: {
                    id: true,
                    nombres: true,
                    apellidos: true
                },
                usuario: {
                    id: true,
                    nombreCompleto: true
                },
                inhumacion: {
                    id: true,
                    difunto: {
                        id: true,
                        nombres: true,
                        apellidos: true
                    }
                },
                detalles: {
                    id: true,
                    cantidad: true,
                    subtotal: true,
                    concepto: {
                        id: true,
                        nombre: true
                    }
                }
            },
            order: { fechaPago: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Pago> {
        const pago = await this.pagosRepository.findOne({
            where: { id },
            relations: ['titular', 'usuario', 'inhumacion', 'inhumacion.difunto', 'detalles', 'detalles.concepto'],
        });

        if (!pago) {
            throw new NotFoundException(`Pago con ID ${id} no encontrado`);
        }

        return pago;
    }

    async findByTitular(titularId: number): Promise<Pago[]> {
        return await this.pagosRepository.find({
            where: { titularId },
            relations: ['detalles', 'detalles.concepto'],
            order: { fechaPago: 'DESC' },
        });
    }

    async update(id: number, updatePagoDto: UpdatePagoDto): Promise<Pago> {
        const pago = await this.findOne(id);
        const { detalles, ...pagoData } = updatePagoDto as any; // Cast as any if UpdatePagoDto logic is complex

        // Update main fields
        this.pagosRepository.merge(pago, pagoData);

        // Handle details update if necessary (complex logic omitted for brevity, assuming full replace or ignore)
        // ideally unrelated logic shouldn't be here, but basic field update:

        return await this.pagosRepository.save(pago);
    }

    async findByInhumacion(inhumacionId: number): Promise<Pago[]> {
        return await this.pagosRepository.find({
            where: { inhumacionId },
            relations: ['detalles', 'detalles.concepto'],
            order: { fechaPago: 'DESC' },
        });
    }

    async anularPago(id: number): Promise<Pago> {
        const pago = await this.findOne(id);
        pago.estado = 'ANULADO';
        return await this.pagosRepository.save(pago);
    }
}
