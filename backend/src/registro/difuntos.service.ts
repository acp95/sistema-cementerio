import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Difunto } from './entities/difunto.entity';
import { CreateDifuntoDto } from './dto/create-difunto.dto';
import { InhumacionesService } from './inhumaciones.service';

@Injectable()
export class DifuntosService {
    constructor(
        @InjectRepository(Difunto)
        private difuntosRepository: Repository<Difunto>,
        private inhumacionesService: InhumacionesService,
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

        // Validar acta de defuncion
        if (createDifuntoDto.actaDefuncion) {
            const existingActa = await this.difuntosRepository.findOne({
                where: { actaDefuncion: createDifuntoDto.actaDefuncion },
            });
            if (existingActa) {
                throw new ConflictException(
                    `Ya existe un difunto registrado con el Acta de Defunción ${createDifuntoDto.actaDefuncion}`
                );
            }
        }

        // 1. Crear difunto
        const { inhumacionData, titularId, ...difuntoData } = createDifuntoDto;
        const difunto = this.difuntosRepository.create({
            ...difuntoData,
            titular: titularId ? { id: titularId } as any : null
        });
        const savedDifunto = await this.difuntosRepository.save(difunto);

        // 2. Delegar la creación de inhumación (con validaciones, estado de espacio y pago automático)
        if (inhumacionData && inhumacionData.espacioId) {
            try {
                await this.inhumacionesService.create({
                    ...inhumacionData,
                    difuntoId: savedDifunto.id,
                } as any);
            } catch (error) {
                // Si falla la inhumación, eliminar el difunto creado para mantener consistencia
                await this.difuntosRepository.remove(savedDifunto);
                throw error;
            }
        }

        return savedDifunto;
    }

    async findAll(): Promise<Difunto[]> {
        return await this.difuntosRepository.find({
            relations: ['inhumacion', 'inhumacion.espacio', 'titular'],
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                dni: true,
                fechaDefuncion: true,
                fechaNacimiento: true,
                actaDefuncion: true,
                sexo: true,
                causaMuerte: true,
                observaciones: true,
                titular: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    dni: true
                },
                inhumacion: {
                    id: true,
                    espacio: {
                        id: true,
                        codigo: true
                    }
                }
            },
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Difunto> {
        const difunto = await this.difuntosRepository.findOne({
            where: { id },
            relations: ['inhumacion', 'inhumacion.espacio', 'inhumacion.titular', 'titular'],
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
        
        // Validación de DNI único al actualizar
        if (updateDifuntoDto.dni && updateDifuntoDto.dni !== difunto.dni) {
            const existente = await this.difuntosRepository.findOne({
                where: { dni: updateDifuntoDto.dni }
            });
            if (existente) {
                throw new ConflictException(`Ya existe otro difunto con el DNI ${updateDifuntoDto.dni}`);
            }
        }

        // Validación de Acta de Defunción única al actualizar
        if (updateDifuntoDto.actaDefuncion && updateDifuntoDto.actaDefuncion !== difunto.actaDefuncion) {
            const existente = await this.difuntosRepository.findOne({
                where: { actaDefuncion: updateDifuntoDto.actaDefuncion }
            });
            if (existente) {
                throw new ConflictException(`Ya existe otro difunto con el Acta de Defunción ${updateDifuntoDto.actaDefuncion}`);
            }
        }

        const { titularId, ...rest } = updateDifuntoDto;
        
        Object.assign(difunto, rest);
        if (titularId !== undefined) {
            difunto.titular = titularId ? { id: titularId } as any : null;
        }

        return await this.difuntosRepository.save(difunto);
    }

    async remove(id: number): Promise<void> {
        const difunto = await this.findOne(id);
        await this.difuntosRepository.remove(difunto);
    }
}
