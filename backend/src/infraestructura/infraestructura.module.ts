import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from './entities/sector.entity';
import { Espacio } from './entities/espacio.entity';
import { SectoresService } from './sectores.service';
import { EspaciosService } from './espacios.service';
import { SectoresController } from './sectores.controller';
import { EspaciosController } from './espacios.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Sector, Espacio])],
    controllers: [SectoresController, EspaciosController],
    providers: [SectoresService, EspaciosService],
    exports: [SectoresService, EspaciosService],
})
export class InfraestructuraModule { }
