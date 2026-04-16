import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Espacio, CreateEspacioDto, UpdateEspacioDto } from '../models/infraestructura.model';

@Injectable({
    providedIn: 'root'
})
export class EspaciosService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/espacios`;

    /**
     * Obtener todos los espacios con filtros opcionales
     */
    getAll(filters?: { sectorId?: number; tipo?: string; estado?: string }): Observable<Espacio[]> {
        let params = new HttpParams();

        if (filters?.sectorId) {
            params = params.set('sectorId', filters.sectorId.toString());
        }
        if (filters?.tipo) {
            params = params.set('tipo', filters.tipo);
        }
        if (filters?.estado) {
            params = params.set('estado', filters.estado);
        }

        return this.http.get<Espacio[]>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtener un espacio por ID
     */
    getById(id: number): Observable<Espacio> {
        return this.http.get<Espacio>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Crear nuevo espacio
     */
    create(data: CreateEspacioDto): Observable<Espacio> {
        return this.http.post<Espacio>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Actualizar espacio existente
     */
    update(id: number, data: UpdateEspacioDto): Observable<Espacio> {
        return this.http.patch<Espacio>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Eliminar espacio
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtener mapa de nichos por sector
     */
    getMapaBySector(sectorId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/mapa-sector/${sectorId}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Reservar un espacio para un titular
     */
    reservar(id: number, titularId: number): Observable<Espacio> {
        return this.http.post<Espacio>(`${this.apiUrl}/${id}/reservar`, { titularId }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Manejar errores HTTP
     */
    private handleError(error: any): Observable<never> {
        console.error('Error en EspaciosService:', error);
        return throwError(() => error);
    }
}
