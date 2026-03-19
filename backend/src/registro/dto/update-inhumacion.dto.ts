import { PartialType } from '@nestjs/swagger';
import { CreateInhumacionDto } from './create-inhumacion.dto';

export class UpdateInhumacionDto extends PartialType(CreateInhumacionDto) { }
