import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, AuthResponse, Usuario } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'access_token';
    private readonly USER_KEY = 'current_user';
    private readonly PERMISSIONS_KEY = 'user_permissions';
    
    // Configuración de inactividad (10 minutos)
    private readonly INACTIVITY_TIME = 10 * 60 * 1000;
    private inactivityTimer: any;

    private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    // Signals para estado reactivo
    isAuthenticated = signal<boolean>(this.hasToken());
    currentUser = signal<Usuario | null>(this.getUserFromStorage());
    userPermissions = signal<string[]>(this.getPermissionsFromStorage());

    constructor() {
        // Verificar si hay un token al iniciar
        if (this.hasToken()) {
            this.loadUserFromStorage();
            this.initInactivityTimer();
        }
    }

    /**
     * Inicializar el temporizador de inactividad
     */
    private initInactivityTimer(): void {
        this.resetInactivityTimer();
        
        // Escuchar eventos de actividad del usuario
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => {
            window.addEventListener(event, () => this.resetInactivityTimer());
        });
    }

    /**
     * Reiniciar el temporizador
     */
    private resetInactivityTimer(): void {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        if (this.hasToken()) {
            this.inactivityTimer = setTimeout(() => {
                this.logout();
                // Opcional: Recargar la página o mostrar mensaje
                location.reload(); 
            }, this.INACTIVITY_TIME);
        }
    }

    /**
     * Realizar login
     */
    login(credentials: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.handleAuthResponse(response);
                this.initInactivityTimer();
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Registrar nuevo usuario
     */
    register(userData: RegisterDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                this.handleAuthResponse(response);
                this.initInactivityTimer();
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Cerrar sesión
     */
    logout(): void {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
        sessionStorage.removeItem(this.PERMISSIONS_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.userPermissions.set([]);
        this.router.navigate(['/login']);
    }

    /**
     * Obtener token actual
     */
    getToken(): string | null {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Verificar si hay token
     */
    hasToken(): boolean {
        return !!this.getToken();
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser(): Usuario | null {
        return this.currentUserSubject.value;
    }

    /**
     * Verificar si el usuario tiene un permiso específico
     */
    hasPermission(permission: string): boolean {
        const permissions = this.userPermissions();
        return permissions.includes(permission);
    }

    /**
     * Verificar si el usuario tiene alguno de los permisos
     */
    hasAnyPermission(permissions: string[]): boolean {
        const userPerms = this.userPermissions();
        return permissions.some(p => userPerms.includes(p));
    }

    /**
     * Verificar si el usuario tiene todos los permisos
     */
    hasAllPermissions(permissions: string[]): boolean {
        const userPerms = this.userPermissions();
        return permissions.every(p => userPerms.includes(p));
    }

    /**
     * Obtener todos los permisos del usuario
     */
    getPermissions(): string[] {
        return this.userPermissions();
    }

    /**
     * Manejar respuesta de autenticación
     */
    private handleAuthResponse(response: AuthResponse): void {
        sessionStorage.setItem(this.TOKEN_KEY, response.access_token);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

        // Guardar permisos
        const permisos = (response.user as any).permisos || [];
        sessionStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permisos));

        this.currentUserSubject.next(response.user);
        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
        this.userPermissions.set(permisos);
    }

    /**
     * Cargar usuario desde sessionStorage
     */
    private loadUserFromStorage(): void {
        const user = this.getUserFromStorage();
        const permissions = this.getPermissionsFromStorage();
        if (user) {
            this.currentUserSubject.next(user);
            this.isAuthenticated.set(true);
            this.currentUser.set(user);
            this.userPermissions.set(permissions);
        }
    }

    /**
     * Obtener usuario de sessionStorage
     */
    private getUserFromStorage(): Usuario | null {
        const userJson = sessionStorage.getItem(this.USER_KEY);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch {
                return null;
            }
        }
        return null;
    }

    /**
     * Obtener permisos de sessionStorage
     */
    private getPermissionsFromStorage(): string[] {
        const permissionsJson = sessionStorage.getItem(this.PERMISSIONS_KEY);
        if (permissionsJson) {
            try {
                return JSON.parse(permissionsJson);
            } catch {
                return [];
            }
        }
        return [];
    }

    /**
     * Manejar errores HTTP
     */
    private handleError(error: any): Observable<never> {
        console.error('Error en AuthService:', error);
        return throwError(() => error);
    }
}
