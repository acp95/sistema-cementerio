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
import { ChartModule } from 'primeng/chart';

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
        SkeletonModule,
        ChartModule
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

    occupancyChartData = signal<any>({});
    occupancyChartOptions = signal<any>({});
    
    revenueChartData = signal<any>({});
    revenueChartOptions = signal<any>({});

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

            this.initCharts(espaciosOcupados, espaciosDisponibles, pagos || []);

            this.loading.set(false);
        }).catch(error => {
            console.error('Error cargando datos del dashboard:', error);
            this.loading.set(false);
        });
    }

    initCharts(ocupados: number, libres: number, pagos: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        // Occupancy Chart
        this.occupancyChartData.set({
            labels: ['Ocupados', 'Disponibles'],
            datasets: [
                {
                    data: [ocupados, libres],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-red-500') || '#ef4444', 
                        documentStyle.getPropertyValue('--p-green-500') || '#10b981'
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--p-red-400') || '#f87171', 
                        documentStyle.getPropertyValue('--p-green-400') || '#34d399'
                    ]
                }
            ]
        });

        this.occupancyChartOptions.set({
            cutout: '60%',
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            }
        });

        // Revenue Chart (Group by month naively)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentMonth = new Date().getMonth();
        const labels = [];
        const data = [0, 0, 0, 0, 0, 0];
        
        for (let i = 5; i >= 0; i--) {
            let m = currentMonth - i;
            if (m < 0) m += 12;
            labels.push(meses[m]);
        }

        // Aggregate pagos
        if (pagos && pagos.length > 0) {
            pagos.forEach(p => {
                const date = new Date(p.fechaPago);
                const m = date.getMonth();
                const mIndex = (m - currentMonth + 5) % 12; // naive check
                if (mIndex >= 0 && mIndex <= 5 && (new Date().getTime() - date.getTime()) < 1000*60*60*24*30*6) {
                    data[mIndex] += Number(p.montoTotal);
                }
            });
        }

        this.revenueChartData.set({
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos (S/)',
                    data: data,
                    fill: true,
                    borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#3b82f6',
                    tension: 0.4,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                }
            ]
        });

        this.revenueChartOptions.set({
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, drawBorder: false }
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, drawBorder: false }
                }
            }
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

    getInitials(nombres: string, apellidos: string): string {
        if (!nombres && !apellidos) return 'T';
        const n = (nombres || '').trim().charAt(0);
        const a = (apellidos || '').trim().charAt(0);
        return (n + a).toUpperCase() || 'T';
    }
}

