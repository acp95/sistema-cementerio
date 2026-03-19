import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Difunto {
    id: number;
    nombres: string;
    apellidos: string;
    dni?: string;
    fechaNacimiento: Date;
    fechaDefuncion: Date;
    lugarNacimiento?: string;
    lugarDefuncion?: string;
    causaMuerte?: string;
    sexo: string;
}

@Injectable({
    providedIn: 'root'
})
export class DifuntosService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/difuntos`;

    getAll(): Observable<Difunto[]> {
        return this.http.get<Difunto[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<Difunto> {
        return this.http.get<Difunto>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data: any): Observable<Difunto> {
        return this.http.post<Difunto>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    update(id: number, data: any): Observable<Difunto> {
        return this.http.patch<Difunto>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en DifuntosService:', error);
        return throwError(() => error);
    }
}
