import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PagosService } from '../../../core/services/pagos.service';
import { TitularesService } from '../../../core/services/titulares.service';
import { ConceptosPagoService } from '../../../core/services/conceptos-pago.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { PagosPdfService } from '../../../core/services/pagos-pdf.service';
import { Observable, tap } from 'rxjs';

@Component({
    selector: 'app-pagos-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        SelectModule,
        InputNumberModule,
        TextareaModule,
        DatePickerModule,
        TagModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService, ConfirmationService, PagosPdfService],
    templateUrl: './pagos-list.component.html'
})
export class PagosListComponent implements OnInit {
    private pagosService = inject(PagosService);
    private titularesService = inject(TitularesService);
    private conceptosService = inject(ConceptosPagoService);
    public authService = inject(AuthService);
    private exportService = inject(ExportService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private pagosPdfService = inject(PagosPdfService);


    // Usar propiedades normales en lugar de signals
    // Signals implementation for Zoneless
    pagos: any[] = [];

    titulares: any[] = [];
    conceptos: any[] = [];

    pagoDialog: boolean = false;
    pago: any = {};
    submitted: boolean = false;

    estadosPago = [
        { label: 'Pendiente', value: 'PENDIENTE' },
        { label: 'Pagado', value: 'PAGADO' },
        { label: 'Anulado', value: 'ANULADO' }
    ];

    ngOnInit() {
        this.loadPagos();
        this.loadTitulares();
        this.loadConceptos();
    }

    metodosPago = [
        { label: 'Efectivo', value: 'EFECTIVO' },
        { label: 'Transferencia', value: 'TRANSFERENCIA' },
        { label: 'Yape/Plin', value: 'BILLETERA_DIGITAL' },
        { label: 'Depósito', value: 'DEPOSITO' }
    ];

    exportPdf() {
        const exportData = this.pagos.map(p => ({
            ...p,
            reciboExport: p.codigoRecibo || '-',
            fechaExport: p.fechaPago ? new Date(p.fechaPago).toLocaleDateString() : '-',
            titularExport: p.titular ? `${p.titular.nombres} ${p.titular.apellidos}` : '-',
            difuntoExport: p.inhumacion?.difunto ? `${p.inhumacion.difunto.nombres} ${p.inhumacion.difunto.apellidos}` : '-',
            conceptoExport: p.detalles?.length > 0 ? p.detalles[0].concepto?.nombre + (p.detalles.length > 1 ? ` (+${p.detalles.length - 1})` : '') : '-',
            montoExport: `S/. ${Number(p.montoTotal || 0).toFixed(2)}`
        }));
        const cols = [
            { header: 'N° Recibo', dataKey: 'reciboExport' },
            { header: 'Fecha', dataKey: 'fechaExport' },
            { header: 'Titular', dataKey: 'titularExport' },
            { header: 'Difunto', dataKey: 'difuntoExport' },
            { header: 'Concepto', dataKey: 'conceptoExport' },
            { header: 'Monto Total', dataKey: 'montoExport' },
            { header: 'Estado', dataKey: 'estado' },
            { header: 'Método', dataKey: 'metodoPago' }
        ];
        this.exportService.exportPdf(cols, exportData, 'Pagos', 'Reporte de Caja');
    }

    exportExcel() {
        const exportData = this.pagos.map(p => ({
            'N° Recibo': p.codigoRecibo || '-',
            'Fecha': p.fechaPago ? new Date(p.fechaPago).toLocaleDateString() : '-',
            'Titular': p.titular ? `${p.titular.nombres} ${p.titular.apellidos}` : '-',
            'Difunto': p.inhumacion?.difunto ? `${p.inhumacion.difunto.nombres} ${p.inhumacion.difunto.apellidos}` : '-',
            'Concepto': p.detalles?.length > 0 ? p.detalles[0].concepto?.nombre + (p.detalles.length > 1 ? ` (+${p.detalles.length - 1})` : '') : '-',
            'Monto Total': `S/. ${Number(p.montoTotal || 0).toFixed(2)}`,
            'Estado': p.estado,
            'Método Pago': p.metodoPago
        }));
        this.exportService.exportExcel(exportData, 'Pagos');
    }

    loadPagos() {
        this.pagosService.getAll().subscribe({
            next: (data) => {
                this.pagos = data.map(p => ({
                    ...p,
                    fechaPago: p.fechaPago ? new Date(p.fechaPago) : null
                }));
                this.cdr.detectChanges();
                console.log('Pagos loaded:', this.pagos.length);
            },
            error: (error) => {
                console.error('Error loading pagos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pagos' });
            }
        });
    }

    loadTitulares() {
        this.titularesService.getAll().subscribe({
            next: (data) => {
                this.titulares = data.map((t: any) => ({
                    label: `${t.nombres} ${t.apellidos} (${t.dni || 'S/D'})`,
                    value: t.id
                }));
            },
            error: (error) => console.error('Error loading titulares:', error)
        });
    }

    loadConceptos() {
        this.conceptosService.getAll().subscribe({
            next: (data) => {
                this.conceptos = data.map((c: any) => ({
                    label: `${c.nombre} - S/. ${c.precioBase}`,
                    value: c.id,
                    monto: c.precioBase
                }));
            },
            error: (error) => console.error('Error loading concepts:', error)
        });
    }

    onConceptoChange(event: any) {
        // Auto-fill amount based on selected concept
        const selectedConcept = this.conceptos.find((c: any) => c.value === event.value);
        if (selectedConcept) {
            this.pago.monto = selectedConcept.monto;
        }
    }

