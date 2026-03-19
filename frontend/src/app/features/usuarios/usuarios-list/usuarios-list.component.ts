import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RolesService } from '../../../core/services/roles.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, tap, catchError, of } from 'rxjs';

@Component({
    selector: 'app-usuarios-list',
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
        SelectModule,
        TagModule,
        PasswordModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './usuarios-list.component.html'
})
export class UsuariosListComponent implements OnInit {
    private usuariosService = inject(UsuariosService);
    private rolesService = inject(RolesService);
    public authService = inject(AuthService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    usuarios: any[] = [];
    roles: any[] = [];

    usuarioDialog: boolean = false;
    usuario: any = {};
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    ngOnInit() {
        this.loadUsuarios();
        this.loadRoles();
    }

    loadUsuarios() {
        this.usuariosService.getAll().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.cdr.detectChanges();
                console.log('Usuarios loaded:', data.length);
            },
            error: (error) => {
                console.error('Error loading usuarios:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
            }
        });
    }

    loadRoles() {
        this.rolesService.getAll().subscribe({
            next: (data) => this.roles = data,
            error: (error) => console.error('Error loading roles:', error)
        });
    }

    openNew() {
        this.usuario = { activo: true };
        this.submitted = false;
        this.usuarioDialog = true;
    }

    editUsuario(usuario: any) {
        this.usuario = { ...usuario };
        // Map nested object to ID for p-select
        if (this.usuario.rol) this.usuario.rolId = this.usuario.rol.id;

        // Don't send password hash back in edits usually, but backend handles partial updates hopefully
        this.usuarioDialog = true;
    }

    deleteUsuario(usuario: any) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar este usuario?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (usuario.id) {
                    this.usuariosService.delete(usuario.id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Eliminado', life: 3000 });
                            this.loadUsuarios();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
                        }
                    });
                }
            }
        });
    }

    hideDialog() {
        this.usuarioDialog = false;
        this.submitted = false;
    }

    saveUsuario() {
        this.submitted = true;

        if (this.usuario.username?.trim() && this.usuario.rolId) {
            if (this.usuario.id) {
                // Update - only send the fields that can be updated
                const updateDto: any = {
                    username: this.usuario.username,
                    rolId: this.usuario.rolId,
                    nombreCompleto: this.usuario.nombreCompleto,
                    email: this.usuario.email,
                    activo: this.usuario.activo
                };
                // Only include password if provided
                if (this.usuario.password?.trim()) {
                    updateDto.password = this.usuario.password;
                }
                this.usuariosService.update(this.usuario.id, updateDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Actualizado', life: 3000 });
                        this.loadUsuarios();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error updating usuario:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
                    }
                });
            } else {
                if (!this.usuario.password) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Contraseña requerida para nuevo usuario' });
                    return;
                }
                // Create - only send the fields needed for creation
                const createDto: any = {
                    username: this.usuario.username,
                    password: this.usuario.password,
                    rolId: this.usuario.rolId,
                    nombreCompleto: this.usuario.nombreCompleto,
                    email: this.usuario.email,
                    activo: this.usuario.activo !== undefined ? this.usuario.activo : true
                };
                this.usuariosService.create(createDto).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Usuario Creado', life: 3000 });
                        this.loadUsuarios();
                        this.hideDialog();
                    },
                    error: (err) => {
                        console.error('Error creating usuario:', err);
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
