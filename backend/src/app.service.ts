import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) { }

  getHello(): string {
    return 'Sistema de Gestión de Cementerio - API';
  }

  async getHealth() {
    try {
      // Verificar la conexión a la base de datos
      const isConnected = this.dataSource.isInitialized;

      if (isConnected) {
        // Ejecutar una consulta simple para verificar
        await this.dataSource.query('SELECT 1');
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: isConnected,
          type: this.dataSource.options.type,
          database: this.dataSource.options.database,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error.message,
        },
      };
    }
  }
}
