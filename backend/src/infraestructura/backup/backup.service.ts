import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const execPromise = promisify(exec);

@Injectable()
export class BackupService {
    private readonly logger = new Logger(BackupService.name);

    constructor(private configService: ConfigService) { }

    async generateBackup(): Promise<{ filePath: string; fileName: string }> {
        const dbHost = this.configService.get<string>('DB_HOST', 'localhost');
        const dbPort = this.configService.get<number>('DB_PORT', 5432);
        const dbUser = this.configService.get<string>('DB_USERNAME', 'postgres');
        const dbPassword = this.configService.get<string>('DB_PASSWORD', 'admin');
        const dbName = this.configService.get<string>('DB_NAME', 'cementerio_db');

        // Buscar pg_dump.exe en rutas comunes de Windows si no está en el PATH
        const pgDumpPath = await this.findPgDumpPath();
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup_${dbName}_${timestamp}.sql`;
        const filePath = path.join(os.tmpdir(), fileName);

        // Configurar PGPASSWORD para evitar prompt interactivo
        const env = { ...process.env, PGPASSWORD: dbPassword };

        // Comando pg_dump
        // Usamos comillas dobles para rutas con espacios y escapamos adecuadamente
        const command = `"${pgDumpPath}" -h ${dbHost} -p ${dbPort} -U ${dbUser} -F p -f "${filePath}" ${dbName}`;

        try {
            this.logger.log(`Iniciando respaldo de base de datos ${dbName}...`);
            await execPromise(command, { env });
            
            if (!fs.existsSync(filePath)) {
                throw new Error('El archivo de respaldo no fue generado');
            }

            this.logger.log(`Respaldo generado exitosamente: ${filePath}`);
            return { filePath, fileName };
        } catch (error) {
            this.logger.error(`Error generando respaldo: ${error.message}`);
            throw new InternalServerErrorException('No se pudo generar el respaldo de la base de datos');
        }
    }

    private async findPgDumpPath(): Promise<string> {
        // 1. Intentar ver si está en el PATH
        try {
            await execPromise('pg_dump --version');
            return 'pg_dump';
        } catch (e) {
            // No está en el PATH
        }

        // 2. Buscar en rutas comunes de Windows (PostgreSQL 18, 17, 16)
        const possiblePaths = [
            'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe',
            'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
            'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
            'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe',
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }

        // Si no se encuentra, lanzar error informativo
        throw new Error('No se encontró pg_dump.exe en el sistema. Asegúrese de que PostgreSQL esté instalado o pg_dump esté en el PATH.');
    }
}
