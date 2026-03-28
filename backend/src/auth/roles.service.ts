import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { Permiso } from './entities/permiso.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
        @InjectRepository(RolPermiso)
        private rolPermisoRepository: Repository<RolPermiso>,
        @InjectRepository(Permiso)
        private permisoRepository: Repository<Permiso>,
        private dataSource: DataSource,
    ) { }

    async findAll(): Promise<Rol[]> {
        return await this.rolRepository.find({
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Rol> {
        const rol = await this.rolRepository.findOneBy({ id });
        if (!rol) {
            throw new NotFoundException(`Rol con ID ${id} no encontrado`);
        }
        return rol;
    }

    async findOneWithPermisos(id: number): Promise<Rol & { permisosIds: number[] }> {
        const rol = await this.findOne(id);
        const rolPermisos = await this.rolPermisoRepository.find({
            where: { rolId: id },
        });
        return {
            ...rol,
            permisosIds: rolPermisos.map(rp => rp.permisoId),
        };
    }

    async create(createRolDto: any): Promise<Rol> {
        const { permisosIds, ...rolData } = createRolDto;
        const newRol = this.rolRepository.create(rolData as Rol);
        const savedRol = await this.rolRepository.save(newRol);

        if (permisosIds && permisosIds.length > 0) {
            await this.assignPermisos(savedRol.id, permisosIds);
        }

        return savedRol;
    }

    async update(id: number, updateRolDto: any): Promise<Rol> {
        const { permisosIds, ...rolData } = updateRolDto;
        const rol = await this.findOne(id);
        this.rolRepository.merge(rol, rolData);
        const savedRol = await this.rolRepository.save(rol);

        if (permisosIds !== undefined) {
            await this.syncPermisos(id, permisosIds);
        }

        return savedRol;
    }

    async remove(id: number): Promise<void> {
        const rol = await this.findOne(id);
        await this.rolRepository.remove(rol);
    }

    /**
     * Assigns new permissions to a role without removing existing ones
     */
    async assignPermisos(rolId: number, permisosIds: number[]): Promise<void> {
        const rolPermisos = permisosIds.map(permisoId => ({
            rolId,
            permisoId,
        }));
        await this.rolPermisoRepository.save(rolPermisos);
    }

    /**
     * Synchronizes permissions for a role (removes old ones, adds new ones)
     */
    async syncPermisos(rolId: number, permisosIds: number[]): Promise<void> {
        await this.dataSource.transaction(async manager => {
            // Remove all existing permissions for this role
            await manager.delete(RolPermiso, { rolId });

            // Add new permissions
            if (permisosIds.length > 0) {
                const rolPermisos = permisosIds.map(permisoId => ({
                    rolId,
                    permisoId,
                }));
                await manager.save(RolPermiso, rolPermisos);
            }
        });
    }

    /**
     * Get all permissions for a specific role
     */
    async getPermisosByRol(rolId: number): Promise<Permiso[]> {
        const rolPermisos = await this.rolPermisoRepository.find({
            where: { rolId },
            relations: ['permiso'],
        });
        return rolPermisos.map(rp => rp.permiso);
    }
}
