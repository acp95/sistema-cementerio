import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DifuntosService } from '../../../core/services/difuntos.service';
import { TitularesService } from '../../../core/services/titulares.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, tap, catchError, of } from 'rxjs';

// Prime NG Imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-difuntos-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        TagModule,
        DialogModule,
        SelectModule,
        DatePickerModule,
        TextareaModule,
        IconFieldModule,
        InputIconModule,
        FormsModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './difuntos-list.component.html',
    styleUrls: ['./difuntos-list.component.scss']
})
export class DifuntosListComponent implements OnInit {
    private difuntosService = inject(DifuntosService);
    private titularesService = inject(TitularesService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private exportService = inject(ExportService);
    private cdr = inject(ChangeDetectorRef);

    difuntos: any[] = [];
    titulares: any[] = [];
    difuntoDialog: boolean = false;
    difunto: any = {};
    submitted: boolean = false;

    sexoOptions = [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
    ];

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.loadDifuntos();
        this.loadTitulares();
    }

    exportPdf() {
        const exportData = this.difuntos.map(d => ({
            ...d,
            sexo: d.sexo === 'M' ? 'Masculino' : 'Femenino',
            fechaDefuncion: d.fechaDefuncion ? new Date(d.fechaDefuncion).toLocaleDateString() : '-',
            titularExport: d.titular ? `${d.titular.nombres} ${d.titular.apellidos}` : '-'
        }));
        const cols = [
            { header: 'Nombres', dataKey: 'nombres' },
            { header: 'Apellidos', dataKey: 'apellidos' },
            { header: 'DNI', dataKey: 'dni' },
            { header: 'Sexo', dataKey: 'sexo' },
            { header: 'F. Defunción', dataKey: 'fechaDefuncion' },
            { header: 'Titular', dataKey: 'titularExport' }
        ];
        this.exportService.exportPdf(cols, exportData, 'Difuntos', 'Reporte de Difuntos');
    }

    exportExcel() {
        const exportData = this.difuntos.map(d => ({
            ...d,
            sexo: d.sexo === 'M' ? 'Masculino' : 'Femenino',
            fechaDefuncion: d.fechaDefuncion ? new Date(d.fechaDefuncion).toLocaleDateString() : '-',
            titularExport: d.titular ? `${d.titular.nombres} ${d.titular.apellidos}` : '-'
        }));
        this.exportService.exportExcel(exportData, 'Difuntos');
    }

    loadTitulares(): void {
        this.titularesService.getAll().subscribe({
            next: (data) => {
                this.titulares = data.map((t: any) => ({
                    label: `${t.nombres} ${t.apellidos} (${t.dni})`,
                    value: t.id
                }));
            },
            error: (error) => console.error('Error loading titulares:', error)
        });
    }

    loadDifuntos(): void {
        this.difuntosService.getAll().subscribe({
            next: (data) => {
                this.difuntos = data; // Usaremos una propiedad normal en lugar de observable directo si falla el async
                this.cdr.detectChanges(); // Forzar actualización de vista
                console.log('Difuntos loaded:', data.length);
            },
            error: (error) => {
                console.error('Error loading difuntos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los difuntos' });
            }
        });
    }

    openNew(): void {
        this.difunto = {};
        this.submitted = false;
        this.difuntoDialog = true;
    }

    editDifunto(difunto: any): void {
        this.difunto = { ...difunto };

        // Ensure dates are Date objects for DatePicker
        if (this.difunto.fechaNacimiento) this.difunto.fechaNacimiento = new Date(this.difunto.fechaNacimiento);
        if (this.difunto.fechaDefuncion) this.difunto.fechaDefuncion = new Date(this.difunto.fechaDefuncion);

        if (this.difunto.titular) {
            this.difunto.titularId = this.difunto.titular.id;
        }

        this.difuntoDialog = true;
    }

    deleteDifunto(difunto: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar a ' + difunto.nombres + ' ' + difunto.apellidos + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (difunto.id) {
                    this.difuntosService.delete(difunto.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Difunto Eliminado', life: 3000 });
                            this.loadDifuntos();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el difunto' });
                        }
                    });
                }
            }
        });
    }

    hideDialog(): void {
        this.difuntoDialog = false;
        this.submitted = false;
    }

    saveDifunto(): void {
        this.submitted = true;

        if (this.difunto.nombres?.trim() && this.difunto.apellidos?.trim()) {
            if (this.difunto.id) {
                // Update - only update difunto data
                const updateDto: any = {
                    nombres: this.difunto.nombres,
                    apellidos: this.difunto.apellidos,
                    dni: this.difunto.dni,
                    fechaNacimiento: this.difunto.fechaNacimiento,
                    fechaDefuncion: this.difunto.fechaDefuncion,
                    actaDefuncion: this.difunto.actaDefuncion,
                    sexo: this.difunto.sexo,
                    causaMuerte: this.difunto.causaMuerte,
                    observaciones: this.difunto.observaciones,
                    titularId: this.difunto.titularId
                };
                this.difuntosService.update(this.difunto.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Difunto Actualizado', life: 3000 });
                        this.loadDifuntos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating difunto:', err);
                        if (err.status === 409) {
                            const mensaje = err.error?.message || 'Ya existe un registro con estos datos únicos (DNI o Acta de Defunción).';
                            this.messageService.add({ severity: 'warn', summary: '⚠️ Advertencia', detail: mensaje, life: 5000 });
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                        }
                    }
                });
            } else {
                // Create - send difunto data
                const createDto: any = {
                    nombres: this.difunto.nombres,
                    apellidos: this.difunto.apellidos,
                    dni: this.difunto.dni,
                    fechaNacimiento: this.difunto.fechaNacimiento,
                    fechaDefuncion: this.difunto.fechaDefuncion,
                    actaDefuncion: this.difunto.actaDefuncion,
                    sexo: this.difunto.sexo,
                    causaMuerte: this.difunto.causaMuerte,
                    observaciones: this.difunto.observaciones,
                    titularId: this.difunto.titularId
                };

                this.difuntosService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Difunto creado correctamente',
                            life: 3000
                        });
                        this.loadDifuntos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating difunto:', err);
                        // Mostrar mensaje específico según el error
                        if (err.status === 409) {
                            // Error de conflicto (DNI duplicado o difunto ya inhumado)
                            const mensaje = err.error?.message || 'Ya existe un registro con estos datos';
                            this.messageService.add({
                                severity: 'warn',
                                summary: '⚠️ Advertencia',
                                detail: mensaje,
                                life: 5000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Falló la creación del registro'
                            });
                        }
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
