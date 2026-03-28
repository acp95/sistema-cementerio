import { Injectable } from '@angular/core';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export interface ExportColumn {
    header: string;
    dataKey: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    exportExcel(data: any[], filename: string) {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsFile(excelBuffer, filename, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8');
    }

    exportPdf(columns: ExportColumn[], data: any[], filename: string, title?: string) {
        const doc = new jsPDF('portrait', 'pt', 'a4');
        
        if (title) {
            doc.setFontSize(18);
            doc.text(title, 40, 40);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 40, 55);
        }

        const mappedData = data.map(item => {
            const row: any = {};
            columns.forEach(col => {
                row[col.dataKey] = this.resolvePath(item, col.dataKey) ?? '-';
            });
            return row;
        });

        autoTable(doc, {
            columns: columns.map(c => ({ header: c.header, dataKey: c.dataKey })),
            body: mappedData,
            startY: title ? 70 : 40,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 3 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        const pdfBuffer = doc.output('arraybuffer');
        this.saveAsFile(pdfBuffer, filename, 'pdf', 'application/pdf');
    }

    private saveAsFile(buffer: any, fileName: string, extension: string, type: string): void {
        const data: Blob = new Blob([buffer], { type: type });
        saveAs(data, `${fileName}.${extension}`);
    }

    private resolvePath(object: any, path: string): any {
        return path.split('.').reduce((o, i) => (o !== undefined && o !== null ? o[i] : undefined), object);
    }
}
