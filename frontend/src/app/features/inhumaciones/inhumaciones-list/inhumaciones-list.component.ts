import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InhumacionesService } from '../../../core/services/inhumaciones.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, tap, catchError, of } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DifuntosService } from '../../../core/services/difuntos.service';
import { EspaciosService } from '../../../core/services/espacios.service';
import { SectoresService } from '../../../core/services/sectores.service';
import { TitularesService } from '../../../core/services/titulares.service';
import { ConceptosPagoService } from '../../../core/services/conceptos-pago.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { InhumacionesPdfService } from '../../../core/services/inhumaciones-pdf.service';

@Component({
    selector: 'app-inhumaciones-list',
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
        SelectModule,
        DatePickerModule,
        TextareaModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        FormsModule
    ],
    providers: [MessageService, ConfirmationService, InhumacionesPdfService],
    templateUrl: './inhumaciones-list.component.html',
    styleUrls: ['./inhumaciones-list.component.scss']
})
export class InhumacionesListComponent implements OnInit {
    private inhumacionesService = inject(InhumacionesService);
    private difuntosService = inject(DifuntosService);
    private espaciosService = inject(EspaciosService);
    private sectoresService = inject(SectoresService);
    private titularesService = inject(TitularesService);
    private conceptosPagoService = inject(ConceptosPagoService);
    public authService = inject(AuthService);
    private exportService = inject(ExportService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private inhumacionesPdfService = inject(InhumacionesPdfService);

    inhumaciones: any[] = [];
    difuntos: any[] = [];
    allDifuntos_raw: any[] = [];
    allEspacios: any[] = [];
    espacios: any[] = [];
    sectores: any[] = [];
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

    inhumacionDialog: boolean = false;
    inhumacion: any = {};
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    // ...

    ngOnInit(): void {
        this.loadInhumaciones();
        this.loadDifuntos();
        this.loadSectores();
        this.loadEspacios();
        this.loadTitulares();
        this.loadConceptosPago();
    }

    exportPdf() {
        const exportData = this.inhumaciones.map(i => ({
            ...i,
            numeroInhumacion: `N° ${String(i.id).padStart(5, '0')}`,
            difuntoExport: i.difunto ? `${i.difunto.nombres} ${i.difunto.apellidos}` : '-',
            espacioExport: i.espacio ? i.espacio.codigo : '-',
            fechaExport: i.fechaInhumacion ? new Date(i.fechaInhumacion).toLocaleDateString() : '-',
            titularExport: i.titular ? `${i.titular.nombres} ${i.titular.apellidos}` : '-',
            pagoExport: i.pagos && i.pagos.length > 0 ? (i.pagos.some((p: any) => p.estado === 'PAGADO') ? 'PAGADO' : 'PENDIENTE') : 'POR PAGAR'
        }));
        const cols = [
            { header: 'N° Inhumación', dataKey: 'numeroInhumacion' },
            { header: 'Difunto', dataKey: 'difuntoExport' },
            { header: 'Espacio', dataKey: 'espacioExport' },
            { header: 'Fecha', dataKey: 'fechaExport' },
            { header: 'Acta', dataKey: 'numeroActa' },
            { header: 'Tipo Concesión', dataKey: 'tipoConcesion' },
            { header: 'Titular', dataKey: 'titularExport' },
            { header: 'Pago', dataKey: 'pagoExport' },
            { header: 'Estado', dataKey: 'estado' }
        ];
        this.exportService.exportPdf(cols, exportData, 'Inhumaciones', 'Reporte de Inhumaciones');
    }

    exportExcel() {
        const exportData = this.inhumaciones.map(i => ({
            'N° Inhumación': `N° ${String(i.id).padStart(5, '0')}`,
            'Difunto': i.difunto ? `${i.difunto.nombres} ${i.difunto.apellidos}` : '-',
            'Espacio': i.espacio ? i.espacio.codigo : '-',
            'Fecha': i.fechaInhumacion ? new Date(i.fechaInhumacion).toLocaleDateString() : '-',
            'Acata de Defunción': i.numeroActa || '-',
            'Tipo Concesión': i.tipoConcesion || '-',
            'Titular': i.titular ? `${i.titular.nombres} ${i.titular.apellidos}` : '-',
            'Pago': i.pagos && i.pagos.length > 0 ? (i.pagos.some((p: any) => p.estado === 'PAGADO') ? 'PAGADO' : 'PENDIENTE') : 'POR PAGAR',
            'Estado': i.estado || '-'
        }));
        this.exportService.exportExcel(exportData, 'Inhumaciones');
    }

    loadInhumaciones(): void {
        this.inhumacionesService.getAll().subscribe({
            next: (data) => {
                this.inhumaciones = data;
                this.cdr.detectChanges();
                console.log('Inhumaciones loaded:', data.length);
            },
            error: (error) => {
                console.error('Error loading inhumaciones:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las inhumaciones' });
            }
        });
    }

