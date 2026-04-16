import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TitularesService } from '../../../core/services/titulares.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG Imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-titulares-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        TextareaModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        TooltipModule,
        TagModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './titulares-list.component.html',
    styleUrls: ['./titulares-list.component.scss']
})
export class TitularesListComponent implements OnInit {
    private titularesService = inject(TitularesService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private exportService = inject(ExportService);
    private cdr = inject(ChangeDetectorRef);

    titulares: any[] = [];
    titularDialog: boolean = false;
    estadoCuentaDialog: boolean = false;
    titular: any = {};
    selectedTitular: any = null;
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;
    exportCols: any[] = [];

    ngOnInit(): void {
        this.loadTitulares();
        this.exportCols = [
            { header: 'Nombres', dataKey: 'nombres' },
            { header: 'Apellidos', dataKey: 'apellidos' },
            { header: 'DNI', dataKey: 'dni' },
            { header: 'Teléfono', dataKey: 'telefono' },
            { header: 'Email', dataKey: 'email' },
            { header: 'Dirección', dataKey: 'direccion' }
        ];
    }

    exportPdf() {
        this.exportService.exportPdf(this.exportCols, this.titulares, 'Titulares', 'Reporte de Titulares');
    }

    exportExcel() {
        this.exportService.exportExcel(this.titulares, 'Titulares');
    }

    loadTitulares(): void {
        this.titularesService.getAll().subscribe({
            next: (data) => {
                this.titulares = [...data];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading titulares:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los titulares' });
            }
        });
    }

    openNew(): void {
        this.titular = {};
        this.submitted = false;
        this.titularDialog = true;
    }

    editTitular(titular: any): void {
        this.titular = { ...titular };
        this.titularDialog = true;
    }

    viewEstadoCuenta(titular: any): void {
        this.titularesService.getById(titular.id).subscribe({
            next: (data) => {
                this.selectedTitular = data;
                this.estadoCuentaDialog = true;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el estado de cuenta' });
            }
        });
    }

    printEstadoCuenta(): void {
        if (!this.selectedTitular) return;
        
        const pagos = this.selectedTitular.pagos || [];
        const exportCols = [
            { header: 'Recibo', dataKey: 'codigoRecibo' },
            { header: 'Fecha', dataKey: 'fechaPago' },
            { header: 'Monto Total (S/)', dataKey: 'montoTotal' },
            { header: 'Estado', dataKey: 'estado' },
        ];
        
        const formatData = pagos.map((p: any) => ({
            ...p,
            fechaPago: new Date(p.fechaPago).toLocaleDateString()
        }));

        this.exportService.exportPdf(
            exportCols, 
            formatData, 
            `Estado_Cuenta_${this.selectedTitular.dni}`, 
            `Estado de Cuenta - ${this.selectedTitular.nombres} ${this.selectedTitular.apellidos}`
        );
    }

    deleteTitular(titular: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar al titular ' + titular.nombres + ' ' + titular.apellidos + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (titular.id) {
                    this.titularesService.delete(titular.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Titular Eliminado', life: 3000 });
                            this.loadTitulares();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el titular' });
                        }
                    });
                }
            }
        });
    }

    hideDialog(): void {
        this.titularDialog = false;
        this.estadoCuentaDialog = false;
        this.submitted = false;
    }

    saveTitular(): void {
        this.submitted = true;

        if (this.titular.nombres?.trim() && this.titular.apellidos?.trim()) {
            if (this.titular.id) {
                const payload = {
                    nombres: this.titular.nombres,
                    apellidos: this.titular.apellidos,
                    dni: this.titular.dni,
                    email: this.titular.email,
                    telefono: this.titular.telefono,
                    direccion: this.titular.direccion
                };
                this.titularesService.update(this.titular.id, payload).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Titular Actualizado', life: 3000 });
                        this.loadTitulares();
                        this.hideDialog();
                    },
                    error: (err) => {
                        if (err.status === 409) {
                            const mensaje = err.error?.message || 'Ya existe otro titular con esos datos.';
                            this.messageService.add({ severity: 'warn', summary: '⚠️ Advertencia', detail: mensaje, life: 5000 });
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                        }
                    }
                });
            } else {
                this.titularesService.create(this.titular).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Titular Creado', life: 3000 });
                        this.loadTitulares();
                        this.hideDialog();
                    },
                    error: (err) => {
                        if (err.status === 409) {
                            const mensaje = err.error?.message || 'Ya existe otro titular con esos datos.';
                            this.messageService.add({ severity: 'warn', summary: '⚠️ Advertencia', detail: mensaje, life: 5000 });
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la creación' });
                        }
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getInitials(nombres: string, apellidos: string): string {
        if (!nombres && !apellidos) return '?';
        const n = nombres?.trim().charAt(0) || '';
        const a = apellidos?.trim().charAt(0) || '';
        return (n + a).toUpperCase();
    }
}

