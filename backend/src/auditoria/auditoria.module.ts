import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './entities/auditoria.entity';
import { AuditoriaSubscriber } from './subscribers/auditoria.subscriber';

@Module({
    imports: [TypeOrmModule.forFeature([Auditoria])],
    providers: [AuditoriaSubscriber],
    exports: [AuditoriaSubscriber],
})
export class AuditoriaModule {}
