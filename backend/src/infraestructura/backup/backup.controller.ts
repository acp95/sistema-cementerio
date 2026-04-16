import { Controller, Get, Res, UseGuards, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import * as fs from 'fs';

@ApiTags('Seguridad - Respaldos')
@ApiBearerAuth()
@Controller('backup')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BackupController {
    private readonly logger = new Logger(BackupController.name);

    constructor(private readonly backupService: BackupService) { }

    @Get('download')
    @ApiOperation({ summary: 'Generar y descargar respaldo de la base de datos' })
    @RequirePermission('crear_respaldos')
    async downloadBackup(@Res() res: Response) {
        try {
            const { filePath, fileName } = await this.backupService.generateBackup();

            this.logger.log(`Enviando archivo de respaldo: ${fileName}`);

            res.download(filePath, fileName, (err) => {
                if (err) {
                    this.logger.error(`Error al enviar el archivo: ${err.message}`);
                }
                
                // Limpiar archivo temporal
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        this.logger.error(`Error al eliminar archivo temporal: ${unlinkErr.message}`);
                    } else {
                        this.logger.log(`Archivo temporal eliminado: ${filePath}`);
                    }
                });
            });
        } catch (error) {
            this.logger.error(`Fallo en la descarga del respaldo: ${error.message}`);
            res.status(500).json({
                message: 'Error al generar o descargar el respaldo',
                error: error.message
            });
        }
    }
}