    loadDifuntos(): void {
        this.difuntosService.getAll().subscribe({
            next: (data) => {
                this.allDifuntos_raw = data;
                this.updateDifuntosList();
            },
            error: (error) => console.error('Error loading difuntos:', error)
        });
    }

    updateDifuntosList(currentDifuntoId?: number): void {
        this.difuntos = this.allDifuntos_raw
            .filter(d => !d.inhumacion || d.id === currentDifuntoId)
            .map((d: any) => ({ 
                label: `${d.nombres} ${d.apellidos} (${d.dni || 'S/D'})`, 
                value: d.id,
                nombres: d.nombres,
                apellidos: d.apellidos,
                dni: d.dni
            }));

    }

    loadSectores(): void {
        this.sectoresService.getAll().subscribe({
            next: (data) => {
                this.sectores = data.map((s: any) => ({ label: s.nombre, value: s.id }));
            },
            error: (error) => console.error('Error loading sectores:', error)
        });
    }

    loadEspacios(): void {
        this.espaciosService.getAll().subscribe({
            next: (data) => {
                this.allEspacios = data.map((e: any) => ({
                    label: `${e.codigo || 'S/C'} - ${e.tipoEspacio || 'No definido'}`,
                    value: e.id,
                    sectorId: e.sector?.id,
                    estado: e.estado
                }));
                this.updateEspaciosList();
            },
            error: (error) => console.error('Error loading espacios:', error)
        });
    }

