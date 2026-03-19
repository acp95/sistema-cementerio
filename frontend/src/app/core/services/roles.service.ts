import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RolesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/roles`;

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(rol: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, rol);
    }

    update(id: number, rol: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, rol);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getByIdWithPermisos(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}/with-permisos`);
    }

    getPermisosByRol(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${id}/permisos`);
    }
}
