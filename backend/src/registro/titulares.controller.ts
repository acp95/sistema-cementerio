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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TitularesService } from './titulares.service';
import { CreateTitularDto } from './dto/create-titular.dto';
import { UpdateTitularDto } from './dto/update-titular.dto';

@ApiTags('titulares')
@Controller('titulares')
export class TitularesController {
    constructor(private readonly titularesService: TitularesService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo titular' })
    @ApiResponse({ status: 201, description: 'Titular creado exitosamente' })
    @ApiResponse({ status: 409, description: 'DNI ya registrado' })
    create(@Body() createTitularDto: CreateTitularDto) {
        return this.titularesService.create(createTitularDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los titulares' })
    @ApiResponse({ status: 200, description: 'Lista de titulares' })
    findAll() {
        return this.titularesService.findAll();
    }

    @Get('buscar/dni/:dni')
    @ApiOperation({ summary: 'Buscar titular por DNI' })
    @ApiParam({ name: 'dni', description: 'DNI del titular' })
    @ApiResponse({ status: 200, description: 'Titular encontrado' })
    @ApiResponse({ status: 404, description: 'Titular no encontrado' })
    findByDni(@Param('dni') dni: string) {
        return this.titularesService.findByDni(dni);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un titular por ID' })
    @ApiParam({ name: 'id', description: 'ID del titular' })
    @ApiResponse({ status: 200, description: 'Titular encontrado' })
    @ApiResponse({ status: 404, description: 'Titular no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.titularesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un titular' })
    @ApiParam({ name: 'id', description: 'ID del titular' })
    @ApiResponse({ status: 200, description: 'Titular actualizado' })
    @ApiResponse({ status: 404, description: 'Titular no encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTitularDto: UpdateTitularDto,
    ) {
        return this.titularesService.update(id, updateTitularDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un titular' })
    @ApiParam({ name: 'id', description: 'ID del titular' })
    @ApiResponse({ status: 200, description: 'Titular eliminado' })
    @ApiResponse({ status: 404, description: 'Titular no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.titularesService.remove(id);
    }
}
