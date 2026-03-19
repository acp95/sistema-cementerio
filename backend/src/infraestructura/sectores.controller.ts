import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SectoresService } from './sectores.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@ApiTags('sectores')
@Controller('sectores')
export class SectoresController {
    constructor(private readonly sectoresService: SectoresService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo sector' })
    @ApiResponse({
        status: 201,
        description: 'Sector creado exitosamente',
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createSectorDto: CreateSectorDto) {
        return this.sectoresService.create(createSectorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los sectores' })
    @ApiResponse({ status: 200, description: 'Lista de sectores con sus espacios' })
    findAll() {
        return this.sectoresService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un sector por ID' })
    @ApiParam({ name: 'id', description: 'ID del sector' })
    @ApiResponse({ status: 200, description: 'Sector encontrado' })
    @ApiResponse({ status: 404, description: 'Sector no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.sectoresService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un sector' })
    @ApiParam({ name: 'id', description: 'ID del sector' })
    @ApiResponse({ status: 200, description: 'Sector actualizado' })
    @ApiResponse({ status: 404, description: 'Sector no encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSectorDto: UpdateSectorDto,
    ) {
        return this.sectoresService.update(id, updateSectorDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un sector' })
    @ApiParam({ name: 'id', description: 'ID del sector' })
    @ApiResponse({ status: 200, description: 'Sector eliminado' })
    @ApiResponse({ status: 404, description: 'Sector no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.sectoresService.remove(id);
    }
}
