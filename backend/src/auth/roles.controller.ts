import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los roles' })
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un rol por ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOne(id);
    }

    @Get(':id/with-permisos')
    @ApiOperation({ summary: 'Obtener un rol con sus IDs de permisos' })
    findOneWithPermisos(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOneWithPermisos(id);
    }

    @Get(':id/permisos')
    @ApiOperation({ summary: 'Obtener los permisos de un rol' })
    getPermisosByRol(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.getPermisosByRol(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo rol' })
    create(@Body() createRolDto: any) {
        return this.rolesService.create(createRolDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un rol' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateRolDto: any) {
        return this.rolesService.update(id, updateRolDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un rol' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.remove(id);
    }
}
