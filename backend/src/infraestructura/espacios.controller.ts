import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EspaciosService } from './espacios.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';
import { FilterEspaciosDto } from './dto/filter-espacios.dto';
import { EstadoEspacio } from './entities/espacio.entity';

@ApiTags('espacios')
@Controller('espacios')
export class EspaciosController {
    constructor(private readonly espaciosService: EspaciosService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo espacio (nicho/fosa)' })
    @ApiResponse({ status: 201, description: 'Espacio creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createEspacioDto: CreateEspacioDto) {
        return this.espaciosService.create(createEspacioDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los espacios con filtros opcionales' })
    @ApiQuery({ name: 'sectorId', required: false, description: 'Filtrar por sector' })
    @ApiQuery({ name: 'estado', required: false, enum: EstadoEspacio, description: 'Filtrar por estado' })
    @ApiResponse({ status: 200, description: 'Lista de espacios' })
    findAll(@Query() filters: FilterEspaciosDto) {
        return this.espaciosService.findAll(filters);
    }

    @Get('libres')
    @ApiOperation({ summary: 'Obtener solo espacios disponibles' })
    @ApiResponse({ status: 200, description: 'Lista de espacios libres' })
    findLibres() {
        return this.espaciosService.findLibres();
    }

    @Post('sync-estados')
    @ApiOperation({ summary: 'Sincronizar estados de espacios con inhumaciones activas' })
    @ApiResponse({ status: 200, description: 'Estados sincronizados' })
    syncEstados() {
        return this.espaciosService.syncEstados();
    }

    @Get('mapa-sector/:sectorId')
    @ApiOperation({ summary: 'Obtener mapa de nichos para un sector' })
    @ApiParam({ name: 'sectorId', description: 'ID del sector' })
    @ApiResponse({ status: 200, description: 'Mapa de espacios del sector' })
    getMapaBySector(@Param('sectorId', ParseIntPipe) sectorId: number) {
        return this.espaciosService.getMapaBySector(sectorId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un espacio por ID' })
    @ApiParam({ name: 'id', description: 'ID del espacio' })
    @ApiResponse({ status: 200, description: 'Espacio encontrado' })
    @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.espaciosService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un espacio' })
    @ApiParam({ name: 'id', description: 'ID del espacio' })
    @ApiResponse({ status: 200, description: 'Espacio actualizado' })
    @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEspacioDto: UpdateEspacioDto,
    ) {
        return this.espaciosService.update(id, updateEspacioDto);
    }

    @Patch(':id/estado/:nuevoEstado')
    @ApiOperation({ summary: 'Cambiar el estado de un espacio' })
    @ApiParam({ name: 'id', description: 'ID del espacio' })
    @ApiParam({ name: 'nuevoEstado', enum: EstadoEspacio, description: 'Nuevo estado' })
    @ApiResponse({ status: 200, description: 'Estado cambiado exitosamente' })
    @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
    cambiarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Param('nuevoEstado') nuevoEstado: EstadoEspacio,
    ) {
        return this.espaciosService.cambiarEstado(id, nuevoEstado);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un espacio' })
    @ApiParam({ name: 'id', description: 'ID del espacio' })
    @ApiResponse({ status: 200, description: 'Espacio eliminado' })
    @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.espaciosService.remove(id);
    }
}
