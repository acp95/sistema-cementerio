import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/usuarios`;

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(usuario: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, usuario);
    }

    update(id: number, usuario: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, usuario);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
