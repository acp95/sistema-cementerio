import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    ParseIntPipe,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
    constructor(private readonly pagosService: PagosService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo pago' })
    @ApiResponse({ status: 201, description: 'Pago registrado exitosamente' })
    create(@Body() createPagoDto: CreatePagoDto) {
        return this.pagosService.create(createPagoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los pagos' })
    @ApiResponse({ status: 200, description: 'Lista de pagos' })
    findAll() {
        return this.pagosService.findAll();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un pago (PUT)' })
    @ApiParam({ name: 'id', description: 'ID del pago' })
    @ApiResponse({ status: 200, description: 'Pago actualizado' })
    updatePut(@Param('id', ParseIntPipe) id: number, @Body() updatePagoDto: UpdatePagoDto) {
        return this.pagosService.update(id, updatePagoDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un pago (PATCH)' })
    @ApiParam({ name: 'id', description: 'ID del pago' })
    @ApiResponse({ status: 200, description: 'Pago actualizado' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePagoDto: UpdatePagoDto) {
        return this.pagosService.update(id, updatePagoDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un pago por ID' })
    @ApiParam({ name: 'id', description: 'ID del pago' })
    @ApiResponse({ status: 200, description: 'Pago encontrado' })
    @ApiResponse({ status: 404, description: 'Pago no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.findOne(id);
    }

    @Get('titular/:titularId')
    @ApiOperation({ summary: 'Obtener pagos de un titular' })
    @ApiParam({ name: 'titularId', description: 'ID del titular' })
    @ApiResponse({ status: 200, description: 'Lista de pagos del titular' })
    findByTitular(@Param('titularId', ParseIntPipe) titularId: number) {
        return this.pagosService.findByTitular(titularId);
    }

    @Get('inhumacion/:inhumacionId')
    @ApiOperation({ summary: 'Obtener pagos de una inhumación' })
    @ApiParam({ name: 'inhumacionId', description: 'ID de la inhumación' })
    @ApiResponse({ status: 200, description: 'Lista de pagos de la inhumación' })
    findByInhumacion(@Param('inhumacionId', ParseIntPipe) inhumacionId: number) {
        return this.pagosService.findByInhumacion(inhumacionId);
    }

    @Patch(':id/anular')
    @ApiOperation({ summary: 'Anular un pago' })
    @ApiParam({ name: 'id', description: 'ID del pago' })
    @ApiResponse({ status: 200, description: 'Pago anulado' })
    @ApiResponse({ status: 404, description: 'Pago no encontrado' })
    anularPago(@Param('id', ParseIntPipe) id: number) {
        return this.pagosService.anularPago(id);
    }
}
