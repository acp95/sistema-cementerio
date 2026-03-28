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
    providers: [MessageService, ConfirmationService],
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
                this.pagos = [...data];
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
                    label: `${c.nombre} - S/. ${c.monto}`,
                    value: c.id,
                    monto: c.monto
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
        if (this.pago.conceptoPago) this.pago.conceptoPagoId = this.pago.conceptoPago.id;

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
        const ventanaImpresion = window.open('', '', 'width=800,height=600');
        if (!ventanaImpresion) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo abrir la ventana de impresión' });
            return;
        }

        const fechaFormatted = new Date(pago.fechaPago).toLocaleDateString('es-PE', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Safe access to nested properties
        const titularNombre = pago.titular ? `${pago.titular.nombres} ${pago.titular.apellidos}` : 'No especificado';
        const titularDni = pago.titular?.dni || '-';
        const usuarioNombre = pago.usuario?.nombreCompleto || 'Cajero';
        const metodoPago = pago.metodoPago || 'EFECTIVO';
        const observaciones = pago.observaciones || '-';
        const montoTotal = Number(pago.montoTotal || 0).toFixed(2);

        // Generate items rows
        let itemsHtml = '';
        if (pago.detalles && pago.detalles.length > 0) {
            itemsHtml = pago.detalles.map((d: any) => `
                <tr>
                    <td style="text-align: left">${d.concepto?.nombre || 'Item'}</td>
                    <td style="text-align: right">S/. ${Number(d.subtotal || 0).toFixed(2)}</td>
                </tr>
            `).join('');
        } else {
            // Fallback for migrated data or simple records
            const conceptoGen = pago.conceptoPago?.nombre || 'Pago General';
            itemsHtml = `
                <tr>
                    <td style="text-align: left">${conceptoGen}</td>
                    <td style="text-align: right">S/. ${montoTotal}</td>
                </tr>
            `;
        }

        const contenido = `
            <html>
            <head>
                <title>Recibo de Pago - ${pago.codigoRecibo}</title>
                <style>
                    body {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 12px;
                        margin: 0;
                        padding: 10px;
                        width: 78mm; /* Standard thermal width */
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                        border-bottom: 1px dashed black;
                        padding-bottom: 5px;
                    }
                    .header h3, .header h4 { margin: 5px 0; }
                    .header p { margin: 2px 0; }
                    
                    .info { margin-bottom: 10px; }
                    .info p { margin: 2px 0; display: flex; justify-content: space-between; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th { border-bottom: 1px solid black; text-align: left; font-size: 11px; }
                    td { padding: 4px 0; }
                    
                    .totals { 
                        border-top: 1px dashed black;
                        padding-top: 5px;
                        margin-bottom: 15px;
                    }
                    .totals p { 
                        margin: 2px 0; 
                        display: flex; 
                        justify-content: space-between; 
                        font-weight: bold; 
                        font-size: 14px;
                    }
                    
                    .footer { text-align: center; font-size: 10px; margin-top: 20px; }
                    
                    @media print {
                        @page { margin: 0; }
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h3>MUNICIPALIDAD C.P. CHEN CHEN</h3>
                    <p>RUC: 20123456789</p>
                    <p>Av. Principal S/N - Chen Chen</p>
                    <br>
                    <h4>RECIBO DE CAJA</h4>
                    <h4>${pago.codigoRecibo || 'S/N'}</h4>
                </div>

                <div class="info">
                    <p><strong>Fecha:</strong> <span>${fechaFormatted}</span></p>
                    <p><strong>Cajero:</strong> <span>${usuarioNombre}</span></p>
                    <p>----------------------------------------</p>
                    <p><strong>Cliente:</strong> <span>${titularNombre}</span></p>
                    <p><strong>DNI/RUC:</strong> <span>${titularDni}</span></p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 70%">DESCRIPCIÓN</th>
                            <th style="width: 30%; text-align: right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="totals">
                    <p><span>TOTAL A PAGAR:</span> <span>S/. ${montoTotal}</span></p>
                    <p style="font-weight: normal; font-size: 11px;">
                        <span>Método:</span> <span>${metodoPago}</span>
                    </p>
                </div>
                
                <div style="font-size: 10px; margin-bottom: 10px;">
                    <strong>Observaciones:</strong><br>
                    ${observaciones}
                </div>

                <div class="footer">
                    <p>__________________________</p>
                    <p>Firma / Sello</p>
                    <br>
                    <p>¡Gracias por su contribución!</p>
                    <p>Conserve este voucher</p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        }
                    }
                </script>
            </body>
            </html>
        `;

        ventanaImpresion.document.write(contenido);
        ventanaImpresion.document.close();
    }
}
