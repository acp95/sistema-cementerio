import { PartialType } from '@nestjs/swagger';
import { CreateConceptoPagoDto } from './create-concepto-pago.dto';

export class UpdateConceptoPagoDto extends PartialType(CreateConceptoPagoDto) { }
