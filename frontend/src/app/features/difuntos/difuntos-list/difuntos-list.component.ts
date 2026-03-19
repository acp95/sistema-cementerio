import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DifuntosService } from '../../../core/services/difuntos.service';
import { TitularesService } from '../../../core/services/titulares.service';
import { EspaciosService } from '../../../core/services/espacios.service';
import { InhumacionesService } from '../../../core/services/inhumaciones.service';
import { ConceptosPagoService } from '../../../core/services/conceptos-pago.service';
import { AuthService } from '../../../core/services/auth.service';
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
    private espaciosService = inject(EspaciosService);
    private inhumacionesService = inject(InhumacionesService);
    private conceptosPagoService = inject(ConceptosPagoService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    difuntos: any[] = [];
    difuntoDialog: boolean = false;
    difunto: any = {};
    submitted: boolean = false;

    // Opciones para inhumación
    espacios: any[] = [];
    titulares: any[] = [];
    conceptosPago: any[] = [];
    tiposConcesion = [
        { label: 'Temporal', value: 'TEMPORAL' },
        { label: 'Perpetua', value: 'PERPETUA' }
    ];
    estadosInhumacion = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Exhumado', value: 'EXHUMADO' },
        { label: 'Trasladado', value: 'TRASLADADO' }
    ];

    sexoOptions = [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
    ];

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.loadDifuntos();
        this.loadEspacios();
        this.loadTitulares();
        this.loadConceptosPago();
    }

    loadEspacios(): void {
        this.espaciosService.getAll().subscribe({
            next: (data) => {
                this.espacios = data
                    .filter((e: any) => e.estado === 'LIBRE')
                    .map((e: any) => ({
                        label: `${e.codigo || 'S/C'} - ${e.tipoEspacio || 'No definido'}`,
                        value: e.id
                    }));
            },
            error: (error) => console.error('Error loading espacios:', error)
        });
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

    loadConceptosPago(): void {
        this.conceptosPagoService.getAll().subscribe({
            next: (data) => {
                this.conceptosPago = data.filter((c: any) => c.activo).map((c: any) => ({
                    label: `${c.nombre} - S/. ${c.precioBase}`,
                    value: c.id
                }));
            },
            error: (error) => console.error('Error loading conceptos de pago:', error)
        });
    }

    openNew(): void {
        this.difunto = {
            inhumacionData: {
                fechaInhumacion: new Date(),
                tipoConcesion: 'TEMPORAL',
                estado: 'ACTIVO'
            }
        };
        this.submitted = false;
        this.difuntoDialog = true;
    }

    editDifunto(difunto: any): void {
        this.difunto = { ...difunto };

        // Ensure dates are Date objects for DatePicker
        if (this.difunto.fechaNacimiento) this.difunto.fechaNacimiento = new Date(this.difunto.fechaNacimiento);
        if (this.difunto.fechaDefuncion) this.difunto.fechaDefuncion = new Date(this.difunto.fechaDefuncion);

        // Load inhumacion data if exists
        if (this.difunto.inhumacion) {
            this.difunto.inhumacionData = {
                espacioId: this.difunto.inhumacion.espacioId || this.difunto.inhumacion.espacio?.id,
                titularId: this.difunto.inhumacion.titularId || this.difunto.inhumacion.titular?.id,
                fechaInhumacion: this.difunto.inhumacion.fechaInhumacion ? new Date(this.difunto.inhumacion.fechaInhumacion) : null,
                horaInhumacion: this.difunto.inhumacion.horaInhumacion,
                tipoConcesion: this.difunto.inhumacion.tipoConcesion,
                fechaVencimiento: this.difunto.inhumacion.fechaVencimiento ? new Date(this.difunto.inhumacion.fechaVencimiento) : null,
                estado: this.difunto.inhumacion.estado,
                numeroActa: this.difunto.inhumacion.numeroActa,
                observaciones: this.difunto.inhumacion.observaciones
            };
        } else {
            // Initialize empty inhumacionData if no inhumacion exists
            this.difunto.inhumacionData = {
                fechaInhumacion: new Date(),
                tipoConcesion: 'TEMPORAL',
                estado: 'ACTIVO'
            };
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
                    observaciones: this.difunto.observaciones
                };
                this.difuntosService.update(this.difunto.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Difunto Actualizado', life: 3000 });
                        this.loadDifuntos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating difunto:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - send difunto + inhumacion data
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
                    inhumacionData: {
                        ...this.difunto.inhumacionData,
                        conceptoPagoId: this.difunto.inhumacionData?.conceptoPagoId,
                        usuarioId: this.authService.getCurrentUser()?.id
                    }
                };

                this.difuntosService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Difunto e Inhumación creados correctamente',
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
