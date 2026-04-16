import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Inhumacion {
    id: number;
    difuntoId: number;
    espacioId: number;
    fechaInhumacion: Date;
    numeroActa?: string;
    observaciones?: string;
    difunto?: any;
    espacio?: any;
}

@Injectable({
    providedIn: 'root'
})
export class InhumacionesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/inhumaciones`;

    getAll(): Observable<Inhumacion[]> {
        return this.http.get<Inhumacion[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<Inhumacion> {
        return this.http.get<Inhumacion>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data: any): Observable<Inhumacion> {
        return this.http.post<Inhumacion>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    update(id: number, data: any): Observable<Inhumacion> {
        return this.http.patch<Inhumacion>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    anular(id: number): Observable<Inhumacion> {
        return this.http.patch<Inhumacion>(`${this.apiUrl}/${id}/anular`, {}).pipe(
            catchError(this.handleError)
        );
    }

    revertirAnulacion(id: number): Observable<Inhumacion> {
        return this.http.patch<Inhumacion>(`${this.apiUrl}/${id}/revertir-anulacion`, {}).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(error: any): Observable<never> {
        console.error('Error en InhumacionesService:', error);
        return throwError(() => error);
    }
}
