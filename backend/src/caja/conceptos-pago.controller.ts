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
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConceptosPagoService } from './conceptos-pago.service';
import { CreateConceptoPagoDto } from './dto/create-concepto-pago.dto';
import { UpdateConceptoPagoDto } from './dto/update-concepto-pago.dto';

@ApiTags('conceptos-pago')
@Controller('conceptos-pago')
export class ConceptosPagoController {
    constructor(private readonly conceptosService: ConceptosPagoService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo concepto de pago' })
    @ApiResponse({ status: 201, description: 'Concepto creado exitosamente' })
    create(@Body() createConceptoDto: CreateConceptoPagoDto) {
        return this.conceptosService.create(createConceptoDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un concepto de pago' })
    @ApiParam({ name: 'id', description: 'ID del concepto' })
    @ApiResponse({ status: 200, description: 'Concepto actualizado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateConceptoDto: UpdateConceptoPagoDto) {
        return this.conceptosService.update(id, updateConceptoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los conceptos de pago activos' })
    @ApiResponse({ status: 200, description: 'Lista de conceptos' })
    findAll(@Query('includeInactive') includeInactive?: string) {
        return this.conceptosService.findAll(includeInactive === 'true');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un concepto por ID' })
    @ApiParam({ name: 'id', description: 'ID del concepto' })
    @ApiResponse({ status: 200, description: 'Concepto encontrado' })
    @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conceptosService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un concepto de pago' })
    @ApiParam({ name: 'id', description: 'ID del concepto' })
    @ApiResponse({ status: 200, description: 'Concepto eliminado' })
    @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.conceptosService.remove(id);
    }
}