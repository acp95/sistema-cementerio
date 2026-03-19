import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, Min } from 'class-validator';

export class DetallePagoDto {
    @ApiProperty({
        description: 'ID del concepto de pago',
        example: 1,
    })
    @IsInt()
    conceptoId: number;

    @ApiProperty({
        description: 'Cantidad',
        example: 1,
        default: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    cantidad: number;

    @ApiProperty({
        description: 'Subtotal (cantidad * precio)',
        example: 250.00,
        minimum: 0,
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    subtotal: number;
}
