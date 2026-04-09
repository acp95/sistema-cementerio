import { Component, EventEmitter, Input, OnInit, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PermisosService, Permiso } from '../../../core/services/permisos.service';
import { RolesService } from '../../../core/services/roles.service';

interface Modulo {
    nombre: string;
    slug: string;
}

interface PermisoMatrix {
    modulo: Modulo;
    ver: boolean;
    crear: boolean;
    actualizar: boolean;
    eliminar: boolean;
    anular: boolean;
    revertir: boolean;
}

@Component({
    selector: 'app-role-permissions-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        TableModule,
        ToggleSwitchModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './role-permissions-dialog.component.html',
    styleUrl: './role-permissions-dialog.component.scss'
})
export class RolePermissionsDialogComponent implements OnInit {
    @Input() visible: boolean = false;
    @Input() rol: any = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<void>();

    private permisosService = inject(PermisosService);
    private rolesService = inject(RolesService);
    private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    permisos: Permiso[] = [];
    permisosMatrix: PermisoMatrix[] = [];
    loading: boolean = false;

    readonly MODULOS: Modulo[] = [
        { nombre: 'Dashboard', slug: 'dashboard' },
        { nombre: 'Difuntos', slug: 'difuntos' },
        { nombre: 'Inhumaciones', slug: 'inhumaciones' },
        { nombre: 'Titulares', slug: 'titulares' },
        { nombre: 'Sectores', slug: 'sectores' },
        { nombre: 'Espacios', slug: 'espacios' },
        { nombre: 'Pagos', slug: 'pagos' },
        { nombre: 'Conceptos de Pago', slug: 'conceptos' },
        { nombre: 'Usuarios', slug: 'usuarios' },
        { nombre: 'Roles', slug: 'roles' },
        { nombre: 'Permisos', slug: 'permisos' }
    ];

    readonly ACCIONES = ['ver', 'crear', 'actualizar', 'eliminar', 'anular', 'revertir_anulacion'];

    ngOnInit() {
        this.loadPermisos();
    }

    loadPermisos() {
        this.permisosService.getAll().subscribe({
            next: (data) => {
                this.permisos = data;
                if (this.rol) {
                    this.loadRolPermisos();
                }
            }
        });
    }

    loadRolPermisos() {
        if (!this.rol?.id) return;

        this.loading = true;
        this.rolesService.getByIdWithPermisos(this.rol.id).subscribe({
            next: (data) => {
                const permisosIds = data.permisosIds || [];
                this.buildMatrix(permisosIds);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.buildMatrix([]);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    buildMatrix(permisosIds: number[]) {
        this.permisosMatrix = this.MODULOS.map(modulo => {
            const getPermisoId = (accion: string): number | null => {
                const slug = `${accion}_${modulo.slug}`;
                const permiso = this.permisos.find(p => p.slug === slug);
                return permiso ? permiso.id : null;
            };

            const hasPermiso = (accion: string): boolean => {
                const id = getPermisoId(accion);
                return id !== null && permisosIds.includes(id);
            };

            return {
                modulo,
                ver: hasPermiso('ver'),
                crear: hasPermiso('crear'),
                actualizar: hasPermiso('actualizar'),
                eliminar: hasPermiso('eliminar'),
                anular: hasPermiso('anular'),
                revertir: hasPermiso('revertir_anulacion')
            };
        });
    }

    getSelectedPermisosIds(): number[] {
        const ids: number[] = [];

        this.permisosMatrix.forEach(row => {
            this.ACCIONES.forEach(accion => {
                const isSelected = (accion === 'revertir_anulacion') ? (row as any).revertir : (row as any)[accion];
                if (isSelected) {
                    const slug = `${accion}_${row.modulo.slug}`;
                    const permiso = this.permisos.find(p => p.slug === slug);
                    if (permiso) {
                        ids.push(permiso.id);
                    }
                }
            });
        });

        return ids;
    }

    save() {
        if (!this.rol?.id) return;

        this.loading = true;
        const permisosIds = this.getSelectedPermisosIds();

        this.rolesService.update(this.rol.id, { permisosIds }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Permisos actualizados correctamente'
                });
                this.loading = false;
                this.saved.emit();
                this.close();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron guardar los permisos'
                });
                this.loading = false;
            }
        });
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    onVisibleChange(value: boolean) {
        if (value && this.rol) {
            this.loadRolPermisos();
        }
    }

    hasPermisoInSystem(moduloSlug: string, accion: string): boolean {
        const slug = `${accion}_${moduloSlug}`;
        return this.permisos.some(p => p.slug === slug);
    }
}
