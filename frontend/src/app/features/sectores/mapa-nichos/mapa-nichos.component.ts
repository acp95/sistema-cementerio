import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EspaciosService } from '../../../core/services/espacios.service';
import { SectoresService } from '../../../core/services/sectores.service';
import { EspacioMapa, Sector } from '@/core/models/infraestructura.model';
import { MessageService } from 'primeng/api';
import { TitularesService, Titular } from '../../../core/services/titulares.service';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

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
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule
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
    private titularesService = inject(TitularesService);

    sectorId!: number;
    sector = signal<Sector | null>(null);
    espacios = signal<EspacioMapa[]>([]);
    matrix = signal<{fila: string, espacios: EspacioMapa[]}[]>([]);
    loading = signal<boolean>(true);

    // UI State
    activeFilter = signal<EstadoType | null>(null);
    viewMode = signal<ViewModeType>('normal');

    selectedEspacio: EspacioMapa | null = null;
    showDialog = false;

    // Reservation State
    showReservaDialog = false;
    titulares = signal<Titular[]>([]);
    filteredTitulares: Titular[] = [];
    selectedTitular: Titular | null = null;
    searchText = '';
    reserving = false;

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
                
                // Construir la matriz para el "Muro de Pabellon"
                const mapByFila = new Map<string, EspacioMapa[]>();
                data.forEach(espacio => {
                    const f = espacio.fila || 'Unica'; 
                    if (!mapByFila.has(f)) {
                        mapByFila.set(f, []);
                    }
                    mapByFila.get(f)!.push(espacio);
                });
                
                // Ordenar filas (generalmente la de más arriba es la última letra si se construyen de abajo hacia arriba)
                // Ordenamos alfabéticamente descendente para que D quede arriba y A abajo
                // Usamos ordenamiento natural para evitar que Fila 10 aparezca antes que Fila 2
                const matrixData = Array.from(mapByFila.keys())
                                      .sort((a,b) => b.localeCompare(a, undefined, { numeric: true })) 
                                      .map(f => {
                                          return {
                                              fila: f,
                                              espacios: mapByFila.get(f)!.sort((e1, e2) => (e1.columna || '0').localeCompare((e2.columna || '0'), undefined, { numeric: true }))
                                          }
                                      });
                this.matrix.set(matrixData);
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
        const label = espacio.numero || (espacio.fila && espacio.columna ? `${espacio.fila}-${espacio.columna}` : `#${espacio.id}`);
        if (espacio.tipoEspacio?.toLowerCase() === 'fosa') {
            return `F-${label}`;
        }
        return label;
    }

    // Reservation Methods
    openReservaDialog(): void {
        this.showDialog = false;
        this.selectedTitular = null;
        this.searchText = '';
        this.showReservaDialog = true;
        this.loadTitulares();
    }

    loadTitulares(): void {
        this.titularesService.getAll().subscribe({
            next: (data) => {
                this.titulares.set(data);
                this.filteredTitulares = data;
            }
        });
    }

    filterTitulares(): void {
        const query = this.searchText.toLowerCase();
        this.filteredTitulares = this.titulares().filter(t => 
            t.nombres.toLowerCase().includes(query) || 
            t.apellidos.toLowerCase().includes(query) || 
            t.dni?.includes(query)
        );
    }

    onSelectTitular(titular: Titular): void {
        this.selectedTitular = titular;
    }

    confirmarReserva(): void {
        if (!this.selectedEspacio || !this.selectedTitular) return;

        this.reserving = true;
        this.espaciosService.reservar(this.selectedEspacio.id, this.selectedTitular.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Nicho reservado correctamente'
                });
                this.showReservaDialog = false;
                this.reserving = false;
                this.selectedTitular = null;
                this.searchText = '';
                this.loadMapa(); // Recargar mapa para ver el cambio
            },
            error: (err) => {
                console.error('Error al reservar:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo completar la reserva'
                });
                this.reserving = false;
            }
        });
    }
}
