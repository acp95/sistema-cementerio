import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoEspacio } from '../entities/espacio.entity';

export class FilterEspaciosDto {
    @ApiProperty({
        description: 'Filtrar por ID de sector',
        example: 1,
        required: false,
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    sectorId?: number;

    @ApiProperty({
        description: 'Filtrar por estado',
        enum: EstadoEspacio,
        example: EstadoEspacio.LIBRE,
        required: false,
    })
    @IsEnum(EstadoEspacio)
    @IsOptional()
    estado?: EstadoEspacio;
}
