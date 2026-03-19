import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Nombre de usuario',
        example: 'admin',
        required: false,
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        description: 'Correo electrónico',
        example: 'admin@cementerio.gob.pe',
        required: false,
    })
    @IsOptional()
    @IsString() // Remove IsEmail to avoid conflicting with username logic if we were merging them, but here they are separate fields. Let's keep it simple.
    email?: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123',
    })
    @IsNotEmpty({ message: 'El password es requerido' })
    @IsString()
    password: string;
}
