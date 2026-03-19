import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Permiso {
    id: number;
    slug: string;
    descripcion: string;
}

@Injectable({
    providedIn: 'root'
})
export class PermisosService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/permisos`;

    getAll(): Observable<Permiso[]> {
        return this.http.get<Permiso[]>(this.apiUrl);
    }

    getById(id: number): Observable<Permiso> {
        return this.http.get<Permiso>(`${this.apiUrl}/${id}`);
    }

    create(permiso: Partial<Permiso>): Observable<Permiso> {
        return this.http.post<Permiso>(this.apiUrl, permiso);
    }

    update(id: number, permiso: Partial<Permiso>): Observable<Permiso> {
        return this.http.patch<Permiso>(`${this.apiUrl}/${id}`, permiso);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
