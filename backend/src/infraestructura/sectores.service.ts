import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from './entities/sector.entity';
import { Espacio, EstadoEspacio } from './entities/espacio.entity';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class SectoresService {
    constructor(
        @InjectRepository(Sector)
        private sectoresRepository: Repository<Sector>,
        @InjectRepository(Espacio)
        private espaciosRepository: Repository<Espacio>,
    ) { }

    async create(createSectorDto: CreateSectorDto): Promise<Sector> {
        // Create sector
        const sector = this.sectoresRepository.create(createSectorDto);
        const savedSector = await this.sectoresRepository.save(sector);

        // Auto-generate espacios if capacidadTotal is specified
        if (createSectorDto.capacidadTotal && createSectorDto.capacidadTotal > 0) {
            const espacios: Espacio[] = [];
            const capacidad = createSectorDto.capacidadTotal;

            // Generate sector prefix code (first 2-3 letters of sector name)
            const prefijo = this.generarPrefijo(createSectorDto.nombre);

            // Calculate grid dimensions (e.g., 30 spaces = 5 rows x 6 columns)
            const columnas = Math.ceil(Math.sqrt(capacidad));
            const filas = Math.ceil(capacidad / columnas);

            let contador = 1;
            for (let fila = 1; fila <= filas && contador <= capacidad; fila++) {
                for (let col = 1; col <= columnas && contador <= capacidad; col++) {
                    const espacio = this.espaciosRepository.create({
                        sectorId: savedSector.id,
                        codigo: `${prefijo}-${contador.toString().padStart(3, '0')}`, // SM-001, SM-002...
                        fila: fila.toString(),
                        columna: col.toString(),
                        numero: contador.toString(), // Simple number
                        tipoEspacio: createSectorDto.tipoEspacio?.toUpperCase() || 'NICHO',
                        estado: EstadoEspacio.LIBRE,
                    });
                    espacios.push(espacio);
                    contador++;
                }
            }

            // Save all espacios
            await this.espaciosRepository.save(espacios);
        }

        return savedSector;
    }

    /**
     * Generate a sector prefix code from sector name
     * Examples: "San Mateo" -> "SM", "Jardin A" -> "JA", "Pabellon 1" -> "P1"
     */
    private generarPrefijo(nombreSector: string): string {
        // Remove special characters and trim
        const nombre = nombreSector.trim().toUpperCase();

        // Split by spaces and take first letter of each word (max 2-3 letters)
        const palabras = nombre.split(/\s+/);

        if (palabras.length >= 2) {
            // Take first letter of first 2 words: "SAN MATEO" -> "SM"
            return palabras.slice(0, 2).map(p => p[0]).join('');
        } else if (palabras.length === 1) {
            // Take first 2 letters: "JARDIN" -> "JA"
            return palabras[0].substring(0, 2);
        }

        return 'SC'; // Default: Sector
    }

    async findAll(): Promise<Sector[]> {
        return await this.sectoresRepository.find({
            relations: ['espacios'],
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Sector> {
        const sector = await this.sectoresRepository.findOne({
            where: { id },
            relations: ['espacios'],
        });

        if (!sector) {
            throw new NotFoundException(`Sector con ID ${id} no encontrado`);
        }

        return sector;
    }

    async update(id: number, updateSectorDto: UpdateSectorDto): Promise<Sector> {
        const sector = await this.findOne(id);
        Object.assign(sector, updateSectorDto);
        return await this.sectoresRepository.save(sector);
    }


    async remove(id: number): Promise<void> {
        const sector = await this.findOne(id);

        // Check if sector has associated espacios
        if (sector.espacios && sector.espacios.length > 0) {
            // Check if all espacios are LIBRE (empty)
            const ocupados = sector.espacios.filter(e => e.estado !== 'LIBRE');

            if (ocupados.length > 0) {
                throw new Error(`No se puede eliminar el sector "${sector.nombre}" porque tiene ${ocupados.length} espacio(s) ocupado(s) o en uso. Libere primero estos espacios.`);
            }

            // All espacios are LIBRE, delete them automatically
            await this.espaciosRepository.remove(sector.espacios);
        }

        await this.sectoresRepository.remove(sector);
    }
}
