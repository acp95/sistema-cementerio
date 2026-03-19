import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConceptoPago {
    id: number;
    nombre: string;
    descripcion?: string;
    monto: number;
    estado: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConceptosPagoService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/conceptos-pago`;

    getAll(includeInactive: boolean = false): Observable<ConceptoPago[]> {
        const params = includeInactive ? { includeInactive: 'true' } : undefined;
        return this.http.get<ConceptoPago[]>(this.apiUrl, { ...(params && { params }) }).pipe(
            catchError(this.handleError)
        );
    }

    getById(id: number): Observable<ConceptoPago> {
        return this.http.get<ConceptoPago>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data: any): Observable<ConceptoPago> {
        return this.http.post<ConceptoPago>(this.apiUrl, data).pipe(
            catchError(this.handleError)
        );
    }

    update(id: number, data: any): Observable<ConceptoPago> {
        return this.http.patch<ConceptoPago>(`${this.apiUrl}/${id}`, data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en ConceptosPagoService:', error);
        return throwError(() => error);
    }
}
