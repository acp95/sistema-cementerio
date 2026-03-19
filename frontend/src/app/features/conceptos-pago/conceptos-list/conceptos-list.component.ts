import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConceptosPagoService } from '../../../core/services/conceptos-pago.service';
import { AuthService } from '../../../core/services/auth.service';
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
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-conceptos-list',
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
        InputNumberModule,
        TextareaModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        CheckboxModule,
        FormsModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './conceptos-list.component.html',
    styleUrls: ['./conceptos-list.component.scss']
})
export class ConceptosListComponent implements OnInit {
    private conceptosService = inject(ConceptosPagoService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    conceptos: any[] = [];

    conceptoDialog: boolean = false;
    concepto: any = {};
    submitted: boolean = false;
    showInactive: boolean = false;

    estadoOptions = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' }
    ];

    filterOptions = [
        { label: 'Solo Activos', value: false },
        { label: 'Todos', value: true }
    ];

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.loadConceptos();
    }

    loadConceptos(): void {
        this.conceptosService.getAll(this.showInactive).subscribe({
            next: (data) => {
                this.conceptos = [...data];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading conceptos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los conceptos' });
            }
        });
    }

    onFilterChange(): void {
        this.loadConceptos();
    }

    openNew(): void {
        this.concepto = {
            nombre: '',
            precioBase: 0,
            esPeriodico: false,
            activo: true
        };
        this.submitted = false;
        this.conceptoDialog = true;
    }

    editConcepto(concepto: any): void {
        this.concepto = { ...concepto };
        this.conceptoDialog = true;
    }

    deleteConcepto(concepto: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este concepto?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (concepto.id) {
                    this.conceptosService.delete(concepto.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Concepto Eliminado', life: 3000 });
                            this.loadConceptos();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el concepto' });
                        }
                    });
                }
            }
        });
    }

    hideDialog(): void {
        this.conceptoDialog = false;
        this.submitted = false;
    }

    saveConcepto(): void {
        this.submitted = true;

        if (this.concepto.nombre && this.concepto.precioBase != null) {
            if (this.concepto.id) {
                // Update - only send the fields that can be updated
                const updateDto: any = {
                    nombre: this.concepto.nombre,
                    precioBase: parseFloat(this.concepto.precioBase),
                    esPeriodico: this.concepto.esPeriodico ?? false,
                    activo: this.concepto.activo ?? true
                };
                console.log('Enviando updateDto:', updateDto);
                this.conceptosService.update(this.concepto.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Concepto Actualizado', life: 3000 });
                        this.loadConceptos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating concepto:', err);
                        console.error('Error details:', err.error);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - only send the fields needed for creation
                const createDto: any = {
                    nombre: this.concepto.nombre,
                    precioBase: this.concepto.precioBase,
                    esPeriodico: this.concepto.esPeriodico || false,
                    activo: this.concepto.activo !== undefined ? this.concepto.activo : true
                };
                this.conceptosService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Concepto Creado', life: 3000 });
                        this.loadConceptos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating concepto:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la creación' });
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
