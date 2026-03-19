import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EspaciosService } from '../../../core/services/espacios.service';
import { SectoresService } from '../../../core/services/sectores.service';
import { EspacioMapa, Sector } from '@/core/models/infraestructura.model';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

type EstadoType = 'LIBRE' | 'OCUPADO' | 'MANTENIMIENTO' | 'RESERVADO';
type ViewModeType = 'normal' | 'compact';

@Component({
    selector: 'app-mapa-nichos',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        TooltipModule,
        TagModule,
        ProgressSpinnerModule,
    ],
    providers: [MessageService],
    templateUrl: './mapa-nichos.component.html',
    styleUrls: ['./mapa-nichos.component.scss']
})
export class MapaNichosComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private espaciosService = inject(EspaciosService);
    private sectoresService = inject(SectoresService);
    private messageService = inject(MessageService);

    sectorId!: number;
    sector = signal<Sector | null>(null);
    espacios = signal<EspacioMapa[]>([]);
    loading = signal<boolean>(true);

    // UI State
    activeFilter = signal<EstadoType | null>(null);
    viewMode = signal<ViewModeType>('normal');

    selectedEspacio: EspacioMapa | null = null;
    showDialog = false;

    ngOnInit(): void {
        this.sectorId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadSector();
        this.loadMapa();
    }

    loadSector(): void {
        this.sectoresService.getById(this.sectorId).subscribe({
            next: (data) => this.sector.set(data),
            error: (error) => {
                console.error('Error loading sector:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el sector'
                });
            }
        });
    }

    loadMapa(): void {
        this.loading.set(true);
        this.espaciosService.getMapaBySector(this.sectorId).subscribe({
            next: (data) => {
                this.espacios.set(data);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Error loading mapa:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el mapa de nichos'
                });
                this.loading.set(false);
            }
        });
    }

    // Estadísticas
    getCountByEstado(estado: EstadoType): number {
        return this.espacios().filter(e => e.estado === estado).length;
    }

    // Filtros
    toggleFilter(estado: EstadoType): void {
        if (this.activeFilter() === estado) {
            this.activeFilter.set(null);
        } else {
            this.activeFilter.set(estado);
        }
    }

    // Vista
    setViewMode(mode: ViewModeType): void {
        this.viewMode.set(mode);
    }

    // Helpers
    getEstadoSeverity(estado: string): 'success' | 'danger' | 'warn' | 'info' {
        switch (estado) {
            case 'LIBRE':
                return 'success';
            case 'OCUPADO':
                return 'danger';
            case 'MANTENIMIENTO':
                return 'warn';
            case 'RESERVADO':
                return 'info';
            default:
                return 'info';
        }
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'LIBRE':
                return 'libre';
            case 'OCUPADO':
                return 'ocupado';
            case 'MANTENIMIENTO':
                return 'mantenimiento';
            case 'RESERVADO':
                return 'reservado';
            default:
                return '';
        }
    }

    getIconClass(estado: string): string {
        switch (estado) {
            case 'LIBRE':
                return 'pi-check-circle';
            case 'OCUPADO':
                return 'pi-user';
            case 'MANTENIMIENTO':
                return 'pi-wrench';
            case 'RESERVADO':
                return 'pi-lock';
            default:
                return 'pi-circle';
        }
    }

    getTooltipText(espacio: EspacioMapa): string {
        if (espacio.ocupante) {
            return `${espacio.ocupante.difunto}`;
        }
        return `Nicho ${this.getNichoLabel(espacio)} - ${espacio.estado}`;
    }

    onNichoClick(espacio: EspacioMapa): void {
        this.selectedEspacio = espacio;
        this.showDialog = true;
    }

    goBack(): void {
        this.router.navigate(['/sectores']);
    }

    getNichoLabel(espacio: EspacioMapa): string {
        if (espacio.numero) return espacio.numero;
        if (espacio.fila && espacio.columna) return `${espacio.fila}-${espacio.columna}`;
        return `#${espacio.id}`;
    }
}
