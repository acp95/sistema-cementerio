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
import { DifuntosService } from './difuntos.service';
import { CreateDifuntoDto } from './dto/create-difunto.dto';

@ApiTags('difuntos')
@Controller('difuntos')
export class DifuntosController {
    constructor(private readonly difuntosService: DifuntosService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo difunto' })
    @ApiResponse({ status: 201, description: 'Difunto registrado exitosamente' })
    create(@Body() createDifuntoDto: CreateDifuntoDto) {
        return this.difuntosService.create(createDifuntoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los difuntos' })
    @ApiResponse({ status: 200, description: 'Lista de difuntos' })
    findAll() {
        return this.difuntosService.findAll();
    }

    @Get('buscar/nombre')
    @ApiOperation({ summary: 'Buscar difuntos por nombre o apellido' })
    @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
    @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
    searchByName(@Query('q') searchTerm: string) {
        return this.difuntosService.searchByName(searchTerm);
    }

    @Get('buscar/dni')
    @ApiOperation({ summary: 'Buscar  difuntos por DNI' })
    @ApiQuery({ name: 'dni', description: 'DNI del difunto' })
    @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
    searchByDni(@Query('dni') dni: string) {
        return this.difuntosService.searchByDni(dni);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un difunto por ID' })
    @ApiParam({ name: 'id', description: 'ID del difunto' })
    @ApiResponse({ status: 200, description: 'Difunto encontrado' })
    @ApiResponse({ status: 404, description: 'Difunto no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.difuntosService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un difunto' })
    @ApiParam({ name: 'id', description: 'ID del difunto' })
    @ApiResponse({ status: 200, description: 'Difunto actualizado' })
    @ApiResponse({ status: 404, description: 'Difunto no encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDifuntoDto: Partial<CreateDifuntoDto>,
    ) {
        return this.difuntosService.update(id, updateDifuntoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un difunto' })
    @ApiParam({ name: 'id', description: 'ID del difunto' })
    @ApiResponse({ status: 200, description: 'Difunto eliminado' })
    @ApiResponse({ status: 404, description: 'Difunto no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.difuntosService.remove(id);
    }
}
