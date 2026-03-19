import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../auth/entities/rol.entity';
import { Usuario } from '../auth/entities/usuario.entity';
import { Sector } from '../infraestructura/entities/sector.entity';
import { ConceptoPago } from '../caja/entities/concepto-pago.entity';
import { Permiso } from '../auth/entities/permiso.entity';
import { RolPermiso } from '../auth/entities/rol-permiso.entity';

export class DatabaseSeeder {
    constructor(private dataSource: DataSource) { }

    async seed() {
        console.log('🌱 Iniciando proceso de seeding...');

        try {
            // 1. Crear roles
            await this.seedRoles();

            // 2. Crear permisos
            await this.seedPermisos();

            // 3. Asignar permisos al rol ADMIN
            await this.seedRolAdminPermisos();

            // 4. Crear usuario admin
            await this.seedUsuarioAdmin();

            // 5. Crear sectores
            await this.seedSectores();

            // 6. Crear conceptos de pago
            await this.seedConceptosPago();

            console.log('✅ Seeding completado exitosamente!');
        } catch (error) {
            console.error('❌ Error durante el seeding:', error);
            throw error;
        }
    }

    private async seedRoles() {
        const rolesRepository = this.dataSource.getRepository(Rol);

        const existingRoles = await rolesRepository.count();
        if (existingRoles > 0) {
            console.log('⏭️  Roles ya existen, saltando...');
            return;
        }

        const roles = [
            {
                nombre: 'ADMIN',
                descripcion: 'Acceso total al sistema',
                activo: true,
            },
            {
                nombre: 'CAJERO',
                descripcion: 'Acceso a módulo de caja y reportes financieros',
                activo: true,
            },
            {
                nombre: 'REGISTRADOR',
                descripcion: 'Gestión de difuntos e infraestructura',
                activo: true,
            },
            {
                nombre: 'CONSULTA',
                descripcion: 'Solo lectura de mapas y ubicación',
                activo: true,
            },
        ];

        await rolesRepository.save(roles);
        console.log('✓ Roles creados');
    }

    private async seedUsuarioAdmin() {
        const usuariosRepository = this.dataSource.getRepository(Usuario);

        const existingAdmin = await usuariosRepository.findOne({
            where: { username: 'admin' },
        });

        if (existingAdmin) {
            console.log('⏭️  Usuario admin ya existe, saltando...');
            return;
        }

        const rolesRepository = this.dataSource.getRepository(Rol);
        const rolAdmin = await rolesRepository.findOne({
            where: { nombre: 'ADMIN' },
        });

        if (!rolAdmin) {
            throw new Error('Rol ADMIN no encontrado. Ejecuta seedRoles primero.');
        }

        const passwordHash = await bcrypt.hash('admin123', 10);

        const admin = usuariosRepository.create({
            rolId: rolAdmin.id,
            username: 'admin',
            passwordHash: passwordHash,
            nombreCompleto: 'Administrador Municipal',
            email: 'sistemas@municipio.gob.pe',
            activo: true,
        });

        await usuariosRepository.save(admin);
        console.log('✓ Usuario admin creado (username: admin, password: admin123)');
    }

    private async seedSectores() {
        const sectoresRepository = this.dataSource.getRepository(Sector);

        const existingSectores = await sectoresRepository.count();
        if (existingSectores > 0) {
            console.log('⏭️  Sectores ya existen, saltando...');
            return;
        }

        const sectores = [
            { nombre: 'SAN MATEO', tipo: 'PABELLON' },
            { nombre: 'SAN PABLO', tipo: 'PABELLON' },
            { nombre: 'SANTA TERESA', tipo: 'PABELLON' },
        ];

        await sectoresRepository.save(sectores);
        console.log('✓ Sectores creados');
    }

    private async seedConceptosPago() {
        const conceptosRepository = this.dataSource.getRepository(ConceptoPago);

        const existingConceptos = await conceptosRepository.count();
        if (existingConceptos > 0) {
            console.log('⏭️  Conceptos de pago ya existen, saltando...');
            return;
        }

        const conceptos = [
            {
                nombre: 'Derecho de Inhumación (Nicho)',
                precioBase: 250.0,
                esPeriodico: false,
                activo: true,
            },
            {
                nombre: 'Mantenimiento y Limpieza (Anual)',
                precioBase: 50.0,
                esPeriodico: true,
                activo: true,
            },
            {
                nombre: 'Certificado de Búsqueda',
                precioBase: 15.0,
                esPeriodico: false,
                activo: true,
            },
        ];

        await conceptosRepository.save(conceptos);
        console.log('✓ Conceptos de pago creados');
    }

