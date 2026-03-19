import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    findAll() {
        return this.usuariosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    create(@Body() createUsuarioDto: any) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un usuario' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: any) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usuariosService.remove(id);
    }
}