    editPago(pago: any) {
        this.pago = { ...pago };
        // Map nested objects to IDs for p-select
        if (this.pago.titular) this.pago.titularId = this.pago.titular.id;
        
        // El concepto ahora viene dentro de los detalles en la respuesta del backend
        if (this.pago.detalles && this.pago.detalles.length > 0) {
            this.pago.conceptoPagoId = this.pago.detalles[0].concepto?.id;
        } else if (this.pago.conceptoPago) {
            this.pago.conceptoPagoId = this.pago.conceptoPago.id;
        }
        
        // Map montoTotal to monto for form binding
        if (this.pago.montoTotal) this.pago.monto = this.pago.montoTotal;

        if (this.pago.fechaPago) this.pago.fechaPago = new Date(this.pago.fechaPago);
        this.pagoDialog = true;
    }

    anularPago(pago: any) {
        this.confirmationService.confirm({
            message: `¿Está seguro de anular el pago ${pago.codigoRecibo}? Esta acción no se puede deshacer.`,
            header: 'Confirmar Anulación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, Anular',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                if (pago.id) {
                    this.pagosService.anular(pago.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'warn', summary: 'Pago Anulado', detail: `El pago ${pago.codigoRecibo} ha sido anulado`, life: 3000 });
                            this.loadPagos();
                        },
                        error: (err) => {
                            console.error('Error in anularPago:', err);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo anular el pago' });
                        }
                    });
                }
            }
        });
    }

    revertirAnulacion(pago: any) {
        this.confirmationService.confirm({
            message: `¿Está seguro de revertir la anulación del pago ${pago.codigoRecibo}? El pago volverá al estado PENDIENTE.`,
            header: 'Confirmar Reversión',
            icon: 'pi pi-refresh',
            acceptLabel: 'Sí, Revertir',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-warning',
            accept: () => {
                if (pago.id) {
                    this.pagosService.revertirAnulacion(pago.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'info', summary: 'Anulación Revertida', detail: `El pago ${pago.codigoRecibo} ahora está PENDIENTE`, life: 3000 });
                            this.loadPagos();
                        },
                        error: (err) => {
                            console.error('Error in revertirAnulacion:', err);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo revertir la anulación del pago' });
                        }
                    });
                }
            }
        });
    }

    hideDialog() {
        this.pagoDialog = false;
        this.submitted = false;
    }

    // ... existing code ...

    openNew() {
        this.pago = {
            fechaPago: new Date(),
            metodoPago: 'EFECTIVO',
            estado: 'PENDIENTE' // Default to Pendiente so "Cobrar" flow can be used
        };

        // Seleccionar el primer concepto por defecto si existe
        if (this.conceptos.length > 0) {
            this.pago.conceptoPagoId = this.conceptos[0].value;
            this.pago.monto = this.conceptos[0].monto;
        }

        this.submitted = false;
        this.pagoDialog = true;
    }

    // ... existing code ...

    savePago() {
        this.submitted = true;

        if (this.pago.titularId && this.pago.monto != null) {
            if (this.pago.id) {
                // Update - only send the fields that can be updated
                const updateDto: any = {
                    codigoRecibo: this.pago.codigoRecibo,
                    titularId: this.pago.titularId,
                    inhumacionId: this.pago.inhumacionId,
                    montoTotal: this.pago.monto,
                    metodoPago: this.pago.metodoPago,
                    fechaPago: this.pago.fechaPago,
                    estado: this.pago.estado,
                    observaciones: this.pago.observaciones
                };
                this.pagosService.update(this.pago.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pago Actualizado', life: 3000 });
                        this.loadPagos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating pago:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - only send the fields needed for creation
                const createDto: any = {
                    codigoRecibo: this.pago.codigoRecibo,
                    titularId: this.pago.titularId,
                    usuarioId: this.authService.currentUser()?.id,
                    inhumacionId: this.pago.inhumacionId,
                    montoTotal: this.pago.monto,
                    metodoPago: this.pago.metodoPago || 'EFECTIVO',
                    fechaPago: this.pago.fechaPago || new Date(),
                    estado: this.pago.estado || 'PENDIENTE',
                    observaciones: this.pago.observaciones
                };
                this.pagosService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Pago Registrado', life: 3000 });
                        this.loadPagos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating pago:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló el registro' });
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


    cobrarPago(pago: any) {
        console.log('cobrarPago called with:', pago);
        console.log('pago.estado:', pago.estado);
        console.log('montoTotal:', pago.montoTotal);

        const montoFormatted = Number(pago.montoTotal || 0).toFixed(2);

        this.confirmationService.confirm({
            message: `¿Confirma que recibió el pago de S/. ${montoFormatted}?`,
            header: 'Confirmar Cobro',
            icon: 'pi pi-money-bill',
            acceptLabel: 'Sí, Cobrar',
            rejectLabel: 'Cancelar',
            accept: () => {
                console.log('Accept clicked, updating pago...');
                const updateDto = {
                    estado: 'PAGADO',
                    fechaPago: new Date(),
                    usuarioId: this.authService.currentUser()?.id
                };
                this.pagosService.update(pago.id, updateDto).subscribe({
                    next: () => {
                        console.log('Pago updated successfully');
                        this.messageService.add({
                            severity: 'success',
                            summary: '¡Cobro Registrado!',
                            detail: `Se cobró S/. ${pago.montoTotal?.toFixed(2)} exitosamente`,
                            life: 3000
                        });
                        this.loadPagos();
                    },
                    error: (err) => {
                        console.error('Error al cobrar:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el cobro' });
                    }
                });
            }
        });
    }

    imprimirRecibo(pago: any) {
        this.pagosPdfService.imprimirRecibo(pago);
    }
}
