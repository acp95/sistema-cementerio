import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';

@Injectable()
export class PermisosService {
    constructor(
        @InjectRepository(Permiso)
        private permisoRepository: Repository<Permiso>,
    ) { }

    async findAll(): Promise<Permiso[]> {
        return await this.permisoRepository.find({
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Permiso> {
        const permiso = await this.permisoRepository.findOneBy({ id });
        if (!permiso) {
            throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
        }
        return permiso;
    }

    async findBySlug(slug: string): Promise<Permiso | null> {
        return await this.permisoRepository.findOneBy({ slug });
    }

    async create(createPermisoDto: { slug: string; descripcion?: string }): Promise<Permiso> {
        const newPermiso = this.permisoRepository.create(createPermisoDto);
        return await this.permisoRepository.save(newPermiso);
    }

    async update(id: number, updatePermisoDto: { slug?: string; descripcion?: string }): Promise<Permiso> {
        const permiso = await this.findOne(id);
        this.permisoRepository.merge(permiso, updatePermisoDto);
        return await this.permisoRepository.save(permiso);
    }

    async remove(id: number): Promise<void> {
        const permiso = await this.findOne(id);
        await this.permisoRepository.remove(permiso);
    }
}
