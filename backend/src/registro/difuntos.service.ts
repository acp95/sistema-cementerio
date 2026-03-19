import { Injectable, NotFoundException, Inject, ConflictException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Difunto } from './entities/difunto.entity';
import { Inhumacion } from './entities/inhumacion.entity';
import { Espacio, EstadoEspacio } from '../infraestructura/entities/espacio.entity';
import { CreateDifuntoDto } from './dto/create-difunto.dto';
import { PagosService } from '../caja/pagos.service';
import { ConceptosPagoService } from '../caja/conceptos-pago.service';
import { MetodoPago } from '../caja/entities/pago.entity';

@Injectable()
export class DifuntosService {
    constructor(
        @InjectRepository(Difunto)
        private difuntosRepository: Repository<Difunto>,
        @Inject(DataSource)
        private dataSource: DataSource,
        @Inject(forwardRef(() => PagosService))
        private pagosService: PagosService,
        @Inject(forwardRef(() => ConceptosPagoService))
        private conceptosPagoService: ConceptosPagoService,
    ) { }

    async create(createDifuntoDto: CreateDifuntoDto): Promise<Difunto> {
        // Validar que no exista otro difunto con el mismo DNI
        if (createDifuntoDto.dni) {
            const existingDifunto = await this.difuntosRepository.findOne({
                where: { dni: createDifuntoDto.dni },
            });
            if (existingDifunto) {
                throw new ConflictException(
                    `Ya existe un difunto registrado con el DNI ${createDifuntoDto.dni}`
                );
            }
        }

        // Usar transacción para garantizar atomicidad
        const result = await this.dataSource.transaction(async (manager) => {
            // 1. Crear difunto
            const { inhumacionData, ...difuntoData } = createDifuntoDto;
            const difunto = manager.create(Difunto, difuntoData);
            const savedDifunto = await manager.save(difunto);

            let savedInhumacion: Inhumacion | null = null;

            // 2. Crear inhumación asociada si se proporcionaron datos
            if (inhumacionData && inhumacionData.espacioId) {
                const { conceptoPagoId, usuarioId, ...inhumacionFields } = inhumacionData as any;
                const inhumacion = manager.create(Inhumacion, {
                    difuntoId: savedDifunto.id,
                    ...inhumacionFields,
                });
                savedInhumacion = await manager.save(inhumacion);

                // 3. Actualizar estado del espacio a OCUPADO
                await manager.update(Espacio, inhumacionData.espacioId, {
                    estado: EstadoEspacio.OCUPADO,
                });
            }

            return { savedDifunto, savedInhumacion, inhumacionData };
        });

        // 4. Crear pago automático fuera de la transacción si se especificó concepto
        const { savedDifunto, savedInhumacion, inhumacionData } = result;
        if (savedInhumacion && inhumacionData?.conceptoPagoId && inhumacionData?.usuarioId) {
            try {
                const concepto = await this.conceptosPagoService.findOne(inhumacionData.conceptoPagoId);

                await this.pagosService.create({
                    titularId: savedInhumacion.titularId,
                    usuarioId: inhumacionData.usuarioId,
                    inhumacionId: savedInhumacion.id,
                    montoTotal: Number(concepto.precioBase),
                    metodoPago: MetodoPago.EFECTIVO,
                    estado: 'PENDIENTE',
                    observaciones: `Pago pendiente por servicio de inhumación - ${concepto.nombre}`,
                    detalles: [{
                        conceptoId: inhumacionData.conceptoPagoId,
                        cantidad: 1,
                        subtotal: Number(concepto.precioBase),
                    }],
                });
            } catch (error) {
                console.error('Error al crear pago automático:', error);
            }
        }

        return savedDifunto;
    }

    async findAll(): Promise<Difunto[]> {
        return await this.difuntosRepository.find({
            relations: ['inhumacion', 'inhumacion.espacio'],
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                dni: true,
                fechaDefuncion: true,
                fechaNacimiento: true,
                inhumacion: {
                    id: true,
                    espacio: {
                        id: true,
                        codigo: true
                    }
                }
            },
            order: { fechaDefuncion: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Difunto> {
        const difunto = await this.difuntosRepository.findOne({
            where: { id },
            relations: ['inhumacion', 'inhumacion.espacio', 'inhumacion.titular'],
        });

        if (!difunto) {
            throw new NotFoundException(`Difunto con ID ${id} no encontrado`);
        }

        return difunto;
    }

    async searchByName(searchTerm: string): Promise<Difunto[]> {
        return await this.difuntosRepository.find({
            where: [
                { nombres: Like(`%${searchTerm}%`) },
                { apellidos: Like(`%${searchTerm}%`) },
            ],
            relations: ['inhumacion'],
            take: 20, // Limitar resultados
        });
    }

    async searchByDni(dni: string): Promise<Difunto[]> {
        return await this.difuntosRepository.find({
            where: { dni: Like(`%${dni}%`) },
            relations: ['inhumacion'],
        });
    }

    async update(id: number, updateDifuntoDto: Partial<CreateDifuntoDto>): Promise<Difunto> {
        const difunto = await this.findOne(id);
        Object.assign(difunto, updateDifuntoDto);
        return await this.difuntosRepository.save(difunto);
    }

    async remove(id: number): Promise<void> {
        const difunto = await this.findOne(id);
        await this.difuntosRepository.remove(difunto);
    }
}
