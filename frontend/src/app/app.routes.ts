import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppLayout } from './layout/component/app.layout';

// Core pages
import { Notfound } from './pages/notfound/notfound';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'notfound',
        component: Notfound
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes')
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            // Gestión de Cementerio
            {
                path: 'sectores',
                loadComponent: () => import('./features/sectores/sectores-list/sectores-list.component').then(m => m.SectoresListComponent)
            },
            {
                path: 'sectores/:id/mapa',
                loadComponent: () => import('./features/sectores/mapa-nichos/mapa-nichos.component').then(m => m.MapaNichosComponent)
            },
            {
                path: 'espacios',
                loadComponent: () => import('./features/espacios/espacios-list/espacios-list.component').then(m => m.EspaciosListComponent)
            },
            {
                path: 'difuntos',
                loadComponent: () => import('./features/difuntos/difuntos-list/difuntos-list.component').then(m => m.DifuntosListComponent)
            },
            {
                path: 'titulares',
                loadComponent: () => import('./features/titulares/titulares-list/titulares-list.component').then(m => m.TitularesListComponent)
            },
            {
                path: 'inhumaciones',
                loadComponent: () => import('./features/inhumaciones/inhumaciones-list/inhumaciones-list.component').then(m => m.InhumacionesListComponent)
            },
            // Caja
            {
                path: 'conceptos-pago',
                loadComponent: () => import('./features/conceptos-pago/conceptos-list/conceptos-list.component').then(m => m.ConceptosListComponent)
            },
            {
                path: 'pagos',
                loadComponent: () => import('./features/pagos/pagos-list/pagos-list.component').then(m => m.PagosListComponent)
            },
            // Seguridad
            {
                path: 'roles',
                loadComponent: () => import('./features/roles/roles-list/roles-list.component').then(m => m.RolesListComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./features/usuarios/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent)
            },
            {
                path: 'permisos',
                loadComponent: () => import('./features/permisos/permisos-list/permisos-list.component').then(m => m.PermisosListComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];
