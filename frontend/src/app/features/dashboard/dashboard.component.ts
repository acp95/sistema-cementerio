import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SectoresService } from '../../core/services/sectores.service';
import { EspaciosService } from '../../core/services/espacios.service';
import { PagosService } from '../../core/services/caja.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

interface Stats {
    totalEspacios: number;
    espaciosOcupados: number;
    espaciosDisponibles: number;
    totalSectores: number;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TableModule,
        TagModule,
        SkeletonModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private sectoresService = inject(SectoresService);
    private espaciosService = inject(EspaciosService);
    private pagosService = inject(PagosService);
    private router = inject(Router);

    currentUser = this.authService.currentUser;
    loading = signal(true);
    stats = signal<Stats>({
        totalEspacios: 0,
        espaciosOcupados: 0,
        espaciosDisponibles: 0,
        totalSectores: 0
    });

    recentPayments = signal<any[]>([]);

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading.set(true);

        // Cargar estadísticas
        Promise.all([
            this.sectoresService.getAll().toPromise(),
            this.espaciosService.getAll().toPromise(),
            this.pagosService.getAll().toPromise()
        ]).then(([sectores, espacios, pagos]) => {
            const totalEspacios = espacios?.length || 0;
            const espaciosOcupados = espacios?.filter(e => e.estado === 'OCUPADO').length || 0;
            const espaciosDisponibles = espacios?.filter(e => e.estado === 'LIBRE').length || 0;

            this.stats.set({
                totalEspacios,
                espaciosOcupados,
                espaciosDisponibles,
                totalSectores: sectores?.length || 0
            });

            // Obtener últimos 5 pagos
            this.recentPayments.set((pagos || []).slice(0, 5));

            this.loading.set(false);
        }).catch(error => {
            console.error('Error cargando datos del dashboard:', error);
            this.loading.set(false);
        });
    }

    logout(): void {
        this.authService.logout();
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    getOccupancyPercentage(): number {
        const stats = this.stats();
        if (stats.totalEspacios === 0) return 0;
        return Math.round((stats.espaciosOcupados / stats.totalEspacios) * 100);
    }
}
