import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Auth Entities
import { Rol } from './src/auth/entities/rol.entity';
import { Usuario } from './src/auth/entities/usuario.entity';
import { Permiso } from './src/auth/entities/permiso.entity';
import { RolPermiso } from './src/auth/entities/rol-permiso.entity';

// Infraestructura Entities
import { Sector } from './src/infraestructura/entities/sector.entity';
import { Espacio } from './src/infraestructura/entities/espacio.entity';

// Registro Entities
import { Titular } from './src/registro/entities/titular.entity';
import { Difunto } from './src/registro/entities/difunto.entity';
import { Inhumacion } from './src/registro/entities/inhumacion.entity';

// Caja Entities
import { ConceptoPago } from './src/caja/entities/concepto-pago.entity';
import { Pago } from './src/caja/entities/pago.entity';
import { DetallePago } from './src/caja/entities/detalle-pago.entity';

// Auditoria Entity
import { Auditoria } from './src/auditoria/entities/auditoria.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'cementerio',
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
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

