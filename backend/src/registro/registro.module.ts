import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Titular } from './entities/titular.entity';
import { Difunto } from './entities/difunto.entity';
import { Inhumacion } from './entities/inhumacion.entity';
import { Espacio } from '../infraestructura/entities/espacio.entity';
import { TitularesService } from './titulares.service';
import { DifuntosService } from './difuntos.service';
import { InhumacionesService } from './inhumaciones.service';
import { TitularesController } from './titulares.controller';
import { DifuntosController } from './difuntos.controller';
import { InhumacionesController } from './inhumaciones.controller';
import { CajaModule } from '../caja/caja.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Titular, Difunto, Inhumacion, Espacio]),
        forwardRef(() => CajaModule),
    ],
    controllers: [TitularesController, DifuntosController, InhumacionesController],
    providers: [TitularesService, DifuntosService, InhumacionesService],
    exports: [TitularesService, DifuntosService, InhumacionesService],
})
export class RegistroModule { }
