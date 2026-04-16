import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SectoresService } from '../../../core/services/sectores.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExportService } from '../../../core/services/export.service';
import { Sector } from '@/core/models/infraestructura.model';
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
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-sectores-list',
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
        SelectModule,
        FormsModule,
        TooltipModule,
        DialogModule,
        RadioButtonModule,
        InputNumberModule,
        InputIconModule,
        CardModule,
        ProgressBarModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './sectores-list.component.html',
    styleUrls: ['./sectores-list.component.scss']
})
export class SectoresListComponent implements OnInit {
    private sectoresService = inject(SectoresService);
    public authService = inject(AuthService);
    private exportService = inject(ExportService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    sectores$!: Observable<Sector[]>;
    sectoresCurrent: Sector[] = [];
    sectorDialog: boolean = false;
    sector!: Partial<Sector>;
    submitted: boolean = false;
    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.loadSectores();
    }

    loadSectores(): void {
        this.sectores$ = this.sectoresService.getAll().pipe(
            tap(data => {
                this.sectoresCurrent = data;
                console.log('Sectores loaded:', data.length);
            }),
            catchError(error => {
                console.error('Error loading sectores:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los sectores' });
                return of([]);
            })
        );
    }

    exportPdf() {
        const cols = [
            { header: 'Nombre', dataKey: 'nombre' },
            { header: 'Descripción', dataKey: 'descripcion' },
            { header: 'Tipo', dataKey: 'tipoEspacio' },
            { header: 'Capacidad', dataKey: 'capacidadTotal' }
        ];
        this.exportService.exportPdf(cols, this.sectoresCurrent, 'Sectores', 'Reporte de Sectores');
    }

    exportExcel() {
        const exportData = this.sectoresCurrent.map(s => ({
            'Nombre': s.nombre,
            'Descripción': s.descripcion,
            'Tipo': s.tipoEspacio,
            'Capacidad': s.capacidadTotal
        }));
        this.exportService.exportExcel(exportData, 'Sectores');
    }

    openNew(): void {
        this.sector = {};
        this.submitted = false;
        this.sectorDialog = true;
    }

    editSector(sector: Sector): void {
        this.sector = { ...sector };
        this.sectorDialog = true;
    }

    verMapa(sector: Sector): void {
        this.router.navigate(['/sectores', sector.id, 'mapa']);
    }

    deleteSector(sector: Sector): void {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar ' + sector.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (sector.id) {
                    this.sectoresService.delete(sector.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Sector Eliminado', life: 3000 });
                            this.loadSectores();
                        },
                        error: (err) => {
                            console.error('Error deleting sector:', err);
                            const errorMessage = err?.error?.message || 'No se pudo eliminar el sector';
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: errorMessage,
                                life: 5000
                            });
                        }
                    });
                }
            }
        });
    }

    hideDialog(): void {
        this.sectorDialog = false;
        this.submitted = false;
    }

    saveSector(): void {
        this.submitted = true;

        if (this.sector.nombre?.trim()) {
            if (this.sector.id) {
                // Update - only send the fields that can be updated
                const updateDto: any = {
                    nombre: this.sector.nombre,
                    descripcion: this.sector.descripcion,
                    tipo: this.sector.tipo,
                    tipoEspacio: this.sector.tipoEspacio,
                    capacidadTotal: this.sector.capacidadTotal,
                    coordenadasGeo: this.sector.coordenadasGeo
                };
                this.sectoresService.update(this.sector.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Sector Actualizado', life: 3000 });
                        this.loadSectores();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating sector:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - only send the fields needed for creation
                const createDto: any = {
                    nombre: this.sector.nombre,
                    descripcion: this.sector.descripcion,
                    tipo: this.sector.tipo,
                    tipoEspacio: this.sector.tipoEspacio || 'nicho',
                    capacidadTotal: this.sector.capacidadTotal || 0,
                    coordenadasGeo: this.sector.coordenadasGeo
                };

                this.sectoresService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Sector Creado', life: 3000 });
                        this.loadSectores();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating sector:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la creación' });
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // UI Helpers
    getLibresCount(sector: Sector): number {
        if (!sector.espacios) return 0;
        return sector.espacios.filter(e => e.estado === 'LIBRE').length;
    }

    getOccupancyPercent(sector: Sector): number {
        if (!sector.capacidadTotal || !sector.espacios) return 0;
        const ocupados = sector.espacios.filter(e => e.estado !== 'LIBRE').length;
        return Math.round((ocupados / sector.capacidadTotal) * 100);
    }
}
