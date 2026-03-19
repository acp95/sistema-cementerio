import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Permisos')
@Controller('permisos')
export class PermisosController {
    constructor(private readonly permisosService: PermisosService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los permisos' })
    @ApiResponse({ status: 200, description: 'Lista de permisos' })
    findAll() {
        return this.permisosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un permiso por ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.permisosService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo permiso' })
    @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
    create(@Body() createPermisoDto: { slug: string; descripcion?: string }) {
        return this.permisosService.create(createPermisoDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un permiso' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePermisoDto: { slug?: string; descripcion?: string },
    ) {
        return this.permisosService.update(id, updatePermisoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un permiso' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.permisosService.remove(id);
    }
}
