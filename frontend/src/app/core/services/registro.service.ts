import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Titular, CreateTitularDto, UpdateTitularDto, Difunto, CreateDifuntoDto, UpdateDifuntoDto, Inhumacion, CreateInhumacionDto, UpdateInhumacionDto } from '../models/registro.model';

@Injectable({
    providedIn: 'root'
})
export class TitularesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/titulares`;

    getAll(): Observable<Titular[]> {
        return this.http.get<Titular[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Titular> {
        return this.http.get<Titular>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(data: CreateTitularDto): Observable<Titular> {
        return this.http.post<Titular>(this.apiUrl, data).pipe(catchError(this.handleError));
    }

    update(id: number, data: UpdateTitularDto): Observable<Titular> {
        return this.http.patch<Titular>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en TitularesService:', error);
        return throwError(() => error);
    }
}

@Injectable({
    providedIn: 'root'
})
export class DifuntosService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/difuntos`;

    getAll(): Observable<Difunto[]> {
        return this.http.get<Difunto[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Difunto> {
        return this.http.get<Difunto>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(data: CreateDifuntoDto): Observable<Difunto> {
        return this.http.post<Difunto>(this.apiUrl, data).pipe(catchError(this.handleError));
    }

    update(id: number, data: UpdateDifuntoDto): Observable<Difunto> {
        return this.http.patch<Difunto>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en DifuntosService:', error);
        return throwError(() => error);
    }
}

@Injectable({
    providedIn: 'root'
})
export class InhumacionesService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/inhumaciones`;

    getAll(): Observable<Inhumacion[]> {
        return this.http.get<Inhumacion[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Inhumacion> {
        return this.http.get<Inhumacion>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(data: CreateInhumacionDto): Observable<Inhumacion> {
        return this.http.post<Inhumacion>(this.apiUrl, data).pipe(catchError(this.handleError));
    }

    update(id: number, data: UpdateInhumacionDto): Observable<Inhumacion> {
        return this.http.patch<Inhumacion>(`${this.apiUrl}/${id}`, data).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any): Observable<never> {
        console.error('Error en InhumacionesService:', error);
        return throwError(() => error);
    }
}
