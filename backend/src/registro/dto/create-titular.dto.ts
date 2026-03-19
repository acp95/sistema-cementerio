import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateTitularDto {
    @ApiProperty({
        description: 'DNI del titular',
        example: '12345678',
        maxLength: 15,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(15)
    @Matches(/^[0-9]+$/, { message: 'El DNI debe contener solo números' })
    dni?: string;

    @ApiProperty({
        description: 'Nombres del titular',
        example: 'Juan Carlos',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    nombres: string;

    @ApiProperty({
        description: 'Apellidos del titular',
        example: 'Pérez García',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    apellidos: string;

    @ApiProperty({
        description: 'Teléfono de contacto',
        example: '999888777',
        required: false,
        maxLength: 20,
    })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    telefono?: string;

    @ApiProperty({
        description: 'Dirección de residencia',
        example: 'Av. Principal 123, Lima',
        required: false,
        maxLength: 200,
    })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    direccion?: string;

    @ApiProperty({
        description: 'Correo electrónico',
        example: 'juan.perez@email.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}
