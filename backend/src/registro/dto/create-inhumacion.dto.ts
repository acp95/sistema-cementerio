import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsOptional,
    IsDateString,
    IsString,
    IsIn,
    MaxLength,
} from 'class-validator';

export class CreateInhumacionDto {
    @ApiProperty({
        description: 'ID del difunto',
        example: 1,
    })
    @IsInt()
    difuntoId: number;

    @ApiProperty({
        description: 'ID del espacio (nicho/fosa)',
        example: 1,
    })
    @IsInt()
    espacioId: number;

    @ApiProperty({
        description: 'ID del titular responsable',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    titularId?: number;

    @ApiProperty({
        description: 'Fecha de inhumación (YYYY-MM-DD)',
        example: '2024-12-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    fechaInhumacion?: string;

    @ApiProperty({
        description: 'Tipo de concesión',
        example: 'TEMPORAL',
        enum: ['TEMPORAL', 'PERPETUA'],
        default: 'TEMPORAL',
    })
    @IsString()
    @IsOptional()
    @IsIn(['TEMPORAL', 'PERPETUA'])
    @MaxLength(20)
    tipoConcesion?: string;

    @ApiProperty({
        description: 'Fecha de vencimiento de la concesión (YYYY-MM-DD)',
        example: '2029-12-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    fechaVencimiento?: string;

    @ApiProperty({
        description: 'Estado de la inhumación',
        example: 'ACTIVO',
        enum: ['ACTIVO', 'EXHUMADO', 'TRASLADADO'],
        default: 'ACTIVO',
    })
    @IsString()
    @IsOptional()
    @IsIn(['ACTIVO', 'EXHUMADO', 'TRASLADADO'])
    @MaxLength(20)
    estado?: string;

    @ApiProperty({
        description: 'Hora de inhumación (HH:mm)',
        example: '10:30',
        required: false,
    })
    @IsString()
    @IsOptional()
    horaInhumacion?: string;

    @ApiProperty({
        description: 'Número de acta de inhumación',
        example: 'ACTA-2024-001',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    numeroActa?: string;

    @ApiProperty({
        description: 'Observaciones adicionales',
        example: 'Se realizó sin contratiempos',
        required: false,
    })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({
        description: 'ID del concepto de pago para generar el cobro automático',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    conceptoPagoId?: number;

    @ApiProperty({
        description: 'ID del usuario que registra (requerido si se incluye conceptoPagoId)',
        example: 1,
        required: false,
    })
    @IsInt()
    @IsOptional()
    usuarioId?: number;
}
