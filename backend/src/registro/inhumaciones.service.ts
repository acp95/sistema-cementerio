import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inhumacion } from './entities/inhumacion.entity';
import { EstadoEspacio } from '../infraestructura/entities/espacio.entity';
import { EspaciosService } from '../infraestructura/espacios.service';
import { CreateInhumacionDto } from './dto/create-inhumacion.dto';
import { UpdateInhumacionDto } from './dto/update-inhumacion.dto';
import { PagosService } from '../caja/pagos.service';
import { ConceptosPagoService } from '../caja/conceptos-pago.service';
import { MetodoPago } from '../caja/entities/pago.entity';

@Injectable()
export class InhumacionesService {
    constructor(
        @InjectRepository(Inhumacion)
        private inhumacionesRepository: Repository<Inhumacion>,
        private espaciosService: EspaciosService,
        @Inject(forwardRef(() => PagosService))
        private pagosService: PagosService,
        @Inject(forwardRef(() => ConceptosPagoService))
        private conceptosPagoService: ConceptosPagoService,
    ) { }

    async create(createInhumacionDto: CreateInhumacionDto): Promise<Inhumacion> {
        // Verificar que el espacio esté disponible (usando EspaciosService)
        const espacio = await this.espaciosService.findOne(createInhumacionDto.espacioId);

        if (espacio.estado !== EstadoEspacio.LIBRE) {
            throw new BadRequestException(
                `El espacio no está disponible. Estado actual: ${espacio.estado}`,
            );
        }

        // Verificar que el difunto no esté ya inhumado
        const inhumacionExistente = await this.inhumacionesRepository.findOne({
            where: { difuntoId: createInhumacionDto.difuntoId },
        });

        if (inhumacionExistente) {
            throw new ConflictException(
                'El difunto ya tiene una inhumación registrada',
            );
        }

        // Extraer campos de pago antes de crear la inhumación
        const { conceptoPagoId, usuarioId, ...inhumacionData } = createInhumacionDto;

        // Crear la inhumación
        const inhumacion = this.inhumacionesRepository.create(inhumacionData);
        const saved = await this.inhumacionesRepository.save(inhumacion);

        // Actualizar el estado del espacio a OCUPADO (centralizado en EspaciosService)
        await this.espaciosService.marcarOcupado(createInhumacionDto.espacioId);

        // Si se proporcionó un concepto de pago, crear el pago automáticamente
        if (conceptoPagoId && usuarioId) {
            try {
                const concepto = await this.conceptosPagoService.findOne(conceptoPagoId);

                await this.pagosService.create({
                    titularId: saved.titularId,
                    usuarioId: usuarioId,
                    inhumacionId: saved.id,
                    montoTotal: Number(concepto.precioBase),
                    metodoPago: MetodoPago.EFECTIVO,
                    estado: 'PENDIENTE',
                    observaciones: `Pago pendiente por servicio de inhumación - ${concepto.nombre}`,
                    detalles: [{
                        conceptoId: conceptoPagoId,
                        cantidad: 1,
                        subtotal: Number(concepto.precioBase),
                    }],
                });
            } catch (error) {
                console.error('Error al crear pago automático:', error);
                // No lanzar error para no afectar la creación de la inhumación
            }
        }

        return saved;
    }

    async update(id: number, updateInhumacionDto: UpdateInhumacionDto): Promise<Inhumacion> {
        const inhumacion = await this.findOne(id);

        // Logic to handle space change if needed, confusing for MVP but standard merge for now
        this.inhumacionesRepository.merge(inhumacion, updateInhumacionDto as any);
        return await this.inhumacionesRepository.save(inhumacion);
    }

    async findAll(): Promise<Inhumacion[]> {
        return await this.inhumacionesRepository.find({
            relations: ['difunto', 'espacio', 'espacio.sector', 'titular', 'pagos'],
            select: {
                id: true,
                fechaInhumacion: true,
                estado: true,
                fechaVencimiento: true,
                tipoConcesion: true,
                horaInhumacion: true,
                numeroActa: true,
                observaciones: true,
                difuntoId: true,
                espacioId: true,
                titularId: true,
                difunto: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    dni: true,
                    sexo: true
                },
                espacio: {
                    id: true,
                    codigo: true,
                    tipoEspacio: true,
                    fila: true,
                    columna: true,
                    numero: true,
                    sector: {
                        id: true,
                        nombre: true
                    }
                },
                titular: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    dni: true,
                    telefono: true
                },
                pagos: {
                    id: true,
                    estado: true,
                    montoTotal: true
                }
            },
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Inhumacion> {
        const inhumacion = await this.inhumacionesRepository.findOne({
            where: { id },
            relations: ['difunto', 'espacio', 'espacio.sector', 'titular', 'pagos'],
        });

        if (!inhumacion) {
            throw new NotFoundException(`Inhumación con ID ${id} no encontrada`);
        }

        return inhumacion;
    }

    async findByDifunto(difuntoId: number): Promise<Inhumacion> {
        const inhumacion = await this.inhumacionesRepository.findOne({
            where: { difuntoId },
            relations: ['difunto', 'espacio', 'titular', 'pagos'],
        });

        if (!inhumacion) {
            throw new NotFoundException(
                `No se encontró inhumación para el difunto con ID ${difuntoId}`,
            );
        }

        return inhumacion;
    }

    async findVencidas(): Promise<Inhumacion[]> {
        const hoy = new Date();
        return await this.inhumacionesRepository
            .createQueryBuilder('inhumacion')
            .leftJoinAndSelect('inhumacion.difunto', 'difunto')
            .leftJoinAndSelect('inhumacion.espacio', 'espacio')
            .leftJoinAndSelect('inhumacion.titular', 'titular')
            .where('inhumacion.fechaVencimiento < :hoy', { hoy })
            .andWhere('inhumacion.estado = :estado', { estado: 'ACTIVO' })
            .getMany();
    }

    async remove(id: number): Promise<void> {
        const inhumacion = await this.findOne(id);

        // Liberar el espacio (centralizado en EspaciosService)
        await this.espaciosService.marcarLibre(inhumacion.espacioId);

        await this.inhumacionesRepository.remove(inhumacion);
    }

    async anular(id: number): Promise<Inhumacion> {
        const inhumacion = await this.findOne(id);

        // Liberar el espacio
        await this.espaciosService.marcarLibre(inhumacion.espacioId);

        inhumacion.estado = 'ANULADO';
        return await this.inhumacionesRepository.save(inhumacion);
    }

    async revertirAnulacion(id: number): Promise<Inhumacion> {
        const inhumacion = await this.findOne(id);

        if (inhumacion.estado !== 'ANULADO') {
            throw new BadRequestException('Solo se pueden revertir inhumaciones que estén ANULADAS');
        }

        // Verificar si el espacio sigue libre antes de re-ocuparlo
        const espacio = await this.espaciosService.findOne(inhumacion.espacioId);
        if (espacio.estado !== EstadoEspacio.LIBRE) {
            throw new ConflictException(
                `No se puede revertir la anulación. El espacio ${espacio.codigo} ya está ${espacio.estado}.`,
            );
        }

        // Re-ocupar el espacio
        await this.espaciosService.marcarOcupado(inhumacion.espacioId);

        inhumacion.estado = 'ACTIVO';
        return await this.inhumacionesRepository.save(inhumacion);
    }
}

