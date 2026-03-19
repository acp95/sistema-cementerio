import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateConceptoPagoDto {
    @ApiProperty({
        description: 'Nombre del concepto de pago',
        example: 'Derecho de Inhumación (Nicho)',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    nombre: string;

    @ApiProperty({
        description: 'Precio base del concepto',
        example: 250.00,
        minimum: 0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    precioBase: number;

    @ApiProperty({
        description: 'Indica si el concepto es de cobro periódico (anual)',
        example: false,
        default: false,
    })
    @IsBoolean()
    esPeriodico: boolean;

    @ApiProperty({
        description: 'Indica si el concepto está activo',
        example: true,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}
