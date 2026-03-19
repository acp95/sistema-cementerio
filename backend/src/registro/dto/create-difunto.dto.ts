import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    MaxLength,
    IsIn,
    IsObject,
} from 'class-validator';

export class CreateDifuntoDto {
    @ApiProperty({
        description: 'Nombres del difunto',
        example: 'María Elena',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    nombres: string;

    @ApiProperty({
        description: 'Apellidos del difunto',
        example: 'Rodríguez López',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    apellidos: string;

    @ApiProperty({
        description: 'DNI del difunto',
        example: '87654321',
        required: false,
        maxLength: 15,
    })
    @IsString()
    @IsOptional()
    @MaxLength(15)
    dni?: string;

    @ApiProperty({
        description: 'Fecha de nacimiento (YYYY-MM-DD)',
        example: '1950-05-20',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    fechaNacimiento?: string;

    @ApiProperty({
        description: 'Fecha de defunción (YYYY-MM-DD)',
        example: '2024-12-01',
    })
    @IsDateString()
    fechaDefuncion: string;

    @ApiProperty({
        description: 'Número de acta de defunción',
        example: 'ACT-2024-001234',
        required: false,
        maxLength: 50,
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    actaDefuncion?: string;

    @ApiProperty({
        description: 'Sexo (M o F)',
        example: 'F',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsIn(['M', 'F'], { message: 'El sexo debe ser M o F' })
    sexo?: string;

    @ApiProperty({
        description: 'Causa de muerte',
        example: 'Muerte natural',
        required: false,
        maxLength: 200,
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    causaMuerte?: string;

    @ApiProperty({
        description: 'Observaciones adicionales',
        example: 'Familiar notificado',
        required: false,
    })
    @IsString()
    @IsOptional()
    observaciones?: string;

    @ApiProperty({
        description: 'Datos de inhumación (espacio, titular, fechas)',
        required: false,
    })
    @IsOptional()
    @IsObject()
    inhumacionData?: {
        espacioId: number;
        titularId?: number;
        fechaInhumacion: string;
        horaInhumacion?: string;
        tipoConcesion?: string;
        fechaVencimiento?: string;
        estado?: string;
        numeroActa?: string;
        observaciones?: string;
        conceptoPagoId?: number;
        usuarioId?: number;
    };
}
