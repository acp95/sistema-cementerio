import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNumber,
    IsEnum,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    ArrayMinSize,
    Min,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoPago } from '../entities/pago.entity';
import { DetallePagoDto } from './detalle-pago.dto';

export class CreatePagoDto {
    @ApiProperty({
        description: 'ID del titular que realiza el pago',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    titularId?: number;

    @ApiProperty({
        description: 'ID del usuario (cajero) que registra el pago',
        example: 1,
    })
    @IsInt()
    usuarioId: number;

    @ApiProperty({
        description: 'ID de la inhumación relacionada (si aplica)',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    inhumacionId?: number;

    @ApiProperty({
        description: 'Monto total del pago',
        example: 300.00,
        minimum: 0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    montoTotal: number;

    @ApiProperty({
        description: 'Método de pago utilizado',
        enum: MetodoPago,
        example: MetodoPago.EFECTIVO,
        default: MetodoPago.EFECTIVO,
    })
    @IsEnum(MetodoPago)
    metodoPago: MetodoPago;

    @ApiProperty({
        description: 'Observaciones adicionales',
        example: 'Pago por mantenimiento anual',
        required: false,
    })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({
        description: 'Detalles del pago (conceptos individuales)',
        type: [DetallePagoDto],
        isArray: true,
        required: false,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    @Type(() => DetallePagoDto)
    detalles?: DetallePagoDto[];

    @ApiProperty({
        description: 'Fecha en que se realizó el pago',
        example: '2025-12-17T05:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaPago?: Date;

    @ApiProperty({
        description: 'Estado del pago',
        example: 'PENDIENTE',
        enum: ['PENDIENTE', 'PAGADO', 'ANULADO'],
        default: 'PAGADO',
        required: false,
    })
    @IsString()
    @IsOptional()
    estado?: string;
}