    loadTitulares(): void {
        this.titularesService.getAll().subscribe({
            next: (data) => {
                this.titulares = data.map((t: any) => ({
                    label: `${t.nombres} ${t.apellidos} (${t.dni})`,
                    value: t.id,
                    nombres: t.nombres,
                    apellidos: t.apellidos,
                    dni: t.dni
                }));

            },
            error: (error) => console.error('Error loading titulares:', error)
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

    updateEspaciosList(sectorId?: number | null): void {
        let list = this.allEspacios;
        if (sectorId) {
            list = list.filter(e => e.sectorId === sectorId);
        }
        
        // Filter by state LIBRE, OR it's the currently selected espacio
        this.espacios = list.filter(e => e.estado === 'LIBRE' || e.value === this.inhumacion.espacioId);
    }

    openNew(): void {
        this.inhumacion = {};
        this.submitted = false;
        this.updateDifuntosList();
        this.updateEspaciosList(this.inhumacion.sectorId);
        this.inhumacionDialog = true;
    }

    onSectorChange(sectorId: number | null): void {
        this.inhumacion.espacioId = null; // Reiniciar espacio seleccionado
        this.updateEspaciosList(sectorId);
    }

    onEspacioChange(espacioId: number): void {
        const espacioFound = this.allEspacios.find(e => e.value === espacioId);
        if (espacioFound && espacioFound.sectorId) {
            this.inhumacion.sectorId = espacioFound.sectorId;
        }
    }

    onTipoConcesionChange(tipo: string): void {
        if (tipo === 'PERPETUA') {
            this.inhumacion.fechaVencimiento = null;
        }
    }

    onDifuntoChange(difuntoId: number): void {
        if (!difuntoId) {
            console.log('No difunto ID provided');
            return;
        }

        console.log('🔍 Difunto seleccionado ID:', difuntoId);

        // Buscar el difunto con sus relaciones para obtener datos de inhumación previa
        this.difuntosService.getById(difuntoId).subscribe({
            next: (difunto: any) => {
                console.log('✅ Difunto data recibida:', difunto);

                // Auto-completar Titular desde los datos del difunto (novedad)
                if (difunto.titular && difunto.titular.id) {
                    this.inhumacion.titularId = difunto.titular.id;
                    console.log('👤 Titular ID asignado desde el difunto:', difunto.titular.id);
                }

                // Auto-completar Número de Acta desde los datos del difunto
                if (difunto.actaDefuncion) {
                    this.inhumacion.numeroActa = difunto.actaDefuncion;
                    console.log('📄 Número de Acta asignado desde el difunto:', difunto.actaDefuncion);
                }

                // Si el difunto tiene una inhumación previa, pre-llenar espacio y titular
                if (difunto.inhumacion) {
                    console.log('📋 Inhumación encontrada:', difunto.inhumacion);

                    // Verificar que existan los IDs antes de asignar
                    if (difunto.inhumacion.espacioId) {
                        this.inhumacion.espacioId = difunto.inhumacion.espacioId;
                        console.log('🏢 Espacio ID asignado:', difunto.inhumacion.espacioId);
                        
                        // Auto-completar Sector
                        const espacioFound = this.allEspacios.find(e => e.value === difunto.inhumacion.espacioId);
                        if (espacioFound && espacioFound.sectorId) {
                            this.inhumacion.sectorId = espacioFound.sectorId;
                            this.updateEspaciosList(espacioFound.sectorId);
                            console.log('📍 Sector ID asignado:', this.inhumacion.sectorId);
                        } else {
                            this.updateEspaciosList(this.inhumacion.sectorId);
                        }
                    } else {
                        console.log('⚠️ No hay espacioId en la inhumación');
                    }

                    // Si todavía no hay titular, usamos el de la inhumación previa
                    if (!this.inhumacion.titularId && difunto.inhumacion.titularId) {
                        this.inhumacion.titularId = difunto.inhumacion.titularId;
                        console.log('👤 Titular ID asignado desde la inhumación previa:', difunto.inhumacion.titularId);
                    } else if (!difunto.titular && !difunto.inhumacion.titularId) {
                        console.log('⚠️ No hay titularId en el difunto ni en la inhumación');
                    }

                    this.messageService.add({
                        severity: 'info',
                        summary: 'Datos Pre-cargados',
                        detail: 'Se han cargado el espacio y titular de la inhumación anterior',
                        life: 3000
                    });
                } else {
                    console.log('ℹ️ Este difunto no tiene inhumación previa');
                }
            },
            error: (error) => {
                console.error('❌ Error loading difunto details:', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'No se pudieron cargar los datos del difunto',
                    life: 3000
                });
            }
        });
    }

    editInhumacion(inhumacion: any): void {
        this.inhumacion = { ...inhumacion };
        // Map nested objects to IDs for p-select
        if (this.inhumacion.difunto) this.inhumacion.difuntoId = this.inhumacion.difunto.id;
        if (this.inhumacion.espacio) this.inhumacion.espacioId = this.inhumacion.espacio.id;
        if (this.inhumacion.titular) this.inhumacion.titularId = this.inhumacion.titular.id;

        this.updateDifuntosList(this.inhumacion.difuntoId);

        if (this.inhumacion.fechaInhumacion) this.inhumacion.fechaInhumacion = new Date(this.inhumacion.fechaInhumacion);
        if (this.inhumacion.fechaVencimiento) this.inhumacion.fechaVencimiento = new Date(this.inhumacion.fechaVencimiento);
        
        // Find which sector has this espacio to set the sector dropdown
        if (this.inhumacion.espacioId) {
            const espacioFound = this.allEspacios.find(e => e.value === this.inhumacion.espacioId);
            if (espacioFound && espacioFound.sectorId) {
                this.inhumacion.sectorId = espacioFound.sectorId;
                this.updateEspaciosList(espacioFound.sectorId);
            } else {
                this.updateEspaciosList();
            }
        } else {
            this.updateEspaciosList();
        }

        // Initialize horaInhumacionDate from horaInhumacion string
        if (this.inhumacion.horaInhumacion) {
            const [hours, minutes] = this.inhumacion.horaInhumacion.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            this.inhumacion.horaInhumacionDate = date;
        } else {
            this.inhumacion.horaInhumacionDate = null;
        }

        this.inhumacionDialog = true;
    }

    deleteInhumacion(inhumacion: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar esta inhumación? Esta acción es irreversible.',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                if (inhumacion.id) {
                    this.inhumacionesService.delete(inhumacion.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Inhumación Eliminada', life: 3000 });
                            this.loadInhumaciones();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la inhumación' });
                        }
                    });
                }
            }
        });
    }

    anularInhumacion(inhumacion: any): void {
        this.confirmationService.confirm({
            message: `¿Está seguro de ANULAR la inhumación N° ${inhumacion.id}? El registro se mantendrá como ANULADO y el espacio quedará LIBRE.`,
            header: 'Confirmar Anulación',
            icon: 'pi pi-ban',
            acceptLabel: 'Anular',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                if (inhumacion.id) {
                    this.inhumacionesService.anular(inhumacion.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'warn', summary: 'Inhumación Anulada', detail: 'El registro fue anulado y el espacio liberado', life: 3000 });
                            this.loadInhumaciones();
                        },
                        error: (err) => {
                            console.error('Error anularInhumacion:', err);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo anular la inhumación' });
                        }
                    });
                }
            }
        });
    }

    revertirAnulacion(inhumacion: any): void {
        this.confirmationService.confirm({
            message: `¿Confirma que desea REVERTIR la anulación de la inhumación N° ${inhumacion.id}? El espacio se volverá a marcar como OCUPADO.`,
            header: 'Confirmar Reversión',
            icon: 'pi pi-refresh',
            acceptLabel: 'Revertir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-warning',
            accept: () => {
                if (inhumacion.id) {
                    this.inhumacionesService.revertirAnulacion(inhumacion.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Reversión Exitosa', detail: 'El registro vuelve a estar ACTIVO', life: 3000 });
                            this.loadInhumaciones();
                        },
                        error: (err) => {
                            console.error('Error revertirAnulacion:', err);
                            const errorMsg = err.error?.message || 'No se pudo revertir la anulación (verifique si el espacio está libre)';
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
                        }
                    });
                }
            }
        });
    }


    hideDialog(): void {
        this.inhumacionDialog = false;
        this.submitted = false;
    }

    saveInhumacion(): void {
        this.submitted = true;

        if (this.inhumacion.difuntoId && this.inhumacion.espacioId && this.inhumacion.fechaInhumacion
            && (this.inhumacion.id || this.inhumacion.conceptoPagoId)) {
            // Format hora from separate time picker
            if (this.inhumacion.horaInhumacionDate instanceof Date) {
                const hours = this.inhumacion.horaInhumacionDate.getHours();
                const minutes = this.inhumacion.horaInhumacionDate.getMinutes();
                this.inhumacion.horaInhumacion = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            if (this.inhumacion.id) {
                // Update - only send the fields that can be updated
                const updateDto: any = {
                    difuntoId: this.inhumacion.difuntoId,
                    espacioId: this.inhumacion.espacioId,
                    titularId: this.inhumacion.titularId,
                    fechaInhumacion: this.inhumacion.fechaInhumacion,
                    horaInhumacion: this.inhumacion.horaInhumacion,
                    tipoConcesion: this.inhumacion.tipoConcesion,
                    fechaVencimiento: this.inhumacion.fechaVencimiento,
                    estado: this.inhumacion.estado,
                    numeroActa: this.inhumacion.numeroActa,
                    observaciones: this.inhumacion.observaciones
                };
                this.inhumacionesService.update(this.inhumacion.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Inhumación Actualizada', life: 3000 });
                        this.loadInhumaciones();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating inhumacion:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - only send the fields needed for creation
                const createDto: any = {
                    difuntoId: this.inhumacion.difuntoId,
                    espacioId: this.inhumacion.espacioId,
                    titularId: this.inhumacion.titularId,
                    fechaInhumacion: this.inhumacion.fechaInhumacion,
                    horaInhumacion: this.inhumacion.horaInhumacion,
                    tipoConcesion: this.inhumacion.tipoConcesion || 'TEMPORAL',
                    fechaVencimiento: this.inhumacion.fechaVencimiento,
                    estado: this.inhumacion.estado || 'ACTIVO',
                    numeroActa: this.inhumacion.numeroActa,
                    observaciones: this.inhumacion.observaciones,
                    // Campos para generar pago automático
                    conceptoPagoId: this.inhumacion.conceptoPagoId,
                    usuarioId: this.authService.getCurrentUser()?.id
                };
                this.inhumacionesService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Inhumación Creada', life: 3000 });
                        this.loadInhumaciones();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating inhumacion:', err);
                        // Mostrar mensaje específico según el error
                        if (err.status === 409) {
                            // Error de conflicto (difunto ya inhumado)
                            const mensaje = err.error?.message || 'El difunto ya tiene una inhumación registrada';
                            this.messageService.add({
                                severity: 'warn',
                                summary: '⚠️ Advertencia',
                                detail: mensaje,
                                life: 5000
                            });
                        } else if (err.status === 400) {
                            // Espacio no disponible
                            const mensaje = err.error?.message || 'El espacio no está disponible';
                            this.messageService.add({
                                severity: 'warn',
                                summary: '⚠️ Espacio No Disponible',
                                detail: mensaje,
                                life: 5000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Falló la creación de la inhumación'
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

    getInitials(nombres: string, apellidos: string): string {
        if (!nombres && !apellidos) return '?';
        const n = nombres?.trim().charAt(0) || '';
        const a = apellidos?.trim().charAt(0) || '';
        return (n + a).toUpperCase();
    }

    imprimirConstancia(inhumacion: any) {
        this.inhumacionesPdfService.imprimirConstancia(inhumacion);
    }
}
