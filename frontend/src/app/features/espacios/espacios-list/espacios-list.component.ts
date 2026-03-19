import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EspaciosService } from '../../../core/services/espacios.service';
import { SectoresService } from '../../../core/services/sectores.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Observable, tap, catchError, of } from 'rxjs';

// PrimeNG Imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-espacios-list',
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
        InputNumberModule,
        TextareaModule,
        IconFieldModule,
        InputIconModule,
        FormsModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './espacios-list.component.html',
    styleUrls: ['./espacios-list.component.scss']
})
export class EspaciosListComponent implements OnInit {
    private espaciosService = inject(EspaciosService);
    private sectoresService = inject(SectoresService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    espacios: any[] = [];
    espacioDialog: boolean = false;
    espacio: any = {};
    submitted: boolean = false;
    sectores: any[] = [];
    selectedSectorId: number | null = null;

    tipoOptions = [
        { label: 'Nicho', value: 'NICHO' },
        { label: 'Fosa', value: 'FOSA' }
    ];

    estadoOptions = [
        { label: 'Disponible', value: 'disponible' },
        { label: 'Ocupado', value: 'ocupado' },
        { label: 'Reservado', value: 'reservado' },
        { label: 'Mantenimiento', value: 'mantenimiento' }
    ];

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.loadEspacios();
        this.loadSectores();
    }

    loadEspacios(): void {
        this.espaciosService.getAll().subscribe({
            next: (data) => {
                this.espacios = data;
                this.cdr.detectChanges();
                console.log('Espacios loaded:', data.length);
            },
            error: (error) => {
                console.error('Error loading espacios:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los espacios' });
            }
        });
    }

    loadSectores(): void {
        this.sectoresService.getAll().subscribe({
            next: (data) => {
                this.sectores = data.map(s => ({ label: s.nombre, value: s.id }));
            },
            error: (error) => console.error('Error loading sectores', error)
        });
    }

    openNew(): void {
        this.espacio = {};
        this.submitted = false;
        this.espacioDialog = true;
    }

    editEspacio(espacio: any): void {
        this.espacio = { ...espacio };
        this.espacioDialog = true;
    }

    deleteEspacio(espacio: any): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar el espacio ' + espacio.codigo + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (espacio.id) {
                    this.espaciosService.delete(espacio.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Espacio Eliminado', life: 3000 });
                            this.loadEspacios();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el espacio' });
                        }
                    });
                }
            }
        });
    }

    hideDialog(): void {
        this.espacioDialog = false;
        this.submitted = false;
    }

    saveEspacio(): void {
        this.submitted = true;

        if (this.espacio.codigo?.trim() && this.espacio.sectorId) {
            const payload = { ...this.espacio };

            if (this.espacio.id) {
                this.espaciosService.update(this.espacio.id, payload).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Espacio Actualizado', life: 3000 });
                        this.loadEspacios();
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' })
                });
            } else {
                this.espaciosService.create(payload).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Espacio Creado', life: 3000 });
                        this.loadEspacios();
                        this.hideDialog();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la creación' })
                });
            }
        }
    }

    onSectorFilter() {
        if (this.selectedSectorId) {
            this.dt.filter(this.selectedSectorId, 'sector.id', 'equals');
        } else {
            this.dt.filter('', 'sector.id', 'equals');
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