    private async seedPermisos() {
        const permisosRepository = this.dataSource.getRepository(Permiso);

        // Lista completa de permisos del sistema
        const permisosData = [
            // Difuntos
            { slug: 'ver_difuntos', descripcion: 'Ver listado de difuntos' },
            { slug: 'crear_difuntos', descripcion: 'Crear nuevos difuntos' },
            { slug: 'actualizar_difuntos', descripcion: 'Actualizar datos de difuntos' },
            { slug: 'eliminar_difuntos', descripcion: 'Eliminar difuntos' },
            // Inhumaciones
            { slug: 'ver_inhumaciones', descripcion: 'Ver listado de inhumaciones' },
            { slug: 'crear_inhumaciones', descripcion: 'Crear nuevas inhumaciones' },
            { slug: 'actualizar_inhumaciones', descripcion: 'Actualizar inhumaciones' },
            { slug: 'eliminar_inhumaciones', descripcion: 'Eliminar inhumaciones' },
            // Sectores
            { slug: 'ver_sectores', descripcion: 'Ver listado de sectores' },
            { slug: 'crear_sectores', descripcion: 'Crear nuevos sectores' },
            { slug: 'actualizar_sectores', descripcion: 'Actualizar sectores' },
            { slug: 'eliminar_sectores', descripcion: 'Eliminar sectores' },
            // Espacios
            { slug: 'ver_espacios', descripcion: 'Ver listado de espacios' },
            { slug: 'crear_espacios', descripcion: 'Crear nuevos espacios' },
            { slug: 'actualizar_espacios', descripcion: 'Actualizar espacios' },
            { slug: 'eliminar_espacios', descripcion: 'Eliminar espacios' },
            // Conceptos de Pago
            { slug: 'ver_conceptos', descripcion: 'Ver listado de conceptos de pago' },
            { slug: 'crear_conceptos', descripcion: 'Crear nuevos conceptos de pago' },
            { slug: 'actualizar_conceptos', descripcion: 'Actualizar conceptos de pago' },
            { slug: 'eliminar_conceptos', descripcion: 'Eliminar conceptos de pago' },
            // Pagos
            { slug: 'ver_pagos', descripcion: 'Ver listado de pagos' },
            { slug: 'crear_pagos', descripcion: 'Crear nuevos pagos' },
            { slug: 'actualizar_pagos', descripcion: 'Actualizar pagos' },
            { slug: 'eliminar_pagos', descripcion: 'Eliminar pagos' },
            { slug: 'anular_pagos', descripcion: 'Anular pagos registrados' },
            // Usuarios
            { slug: 'ver_usuarios', descripcion: 'Ver listado de usuarios' },
            { slug: 'crear_usuarios', descripcion: 'Crear nuevos usuarios' },
            { slug: 'actualizar_usuarios', descripcion: 'Actualizar usuarios' },
            { slug: 'eliminar_usuarios', descripcion: 'Eliminar usuarios' },
            // Roles
            { slug: 'ver_roles', descripcion: 'Ver listado de roles' },
            { slug: 'crear_roles', descripcion: 'Crear nuevos roles' },
            { slug: 'actualizar_roles', descripcion: 'Actualizar roles' },
            { slug: 'eliminar_roles', descripcion: 'Eliminar roles' },
        ];

        let createdCount = 0;
        for (const permisoData of permisosData) {
            const existingPermiso = await permisosRepository.findOne({
                where: { slug: permisoData.slug },
            });

            if (!existingPermiso) {
                await permisosRepository.save(permisoData);
                createdCount++;
            }
        }

        if (createdCount > 0) {
            console.log(`✓ ${createdCount} permisos creados`);
        } else {
            console.log('⏭️  Permisos ya existen, saltando...');
        }
    }

    private async seedRolAdminPermisos() {
        const rolesRepository = this.dataSource.getRepository(Rol);
        const permisosRepository = this.dataSource.getRepository(Permiso);
        const rolPermisoRepository = this.dataSource.getRepository(RolPermiso);

        // Obtener rol ADMIN
        const rolAdmin = await rolesRepository.findOne({
            where: { nombre: 'ADMIN' },
        });

        if (!rolAdmin) {
            console.log('⚠️  Rol ADMIN no encontrado, saltando asignación de permisos...');
            return;
        }

        // Verificar si ya tiene permisos asignados
        const existingPermisos = await rolPermisoRepository.count({
            where: { rolId: rolAdmin.id },
        });

        // Obtener todos los permisos
        const allPermisos = await permisosRepository.find();

        if (existingPermisos >= allPermisos.length) {
            console.log('⏭️  Rol ADMIN ya tiene todos los permisos, saltando...');
            return;
        }

        // Asignar todos los permisos al rol ADMIN
        for (const permiso of allPermisos) {
            const existingRolPermiso = await rolPermisoRepository.findOne({
                where: { rolId: rolAdmin.id, permisoId: permiso.id },
            });

            if (!existingRolPermiso) {
                await rolPermisoRepository.save({
                    rolId: rolAdmin.id,
                    permisoId: permiso.id,
                });
            }
        }

        console.log(`✓ Permisos asignados al rol ADMIN (${allPermisos.length} permisos)`);
    }
}
