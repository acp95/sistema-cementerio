import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClsModule } from 'nestjs-cls';

// Auth Entities
import { Rol } from './auth/entities/rol.entity';
import { Usuario } from './auth/entities/usuario.entity';
import { Permiso } from './auth/entities/permiso.entity';
import { RolPermiso } from './auth/entities/rol-permiso.entity';

// Infraestructura Entities
import { Sector } from './infraestructura/entities/sector.entity';
import { Espacio } from './infraestructura/entities/espacio.entity';

// Registro Entities
import { Titular } from './registro/entities/titular.entity';
import { Difunto } from './registro/entities/difunto.entity';
import { Inhumacion } from './registro/entities/inhumacion.entity';

// Caja Entities
import { ConceptoPago } from './caja/entities/concepto-pago.entity';
import { Pago } from './caja/entities/pago.entity';
import { DetallePago } from './caja/entities/detalle-pago.entity';

// Auditoria Entity
import { Auditoria } from './auditoria/entities/auditoria.entity';

// Import business modules
import { AuthModule } from './auth/auth.module';
import { InfraestructuraModule } from './infraestructura/infraestructura.module';
import { RegistroModule } from './registro/registro.module';
import { CajaModule } from './caja/caja.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { BackupModule } from './infraestructura/backup/backup.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          // Auth
          Rol,
          Usuario,
          Permiso,
          RolPermiso,
          // Infraestructura
          Sector,
          Espacio,
          // Registro
          Titular,
          Difunto,
          Inhumacion,
          // Caja
          ConceptoPago,
          Pago,
          DetallePago,
          // Auditoria
          Auditoria,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    // Business modules
    AuthModule,
    InfraestructuraModule,
    RegistroModule,
    CajaModule,
    AuditoriaModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

