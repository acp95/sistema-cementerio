import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/backup`;

    downloadBackup(): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download`, {
            responseType: 'blob'
        });
    }

    // Método auxiliar para descargar archivos del navegador
    saveFile(blob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}
