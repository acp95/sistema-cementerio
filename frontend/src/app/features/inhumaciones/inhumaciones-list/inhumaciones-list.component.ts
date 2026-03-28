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
    providers: [MessageService, ConfirmationService],
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

    inhumaciones: any[] = [];
    difuntos: any[] = [];
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
            titularExport: i.titular ? `${i.titular.nombres} ${i.titular.apellidos}` : '-'
        }));
        const cols = [
            { header: 'N° Inhumación', dataKey: 'numeroInhumacion' },
            { header: 'Difunto', dataKey: 'difuntoExport' },
            { header: 'Espacio', dataKey: 'espacioExport' },
            { header: 'Fecha', dataKey: 'fechaExport' },
            { header: 'Acta', dataKey: 'numeroActa' },
            { header: 'Tipo Concesión', dataKey: 'tipoConcesion' },
            { header: 'Titular', dataKey: 'titularExport' },
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
                this.difuntos = data.map((d: any) => ({ label: `${d.nombres} ${d.apellidos} (${d.dni || 'S/D'})`, value: d.id }));
            },
            error: (error) => console.error('Error loading difuntos:', error)
        });
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
                    value: t.id
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

        this.inhumacionDialog = true;
    }

    deleteInhumacion(inhumacion: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar esta inhumación?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
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
    imprimirConstancia(inhumacion: any) {
        const ventanaImpresion = window.open('', '', 'width=800,height=600');
        if (!ventanaImpresion) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo abrir la ventana de impresión' });
            return;
        }

        const fechaInhumacion = new Date(inhumacion.fechaInhumacion).toLocaleDateString('es-PE', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const fechaDoc = new Date().toLocaleDateString('es-PE', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Safe access
        const difuntoNombre = inhumacion.difunto ? `${inhumacion.difunto.nombres} ${inhumacion.difunto.apellidos}` : 'No especificado';
        const difuntoDni = inhumacion.difunto?.dni || '-';

        const titularNombre = inhumacion.titular ? `${inhumacion.titular.nombres} ${inhumacion.titular.apellidos}` : 'No especificado';
        const titularDni = inhumacion.titular?.dni || '-';

        const espacioCodigo = inhumacion.espacio?.codigo || '-';
        const espacioTipo = inhumacion.espacio?.tipoEspacio || '-';
        const espacioUbicacion = inhumacion.espacio?.ubicacion || '-';

        // Pagos logic summary
        let estadoPagoGlobal = 'POR PAGAR';
        if (inhumacion.pagos && inhumacion.pagos.length > 0) {
            const hasPagado = inhumacion.pagos.some((p: any) => p.estado === 'PAGADO');
            estadoPagoGlobal = hasPagado ? 'PAGADO' : 'POR PAGAR';
        }

        const contenido = `
            <html>
            <head>
                <title>Constancia de Inhumación - ${difuntoNombre}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                    
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 11pt;
                        margin: 0;
                        padding: 0;
                        background-color: white;
                    }
                    
                    .page-container {
                        width: 210mm;
                        min-height: 297mm;
                        padding: 20mm;
                        margin: 0 auto;
                        position: relative;
                        box-sizing: border-box;
                    }

                    .watermark {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 80pt;
                        color: rgba(0,0,0,0.03);
                        font-weight: bold;
                        z-index: 0;
                        pointer-events: none;
                        white-space: nowrap;
                    }

                    .border-frame {
                        position: absolute;
                        top: 10mm;
                        left: 10mm;
                        right: 10mm;
                        bottom: 10mm;
                        border: 2px solid #000;
                        pointer-events: none;
                        display: none; /* Opcional: activar si desean marco decorativo */
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .logo-space {
                        height: 60px;
                        margin-bottom: 10px;
                        /* Placeholder para logo */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .header h2 { margin: 2px 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
                    .header h3 { margin: 2px 0; font-size: 12pt; font-weight: normal; }
                    .header p { margin: 0; font-size: 9pt; color: #555; }
                    .header .line { border-bottom: 1px solid #000; width: 60%; margin: 10px auto; }

                    .doc-title {
                        text-align: center;
                        margin: 25px 0;
                        font-size: 18pt;
                        font-weight: bold;
                        text-decoration: underline;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        z-index: 1;
                        position: relative;
                    }

                    .content {
                        position: relative;
                        z-index: 1;
                        line-height: 1.4;
                    }

                    .section-header {
                        background-color: #e0e0e0;
                        border: 1px solid #000;
                        padding: 4px 8px;
                        font-weight: bold;
                        font-size: 10pt;
                        margin-top: 15px;
                        margin-bottom: 5px;
                        text-transform: uppercase;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 10.5pt;
                    }
                    
                    td { padding: 4px 8px; vertical-align: top; }
                    
                    .data-label {
                        font-weight: bold;
                        width: 35%;
                    }
                    
                    .data-value {
                        border-bottom: 1px dotted #999;
                    }

                    .grid-table {
                        width: 100%;
                        border: 1px solid #000;
                    }
                    
                    .grid-table th {
                        background-color: #f2f2f2;
                        border: 1px solid #000;
                        padding: 5px;
                        font-size: 9pt;
                        text-align: center;
                    }
                    
                    .grid-table td {
                        border: 1px solid #000;
                        padding: 5px;
                        font-size: 9pt;
                    }

                    .footer {
                        margin-top: 50px;
                        position: relative;
                        z-index: 1;
                    }

                    .signatures {
                        display: flex;
                        justify-content: space-around;
                        margin-top: 60px;
                    }
                    
                    .signature-box {
                        text-align: center;
                        width: 40%;
                    }
                    
                    .signature-line {
                        border-top: 1px dashed #000;
                        margin-bottom: 5px;
                    }
                    
                    .signature-role { font-weight: bold; font-size: 10pt; }
                    .signature-name { font-size: 9pt; }

                    .legal-text {
                        text-align: justify;
                        margin: 15px 0;
                        font-size: 11pt;
                    }
                    
                    .date-place {
                        text-align: right;
                        margin-top: 30px;
                        margin-bottom: 20px;
                        font-style: italic;
                    }
                    
                    @media print {
                        @page { size: A4; margin: 0; }
                        body { background: white; -webkit-print-color-adjust: exact; }
                        .page-container { width: 100%; height: auto; padding: 15mm; }
                    }
                </style>
            </head>
            <body>
                <div class="page-container">
                    <div class="watermark">MUNICIPAL</div>
                    <!-- <div class="border-frame"></div> -->

                    <div class="header">
                        <h2>Municipalidad C.P. Chen Chen</h2>
                        <h3>Cementerio Municipal</h3>
                        <div class="line"></div>
                        <p>RUC: 20123456789 | Av. Principal S/N - Chen Chen, Moquegua</p>
                    </div>

                    <div class="doc-title">CONSTANCIA DE INHUMACIÓN</div>

                    <div class="content">
                        <div class="legal-text">
                            A solicitud de la parte interesada, por medio del presente documento se hace constar que en los registros de este Cementerio Municipal figura inscrita la siguiente información:
                        </div>
                    
                        <div class="section-header">I. DATOS DEL DIFUNTO</div>
                        <table>
                            <tr>
                                <td class="data-label">NOMBRES Y APELLIDOS:</td>
                                <td class="data-value">${difuntoNombre}</td>
                            </tr>
                            <tr>
                                <td class="data-label">DOCUMENTO IDENTIDAD:</td>
                                <td class="data-value">${difuntoDni}</td>
                            </tr>
                             <tr>
                                <td class="data-label">N° ACTA DEFUNCIÓN:</td>
                                <td class="data-value">${inhumacion.numeroActa || 'No Registrada'}</td>
                            </tr>
                        </table>

                        <div class="section-header">II. DATOS DE LA INHUMACIÓN</div>
                        <table>
                             <tr>
                                <td class="data-label">N° DE INHUMACIÓN:</td>
                                <td class="data-value font-bold">N° ${String(inhumacion.id).padStart(5, '0')}</td>
                            </tr>
                             <tr>
                                <td class="data-label">FECHA DE INHUMACIÓN:</td>
                                <td class="data-value">${fechaInhumacion}</td>
                            </tr>
                             <tr>
                                <td class="data-label">HORA:</td>
                                <td class="data-value">${inhumacion.horaInhumacion || '--:--'}</td>
                            </tr>
                             <tr>
                                <td class="data-label">TIPO DE CONCESIÓN:</td>
                                <td class="data-value">${inhumacion.tipoConcesion}</td>
                            </tr>
                             <tr>
                                <td class="data-label">ESTADO DE PAGO:</td>
                                <td class="data-value font-bold">${estadoPagoGlobal}</td>
                            </tr>
                        </table>

                        <div class="section-header">III. UBICACIÓN DEL RESTO MORTAL</div>
                        <table>
                             <tr>
                                <td class="data-label">CÓDIGO / PABELLÓN:</td>
                                <td class="data-value">${espacioCodigo}</td>
                            </tr>
                             <tr>
                                <td class="data-label">TIPO DE ESPACIO:</td>
                                <td class="data-value">${espacioTipo}</td>
                            </tr>
                             <tr>
                                <td class="data-label">UBICACIÓN DETALLADA:</td>
                                <td class="data-value">${espacioUbicacion}</td>
                            </tr>
                        </table>

                        <div class="section-header">IV. RESPONSABLE REGISTRADO</div>
                        <table>
                             <tr>
                                <td class="data-label">NOMBRES Y APELLIDOS:</td>
                                <td class="data-value">${titularNombre}</td>
                            </tr>
                             <tr>
                                <td class="data-label">DOCUMENTO IDENTIDAD:</td>
                                <td class="data-value">${titularDni}</td>
                            </tr>
                        </table>


                        
                        <div class="date-place">
                            Chen Chen, ${fechaDoc}
                        </div>
                        
                        <p style="font-size: 9pt; margin-top: 10px;">
                            <strong>Observaciones:</strong><br>
                            ${inhumacion.observaciones || 'Ninguna.'}
                        </p>
                    </div>

                    <div class="footer">
                        <div class="signatures">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div class="signature-role">ADMINISTRACIÓN</div>
                                <div class="signature-name">Cementerio Municipal</div>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <div class="signature-role">SOLICITANTE / FAMILIAR</div>
                                <div class="signature-name">${titularNombre}</div>
                                <div class="signature-name">DNI: ${titularDni}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        ventanaImpresion.document.write(contenido);
        ventanaImpresion.document.close();
    }
}
