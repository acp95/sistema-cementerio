import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sector, CreateSectorDto, UpdateSectorDto } from '../models/infraestructura.model';

@Injectable({
    providedIn: 'root'
})
export class SectoresService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/sectores`;

    /**
     * Obtener todos los sectores
     */
    getAll(): Observable<Sector[]> {
        return this.http.get<Sector[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Obtener un sector por ID
     */
    getById(id: number): Observable<Sector> {
        return this.http.get<Sector>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Crear nuevo sector
     */
    create(data: CreateSectorDto): Observable<Sector> {
        return this.http.post<Sector>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Actualizar sector existente
     */
    update(id: number, data: UpdateSectorDto): Observable<Sector> {
        return this.http.patch<Sector>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Eliminar sector
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Manejar errores HTTP
     */
    private handleError(error: any): Observable<never> {
        console.error('Error en SectoresService:', error);
        return throwError(() => error);
    }
}
