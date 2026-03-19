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
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { RolesService } from '../../../core/services/roles.service';
import { PermisosService, Permiso } from '../../../core/services/permisos.service';
import { AuthService } from '../../../core/services/auth.service';
import { RolePermissionsDialogComponent } from '../role-permissions-dialog/role-permissions-dialog.component';

@Component({
    selector: 'app-roles-list',
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
        TextareaModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        MultiSelectModule,
        RolePermissionsDialogComponent
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './roles-list.component.html'
})
export class RolesListComponent implements OnInit {
    private rolesService = inject(RolesService);
    private permisosService = inject(PermisosService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    roles: any[] = [];
    rolDialog: boolean = false;
    rol: any = {};
    submitted: boolean = false;

    // Permissions
    permisosDisponibles: Permiso[] = [];
    permisosSeleccionados: number[] = [];

    // Matrix Permissions Dialog
    permissionsDialogVisible: boolean = false;
    selectedRolForPermissions: any = null;

    @ViewChild('dt') dt!: Table;

    ngOnInit() {
        this.loadRoles();
        this.loadPermisos();
    }

    loadRoles() {
        this.rolesService.getAll().subscribe({
            next: (data) => {
                this.roles = [...data];
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading roles:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles' });
            }
        });
    }

    loadPermisos() {
        this.permisosService.getAll().subscribe({
            next: (data) => {
                this.permisosDisponibles = data;
            },
            error: (error) => {
                console.error('Error loading permisos:', error);
            }
        });
    }

    openNew() {
        this.rol = { activo: true };
        this.permisosSeleccionados = [];
        this.submitted = false;
        this.rolDialog = true;
    }

    editRol(rol: any) {
        this.rol = { ...rol };
        this.permisosSeleccionados = [];

        // Load current permissions for this role
        this.rolesService.getByIdWithPermisos(rol.id).subscribe({
            next: (data) => {
                this.permisosSeleccionados = data.permisosIds || [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading role permissions:', err);
            }
        });

        this.rolDialog = true;
    }

    deleteRol(rol: any) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este rol?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (rol.id) {
                    this.rolesService.delete(rol.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Eliminado', life: 3000 });
                            this.loadRoles();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el rol' });
                        }
                    });
                }
            }
        });
    }

    hideDialog() {
        this.rolDialog = false;
        this.submitted = false;
    }

    saveRol() {
        this.submitted = true;

        if (this.rol.nombre?.trim()) {
            if (this.rol.id) {
                // Update - include permisosIds
                const updateDto: any = {
                    nombre: this.rol.nombre,
                    descripcion: this.rol.descripcion,
                    activo: this.rol.activo,
                    permisosIds: this.permisosSeleccionados
                };
                this.rolesService.update(this.rol.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Actualizado', life: 3000 });
                        this.loadRoles();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating rol:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                // Create - include permisosIds
                const createDto: any = {
                    nombre: this.rol.nombre,
                    descripcion: this.rol.descripcion,
                    activo: this.rol.activo !== undefined ? this.rol.activo : true,
                    permisosIds: this.permisosSeleccionados
                };
                this.rolesService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Rol Creado', life: 3000 });
                        this.loadRoles();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating rol:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la creación' });
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openPermissionsDialog(rol: any) {
        this.selectedRolForPermissions = rol;
        this.permissionsDialogVisible = true;
    }
}
