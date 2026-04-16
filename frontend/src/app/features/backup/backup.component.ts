import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupService } from '../../core/services/backup.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-backup',
    standalone: true,
    imports: [
        CommonModule, 
        ButtonModule, 
        CardModule, 
        ToastModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService],
    template: `
    <div class="card">
        <p-toast />
        
        <div class="flex items-center gap-4 mb-6">
            <div class="p-4 bg-primary-100 rounded-2xl">
                <i class="pi pi-database text-primary-600 text-3xl"></i>
            </div>
            <div>
                <h1 class="text-3xl font-bold text-gray-800 m-0">Copias de Seguridad</h1>
                <p class="text-gray-500 m-0">Gestión de respaldos de la base de datos del sistema</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p-card styleClass="backup-card shadow-sm border-round-xl border-1 border-gray-100">
                <div class="flex flex-col gap-4 p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xl font-bold text-gray-700">Respaldo Manual</span>
                        <i class="pi pi-download text-gray-300 text-2xl"></i>
                    </div>
                    
                    <p class="text-gray-600 leading-relaxed">
                        Genera una copia completa de la base de datos (PostgreSQL) incluyendo toda la información de 
                        inhumaciones, pagos, difuntos y configuración del sistema. El archivo se descargará en formato .sql.
                    </p>

                    <div class="bg-blue-50 border-left-4 border-blue-500 p-3 rounded-r-lg">
                        <div class="flex items-center gap-2 text-blue-700 font-bold mb-1">
                            <i class="pi pi-info-circle"></i>
                            Recomendación
                        </div>
                        <p class="text-blue-600 text-sm m-0">
                            Se recomienda realizar un respaldo antes de realizar actualizaciones masivas o 
                            mantenimiento extraordinario en el sistema.
                        </p>
                    </div>

                    <div class="mt-4">
                        <p-button 
                            label="Generar y Descargar Respaldo" 
                            icon="pi pi-save" 
                            [loading]="loading()" 
                            styleClass="w-full p-button-lg shadow-md"
                            (onClick)="onDownloadBackup()" />
                    </div>
                </div>
            </p-card>

            <p-card styleClass="info-card shadow-sm border-round-xl border-1 border-gray-100 bg-gray-50">
                <div class="flex flex-col gap-4 p-4">
                    <span class="text-xl font-bold text-gray-700">Seguridad de Datos</span>
                    
                    <ul class="flex flex-col gap-3 p-0 m-0 list-none">
                        <li class="flex items-start gap-3">
                            <i class="pi pi-check-circle text-green-500 mt-1"></i>
                            <span class="text-gray-600">Formato estándar compatible con PostgreSQL 17/18.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="pi pi-check-circle text-green-500 mt-1"></i>
                            <span class="text-gray-600">Incluye disparadores (triggers) y procedimientos almacenados.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="pi pi-check-circle text-green-500 mt-1"></i>
                            <span class="text-gray-600">Los respaldos son locales y no se almacenan permanentemente en el servidor para mayor privacidad.</span>
                        </li>
                    </ul>
                </div>
            </p-card>
        </div>
    </div>
    `,
    styles: [`
        :host {
            display: block;
        }
        
        ::ng-deep .backup-card {
            .p-card-body {
                padding: 0;
            }
        }
    `]
})
export class BackupComponent {
    private backupService = inject(BackupService);
    private messageService = inject(MessageService);
    
    loading = signal(false);

    onDownloadBackup() {
        this.loading.set(true);
        this.messageService.add({ severity: 'info', summary: 'Procesando', detail: 'Generando respaldo del sistema...', sticky: false });

        this.backupService.downloadBackup().subscribe({
            next: (blob: Blob) => {
                const timestamp = new Date().toISOString().split('T')[0];
                const fileName = `respaldo_cementerio_${timestamp}.sql`;
                this.backupService.saveFile(blob, fileName);
                
                this.loading.set(false);
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Éxito', 
                    detail: 'El respaldo se ha generado y descargado correctamente.' 
                });
            },
            error: (err: any) => {
                console.error('Error descargando respaldo:', err);
                this.loading.set(false);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'No se pudo generar el respaldo. Verifique la conexión con el servidor.' 
                });
            }
        });
    }
}

