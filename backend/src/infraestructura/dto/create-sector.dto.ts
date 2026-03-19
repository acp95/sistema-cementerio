import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsInt, Min, IsIn } from 'class-validator';

export class CreateSectorDto {
    @ApiProperty({
        description: 'Nombre del sector',
        example: 'SAN MATEO',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    nombre: string;

    @ApiProperty({
        description: 'Descripción del sector',
        example: 'Sector ubicado en el área norte del cementerio',
        required: false,
    })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({
        description: 'Tipo de sector',
        example: 'PABELLON',
        required: false,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    tipo?: string;

    @ApiProperty({
        description: 'Tipo de espacio del sector',
        example: 'nicho',
        enum: ['nicho', 'fosa'],
        default: 'nicho',
    })
    @IsString()
    @IsOptional()
    @IsIn(['nicho', 'fosa'])
    tipoEspacio?: string;

    @ApiProperty({
        description: 'Capacidad total de espacios en el sector',
        example: 100,
        default: 0,
    })
    @IsInt()
    @IsOptional()
    @Min(0)
    capacidadTotal?: number;

    @ApiProperty({
        description: 'Coordenadas geográficas en formato GeoJSON o WKT',
        example: '{"type":"Polygon","coordinates":[...]}',
        required: false,
    })
    @IsString()
    @IsOptional()
    coordenadasGeo?: string;
}

