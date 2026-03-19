import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptoPago } from './entities/concepto-pago.entity';
import { Pago } from './entities/pago.entity';
import { DetallePago } from './entities/detalle-pago.entity';
import { ConceptosPagoService } from './conceptos-pago.service';
import { PagosService } from './pagos.service';
import { ConceptosPagoController } from './conceptos-pago.controller';
import { PagosController } from './pagos.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ConceptoPago, Pago, DetallePago]),
    ],
    controllers: [ConceptosPagoController, PagosController],
    providers: [ConceptosPagoService, PagosService],
    exports: [ConceptosPagoService, PagosService],
})
export class CajaModule { }
