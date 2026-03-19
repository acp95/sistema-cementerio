import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsInt,
    IsEnum,
    IsOptional,
    IsNumber,
    MaxLength,
} from 'class-validator';
import { EstadoEspacio } from '../entities/espacio.entity';

export class CreateEspacioDto {
    @ApiProperty({
        description: 'ID del sector al que pertenece',
        example: 1,
    })
    @IsInt()
    sectorId: number;

    @ApiProperty({
        description: 'Código único del espacio',
        example: 'SM-001',
        maxLength: 20,
    })
    @IsString()
    @MaxLength(20)
    codigo: string;

    @ApiProperty({
        description: 'Fila del espacio',
        example: 'A',
        required: false,
        maxLength: 10,
    })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    fila?: string;

    @ApiProperty({
        description: 'Columna del espacio',
        example: '1',
        required: false,
        maxLength: 10,
    })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    columna?: string;

    @ApiProperty({
        description: 'Número visible en la placa',
        example: 'A-1',
        required: false,
        maxLength: 10,
    })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    numero?: string;

    @ApiProperty({
        description: 'Tipo de espacio',
        example: 'NICHO',
        default: 'NICHO',
        maxLength: 20,
    })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    tipoEspacio?: string;

    @ApiProperty({
        description: 'Estado del espacio',
        enum: EstadoEspacio,
        example: EstadoEspacio.LIBRE,
        default: EstadoEspacio.LIBRE,
    })
    @IsEnum(EstadoEspacio)
    @IsOptional()
    estado?: EstadoEspacio;

    @ApiProperty({
        description: 'Latitud para geolocalización',
        example: -12.046374,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    coordenadasLat?: number;

    @ApiProperty({
        description: 'Longitud para geolocalización',
        example: -77.042793,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    coordenadasLng?: number;
}
