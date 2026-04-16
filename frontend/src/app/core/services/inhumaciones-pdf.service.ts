import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';

@Injectable()
export class InhumacionesPdfService {
    constructor(private messageService: MessageService) {}

    imprimirConstancia(inhumacion: any): void {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = 15;

        // --- Watermark ---
        doc.setTextColor(240, 240, 240); // Very light gray
        doc.setFontSize(80);
        doc.setFont('helvetica', 'bold');
        doc.saveGraphicsState();
        doc.setCurrentTransformationMatrix(doc.Matrix(1, -1, 1, 1, 0, 0)); // Approx 45 deg
        doc.text('MUNICIPAL', 40, 20);
        doc.restoreGraphicsState();

        // Reset text color and font for content
        doc.setTextColor(0, 0, 0);
        
        // --- Header ---
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        doc.text('MUNICIPALIDAD C.P. CHEN CHEN', pageWidth / 2, y, { align: 'center' });
        y += 6;
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.text('Cementerio Municipal', pageWidth / 2, y, { align: 'center' });
        y += 4;
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 30, y, pageWidth / 2 + 30, y);
        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text('RUC: 20123456789 | Av. Principal S/N - Chen Chen, Moquegua', pageWidth / 2, y, { align: 'center' });
        y += 15;

        // --- Document Title ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('times', 'bold');
        doc.text('CONSTANCIA DE INHUMACIÓN', pageWidth / 2, y, { align: 'center' });
        // Underline
        const titleWidth = doc.getTextWidth('CONSTANCIA DE INHUMACIÓN');
        doc.line(pageWidth / 2 - titleWidth / 2, y + 1, pageWidth / 2 + titleWidth / 2, y + 1);
        y += 15;

        // --- Legal Text ---
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        const legalText = 'A solicitud de la parte interesada, por medio del presente documento se hace constar que en los registros de este Cementerio Municipal figura inscrita la siguiente información:';
        const splitLegal = doc.splitTextToSize(legalText, contentWidth);
        doc.text(splitLegal, margin, y);
        y += (splitLegal.length * 6) + 5;

        // Helper to draw section header
        const drawSectionHeader = (title: string, yPos: number) => {
            doc.setFillColor(230, 230, 230);
            doc.rect(margin, yPos, contentWidth, 7, 'F');
            doc.setDrawColor(0);
            doc.rect(margin, yPos, contentWidth, 7, 'S');
            doc.setFont('times', 'bold');
            doc.setFontSize(10);
            doc.text(title, margin + 3, yPos + 5);
            return yPos + 10;
        };

        // Helper to draw data row with dotted line
        const drawDataRow = (label: string, value: string, yPos: number, isBold: boolean = false) => {
            doc.setFont('times', 'bold');
            doc.setFontSize(10.5);
            doc.text(label, margin + 2, yPos);
            
            const labelWidth = doc.getTextWidth(label);
            const startX = margin + 5 + 40; // Fixed start for values
            
            doc.setFont('times', isBold ? 'bold' : 'normal');
            doc.text(String(value), startX, yPos);
            
            // Dotted line
            doc.setDrawColor(150);
            doc.setLineDashPattern([0.5, 0.5], 0);
            doc.line(startX, yPos + 1, margin + contentWidth - 2, yPos + 1);
            doc.setLineDashPattern([], 0);
            doc.setDrawColor(0);
            
            return yPos + 7;
        };

        // --- Section I: DATOS DEL DIFUNTO ---
        y = drawSectionHeader('I. DATOS DEL DIFUNTO', y);
        const difuntoNombre = inhumacion.difunto ? `${inhumacion.difunto.nombres} ${inhumacion.difunto.apellidos}` : 'No especificado';
        y = drawDataRow('NOMBRES Y APELLIDOS:', difuntoNombre, y);
        y = drawDataRow('DOCUMENTO IDENTIDAD:', inhumacion.difunto?.dni || '-', y);
        y = drawDataRow('Nº ACTA DEFUNCIÓN:', inhumacion.numeroActa || 'No Registrada', y);
        y += 5;

