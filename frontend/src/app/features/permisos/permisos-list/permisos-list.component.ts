import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PermisosService, Permiso } from '../../../core/services/permisos.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-permisos-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './permisos-list.component.html'
})
export class PermisosListComponent implements OnInit {
    private permisosService = inject(PermisosService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    permisos: Permiso[] = [];
    permisoDialog: boolean = false;
    permiso: Partial<Permiso> = {};
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    ngOnInit() {
        this.loadPermisos();
    }

    loadPermisos() {
        this.permisosService.getAll().subscribe({
            next: (data) => {
                this.permisos = [...data];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading permisos:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los permisos' });
            }
        });
    }

    openNew() {
        this.permiso = {};
        this.submitted = false;
        this.permisoDialog = true;
    }

    editPermiso(permiso: Permiso) {
        this.permiso = { ...permiso };
        this.permisoDialog = true;
    }

    deletePermiso(permiso: Permiso) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este permiso?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (permiso.id) {
                    this.permisosService.delete(permiso.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Permiso Eliminado', life: 3000 });
                            this.loadPermisos();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el permiso' });
                        }
                    });
                }
            }
        });
    }

    hideDialog() {
        this.permisoDialog = false;
        this.submitted = false;
    }

    savePermiso() {
        this.submitted = true;

        if (this.permiso.slug?.trim()) {
            if (this.permiso.id) {
                // Update
                this.permisosService.update(this.permiso.id, {
                    slug: this.permiso.slug,
                    descripcion: this.permiso.descripcion
                }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Permiso Actualizado', life: 3000 });
                        this.loadPermisos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating permiso:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create
                this.permisosService.create({
                    slug: this.permiso.slug,
                    descripcion: this.permiso.descripcion
                }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Permiso Creado', life: 3000 });
                        this.loadPermisos();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating permiso:', err);
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
