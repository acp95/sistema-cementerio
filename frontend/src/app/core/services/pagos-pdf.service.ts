import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';

@Injectable()
export class PagosPdfService {
    constructor(private messageService: MessageService) {}

    imprimirRecibo(pago: any) {
        if (!pago || pago.estado !== 'PAGADO') {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Acción no permitida', 
                detail: 'Solo se pueden imprimir recibos de pagos confirmados.' 
            });
            return;
        }

        // Configuration
        const unit = 'mm';
        const width = 80;
        const margin = 5;
        const fontSizeNormal = 9;
        const fontSizeSmall = 8;
        const fontSizeLarge = 11;
        
        // Calculate dynamic height
        const detallesCount = pago.detalles?.length || 1;
        const calculatedHeight = 110 + (detallesCount * 6); // Base header/footer + items
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: unit,
            format: [width, calculatedHeight]
        });

        let y = 10;
        const centerX = width / 2;
        const rightAlignX = width - margin;

        // --- Header ---
        doc.setFont('courier', 'bold');
        doc.setFontSize(fontSizeLarge);
        doc.text('MUNICIPALIDAD C.P. CHEN CHEN', centerX, y, { align: 'center' });
        y += 5;
        
        doc.setFont('courier', 'normal');
        doc.setFontSize(fontSizeNormal);
        doc.text('RUC: 20123456789', centerX, y, { align: 'center' });
        y += 4;
        doc.text('Av. Principal S/N - Chen Chen', centerX, y, { align: 'center' });
        y += 7;

        doc.setFont('courier', 'bold');
        doc.text('RECIBO DE CAJA', centerX, y, { align: 'center' });
        y += 5;
        doc.text(pago.codigoRecibo || 'S/N', centerX, y, { align: 'center' });
        y += 5;

        // Divider
        doc.setLineDashPattern([1, 1], 0);
        doc.line(margin, y, rightAlignX, y);
        y += 5;

        // --- Client Info ---
        doc.setFont('courier', 'normal');
        doc.setFontSize(fontSizeSmall);
        
        const fechaFormatted = new Date(pago.fechaPago).toLocaleString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        doc.text(`Fecha:  ${fechaFormatted}`, margin, y);
        y += 4;
        doc.text(`Cajero: ${pago.usuario?.nombreCompleto || 'Administrador'}`, margin, y);
        y += 5;
        
        doc.line(margin, y, rightAlignX, y);
        y += 5;

        const titularNombre = pago.titular ? `${pago.titular.nombres} ${pago.titular.apellidos}` : 'No especificado';
        doc.text(`Cliente: ${titularNombre.substring(0, 35)}`, margin, y); // Control width
        y += 4;
        doc.text(`DNI/RUC: ${pago.titular?.dni || '-'}`, margin, y);
        y += 6;

        // --- Items Table ---
        doc.setFont('courier', 'bold');
        doc.text('DESCRIPCION', margin, y);
        doc.text('TOTAL', rightAlignX, y, { align: 'right' });
        y += 2;
        doc.setLineDashPattern([], 0);
        doc.line(margin, y, rightAlignX, y);
        y += 4;

        doc.setFont('courier', 'normal');
        if (pago.detalles && pago.detalles.length > 0) {
            pago.detalles.forEach((d: any) => {
                const nombre = d.concepto?.nombre || 'Item';
                const subtotal = `S/. ${Number(d.subtotal || 0).toFixed(2)}`;
                
                // Wrap text manually if too long
                const splitNombre = doc.splitTextToSize(nombre, 50);
                doc.text(splitNombre[0], margin, y);
                doc.text(subtotal, rightAlignX, y, { align: 'right' });
                y += 4;
                for (let i = 1; i < splitNombre.length; i++) {
                    doc.text(splitNombre[i], margin, y);
                    y += 4;
                }
            });
        } else {
            const concepto = pago.conceptoPago?.nombre || 'Pago General';
            doc.text(concepto, margin, y);
            doc.text(`S/. ${Number(pago.montoTotal || 0).toFixed(2)}`, rightAlignX, y, { align: 'right' });
            y += 4;
        }

        y += 2;
        doc.line(margin, y, rightAlignX, y);
        y += 6;

        // --- Totals ---
        doc.setFont('courier', 'bold');
        doc.setFontSize(fontSizeLarge);
        doc.text('TOTAL A PAGAR:', margin, y);
        doc.text(`S/. ${Number(pago.montoTotal || 0).toFixed(2)}`, rightAlignX, y, { align: 'right' });
        y += 6;

        doc.setFont('courier', 'normal');
        doc.setFontSize(fontSizeSmall);
        doc.text(`Método: ${pago.metodoPago || 'EFECTIVO'}`, margin, y);
        y += 6;

        if (pago.observaciones && pago.observaciones !== '-') {
            doc.text('Observaciones:', margin, y);
            y += 4;
            const splitObs = doc.splitTextToSize(pago.observaciones, width - (margin * 2));
            doc.text(splitObs, margin, y);
            y += (splitObs.length * 4);
        }

        // --- Footer ---
        y = calculatedHeight - 25;
        doc.setLineDashPattern([], 0);
        doc.line(centerX - 15, y, centerX + 15, y);
        y += 4;
        doc.text('Firma / Sello', centerX, y, { align: 'center' });
        y += 8;
        
        doc.setFontSize(fontSizeSmall);
        doc.text('¡Gracias por su contribución!', centerX, y, { align: 'center' });
        y += 4;
        doc.text('Conserve este voucher', centerX, y, { align: 'center' });

        // Preview/Print
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        
        // Open the PDF in a new window which triggers the browser's native PDF viewer
        const previewWindow = window.open(url, '_blank');
        if (previewWindow) {
            previewWindow.focus();
        } else {
            // Fallback: direct download
            doc.save(`Recibo_${pago.codigoRecibo || 'Pago'}.pdf`);
        }
    }
}
