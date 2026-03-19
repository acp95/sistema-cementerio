import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Patch,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InhumacionesService } from './inhumaciones.service';
import { CreateInhumacionDto } from './dto/create-inhumacion.dto';
import { UpdateInhumacionDto } from './dto/update-inhumacion.dto';

@ApiTags('inhumaciones')
@Controller('inhumaciones')
export class InhumacionesController {
    constructor(private readonly inhumacionesService: InhumacionesService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar una nueva inhumación' })
    @ApiResponse({ status: 201, description: 'Inhumación registrada exitosamente' })
    @ApiResponse({ status: 400, description: 'Espacio no disponible o datos inválidos' })
    @ApiResponse({ status: 409, description: 'El difunto ya tiene una inhumación registrada' })
    create(@Body() createInhumacionDto: CreateInhumacionDto) {
        return this.inhumacionesService.create(createInhumacionDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una inhumación' })
    @ApiParam({ name: 'id', description: 'ID de la inhumación' })
    @ApiResponse({ status: 200, description: 'Inhumación actualizada' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateInhumacionDto: UpdateInhumacionDto) {
        return this.inhumacionesService.update(id, updateInhumacionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las inhumaciones' })
    @ApiResponse({ status: 200, description: 'Lista de inhumaciones' })
    findAll() {
        return this.inhumacionesService.findAll();
    }

    @Get('vencidas')
    @ApiOperation({ summary: 'Obtener inhumaciones con concesión vencida' })
    @ApiResponse({ status: 200, description: 'Lista de inhumaciones vencidas' })
    findVencidas() {
        return this.inhumacionesService.findVencidas();
    }

    @Get('difunto/:difuntoId')
    @ApiOperation({ summary: 'Obtener inhumación por ID de difunto' })
    @ApiParam({ name: 'difuntoId', description: 'ID del difunto' })
    @ApiResponse({ status: 200, description: 'Inhumación encontrada' })
    @ApiResponse({ status: 404, description: 'Inhumación no encontrada' })
    findByDifunto(@Param('difuntoId', ParseIntPipe) difuntoId: number) {
        return this.inhumacionesService.findByDifunto(difuntoId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una inhumación por ID' })
    @ApiParam({ name: 'id', description: 'ID de la inhumación' })
    @ApiResponse({ status: 200, description: 'Inhumación encontrada' })
    @ApiResponse({ status: 404, description: 'Inhumación no encontrada' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.inhumacionesService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una inhumación (libera el espacio)' })
    @ApiParam({ name: 'id', description: 'ID de la inhumación' })
    @ApiResponse({ status: 200, description: 'Inhumación eliminada y espacio liberado' })
    @ApiResponse({ status: 404, description: 'Inhumación no encontrada' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.inhumacionesService.remove(id);
    }
}