        // --- Section II: DATOS DE LA INHUMACIÓN ---
        y = drawSectionHeader('II. DATOS DE LA INHUMACIÓN', y);
        const numeroInhumacion = `Nº ${String(inhumacion.id).padStart(5, '0')}`;
        y = drawDataRow('Nº DE INHUMACIÓN:', numeroInhumacion, y, true);
        const fechaInh = new Date(inhumacion.fechaInhumacion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
        y = drawDataRow('FECHA DE INHUMACIÓN:', fechaInh, y);
        y = drawDataRow('HORA:', inhumacion.horaInhumacion || '--:--', y);
        y = drawDataRow('TIPO DE CONCESIÓN:', inhumacion.tipoConcesion || 'TEMPORAL', y);
        
        let estadoPago = 'POR PAGAR';
        if (inhumacion.pagos && inhumacion.pagos.length > 0) {
            estadoPago = inhumacion.pagos.some((p: any) => p.estado === 'PAGADO') ? 'PAGADO' : 'PENDIENTE';
        }
        y = drawDataRow('ESTADO DE PAGO:', estadoPago, y, true);
        y += 5;

        // --- Section III: UBICACIÓN DEL RESTO MORTAL ---
        y = drawSectionHeader('III. UBICACIÓN DEL RESTO MORTAL', y);
        y = drawDataRow('CÓDIGO / PABELLÓN:', inhumacion.espacio?.codigo || '-', y);
        y = drawDataRow('TIPO DE ESPACIO:', inhumacion.espacio?.tipoEspacio || '-', y);
        
        let ubicacionDetallada = '-';
        if (inhumacion.espacio) {
            const e = inhumacion.espacio;
            const p = [];
            if (e.sector?.nombre) p.push(`Sector: ${e.sector.nombre}`);
            if (e.fila) p.push(`Fila: ${e.fila}`);
            if (e.columna) p.push(`Col: ${e.columna}`);
            if (e.numero) p.push(`N°: ${e.numero}`);
            ubicacionDetallada = p.length > 0 ? p.join(', ') : '-';
        }
        y = drawDataRow('UBICACIÓN DETALLADA:', ubicacionDetallada, y);
        y += 5;

        // --- Section IV: RESPONSABLE REGISTRADO ---
        y = drawSectionHeader('IV. RESPONSABLE REGISTRADO', y);
        const titularNombre = inhumacion.titular ? `${inhumacion.titular.nombres} ${inhumacion.titular.apellidos}` : 'No especificado';
        y = drawDataRow('NOMBRES Y APELLIDOS:', titularNombre, y);
        y = drawDataRow('DOCUMENTO IDENTIDAD:', inhumacion.titular?.dni || '-', y);
        y += 15;

        // --- Date and Place ---
        const fechaDoc = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.setFont('times', 'italic');
        doc.text(`Chen Chen, ${fechaDoc}`, margin + contentWidth, y, { align: 'right' });
        y += 10;

        // --- Observations ---
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.text('Observaciones:', margin, y);
        y += 4;
        doc.setFont('times', 'normal');
        const obs = inhumacion.observaciones || 'Ninguna.';
        const splitObs = doc.splitTextToSize(obs, contentWidth);
        doc.text(splitObs, margin, y);
        
        // --- Signatures ---
        y = pageHeight - 50;
        doc.setLineDashPattern([1, 1], 0);
        // Administration line
        doc.line(margin + 10, y, margin + 60, y);
        // Titular line
        doc.line(margin + contentWidth - 60, y, margin + contentWidth - 10, y);
        doc.setLineDashPattern([], 0);
        y += 5;
        
        doc.setFontSize(10);
        doc.setFont('times', 'bold');
        doc.text('ADMINISTRACIÓN', margin + 35, y, { align: 'center' });
        doc.text('SOLICITANTE / FAMILIAR', margin + contentWidth - 35, y, { align: 'center' });
        y += 4;
        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        doc.text('Cementerio Municipal', margin + 35, y, { align: 'center' });
        doc.text(titularNombre, margin + contentWidth - 35, y, { align: 'center' });
        y += 4;
        doc.text(`DNI: ${inhumacion.titular?.dni || '-'}`, margin + contentWidth - 35, y, { align: 'center' });

        // Preview/Download
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const previewWindow = window.open(url, '_blank');
        if (previewWindow) {
            previewWindow.focus();
        } else {
            doc.save(`Constancia_${difuntoNombre.replace(/\s+/g, '_')}.pdf`);
        }
    }
}
