import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago, CreatePagoDto, UpdatePagoDto, ConceptoPago } from '../models/caja.model';

@Injectable({
    providedIn: 'root'
})
export class PagosService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/pagos`;

    getAll(): Observable<Pago[]> {
        return this.http.get<Pago[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Pago> {
        return this.http.get<Pago>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(data: CreatePagoDto): Observable<Pago> {
        return this.http.post<Pago>(this.apiUrl, data).pipe(catchError(this.handleError));
    }

    update(id: number, data: UpdatePagoDto): Observable<Pago> {
        return this.http.patch<Pago>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en PagosService:', error);
        return throwError(() => error);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ConceptosPagoService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/conceptos-pago`;

    getAll(): Observable<ConceptoPago[]> {
        return this.http.get<ConceptoPago[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<ConceptoPago> {
        return this.http.get<ConceptoPago>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en ConceptosPagoService:', error);
        return throwError(() => error);
    }
}
