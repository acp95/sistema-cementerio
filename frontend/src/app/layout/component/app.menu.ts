import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../core/services/auth.service';

interface MenuItemWithPermission extends MenuItem {
    permission?: string;
    items?: MenuItemWithPermission[];
}

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of filteredModel; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    private authService = inject(AuthService);

    model: MenuItemWithPermission[] = [];
    filteredModel: MenuItemWithPermission[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'], permission: 'ver_dashboard' }]
            },
            {
                label: 'Gestión de Cementerio',
                items: [
                    { label: 'Mapa Interactivo', icon: 'pi pi-fw pi-map', routerLink: ['/sectores'], permission: 'ver_sectores' },
                    { label: 'Lista de Espacios', icon: 'pi pi-fw pi-list', routerLink: ['/espacios'], permission: 'ver_espacios' },
                    { label: 'Difuntos', icon: 'pi pi-fw pi-users', routerLink: ['/difuntos'], permission: 'ver_difuntos' },
                    { label: 'Titulares', icon: 'pi pi-fw pi-id-card', routerLink: ['/titulares'], permission: 'ver_titulares' },
                    { label: 'Inhumaciones', icon: 'pi pi-fw pi-box', routerLink: ['/inhumaciones'], permission: 'ver_inhumaciones' },
                    { label: 'Conceptos de Pago', icon: 'pi pi-fw pi-dollar', routerLink: ['/conceptos-pago'], permission: 'ver_conceptos_pago' },
                    { label: 'Caja - Pagos', icon: 'pi pi-fw pi-wallet', routerLink: ['/pagos'], permission: 'ver_pagos' }
                ]
            },
            {
                label: 'Seguridad',
                items: [
                    { label: 'Roles', icon: 'pi pi-fw pi-lock', routerLink: ['/roles'], permission: 'ver_roles' },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/usuarios'], permission: 'ver_usuarios' },
                    { label: 'Permisos', icon: 'pi pi-fw pi-key', routerLink: ['/permisos'], permission: 'ver_permisos' },
                    { label: 'Respaldos', icon: 'pi pi-fw pi-database', routerLink: ['/respaldos'], permission: 'ver_respaldos' }
                ]
            }
        ];

        this.filterMenuByPermissions();
    }

    private filterMenuByPermissions(): void {
        this.filteredModel = this.model
            .map(section => this.filterSection(section))
            .filter(section => section !== null) as MenuItemWithPermission[];
    }

    private filterSection(section: MenuItemWithPermission): MenuItemWithPermission | null {
        if (!section.items) {
            // Es un item simple, verificar permiso
            return this.hasPermission(section.permission) ? section : null;
        }

        // Filtrar items del section
        const filteredItems = section.items
            .map(item => this.filterSection(item))
            .filter(item => item !== null) as MenuItemWithPermission[];

        // Si no quedan items, ocultar la sección
        if (filteredItems.length === 0) {
            return null;
        }

        return {
            ...section,
            items: filteredItems
        };
    }

    private hasPermission(permission?: string): boolean {
        // Si no se requiere permiso, mostrar
        if (!permission) {
            return true;
        }
        return this.authService.hasPermission(permission);
    }
}
