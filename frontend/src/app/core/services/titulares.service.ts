import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Titular {
    id: number;
    nombres: string;
    apellidos: string;
    dni?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TitularesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/titulares`;

    getAll(): Observable<Titular[]> {
        return this.http.get<Titular[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<Titular> {
        return this.http.get<Titular>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data: any): Observable<Titular> {
        return this.http.post<Titular>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    update(id: number, data: any): Observable<Titular> {
        return this.http.patch<Titular>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en TitularesService:', error);
        return throwError(() => error);
    }
}
