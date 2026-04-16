import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservarEspacioDto {
    @ApiProperty({ description: 'ID del titular que realiza la reserva' })
    @IsNotEmpty()
    @IsNumber()
    titularId: number;
}
