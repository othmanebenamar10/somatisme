import { jsPDF } from 'jspdf';

export interface QuotePdfItem {
  name: string;
  reference: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuotePdfData {
  quoteNumber: string;
  issuedAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  customerAddress: string;
  message: string;
  items: QuotePdfItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
}

const NAVY: [number, number, number] = [15, 35, 58];
const CYAN: [number, number, number] = [5, 150, 178];
const SLATE: [number, number, number] = [71, 85, 105];
const PALE: [number, number, number] = [241, 245, 249];

function money(value: number): string {
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
    .format(value).replace(/\u202f/g, ' ')} MAD`;
}

function drawTableHeader(doc: jsPDF, y: number): number {
  doc.setFillColor(...NAVY);
  doc.roundedRect(16, y, 178, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DÉSIGNATION', 21, y + 6.5);
  doc.text('QTÉ', 133, y + 6.5, { align: 'center' });
  doc.text('PRIX UNIT. HT', 160, y + 6.5, { align: 'right' });
  doc.text('TOTAL HT', 189, y + 6.5, { align: 'right' });
  return y + 10;
}

function drawPageFooter(doc: jsPDF, pageNumber: number, pageCount: number): void {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(16, pageHeight - 17, 194, pageHeight - 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text('SOMATISME  |  Automatisme industriel  |  Mohammedia, Maroc', 16, pageHeight - 10);
  doc.text(`Devis ${pageNumber} / ${pageCount}`, 194, pageHeight - 10, { align: 'right' });
}

export function createQuotePdf(data: QuotePdfData): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const issuedDate = data.issuedAt.toLocaleDateString('fr-FR');
  const validUntil = new Date(data.issuedAt.getTime() + 15 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('fr-FR');

  // Brand header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 48, 'F');
  doc.setFillColor(...CYAN);
  doc.rect(0, 46, pageWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(255, 255, 255);
  doc.text('SOMATISME', 17, 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(191, 219, 232);
  doc.text('AUTOMATISME  ·  RÉGULATION  ·  ÉLECTRICITÉ INDUSTRIELLE', 17, 29);
  doc.text('somatisme.ma  |  somatisme@gmail.com  |  +212 679 825 646', 17, 38);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('DEVIS', 193, 21, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(191, 219, 232);
  doc.text(data.quoteNumber, 193, 29, { align: 'right' });
  doc.text(`Émis le ${issuedDate}`, 193, 36, { align: 'right' });
  doc.text(`Valable jusqu'au ${validUntil}`, 193, 42, { align: 'right' });

  // Customer card
  doc.setFillColor(...PALE);
  doc.roundedRect(16, 58, 178, 38, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...CYAN);
  doc.text('DEVIS ÉTABLI POUR', 22, 66);
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(doc.splitTextToSize(data.customerName, 95)[0] || 'Client', 22, 74);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);
  const clientLines = [
    data.customerCompany,
    data.customerEmail,
    data.customerPhone,
    data.customerAddress,
  ].filter(Boolean).slice(0, 3);
  clientLines.forEach((line, index) => doc.text(doc.splitTextToSize(line, 100)[0], 22, 80 + index * 4));
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('RÉFÉRENCE', 188, 68, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE);
  doc.text(data.quoteNumber, 188, 74, { align: 'right' });
  doc.text(`${data.items.length} article${data.items.length > 1 ? 's' : ''}`, 188, 81, { align: 'right' });

  // Items table, continuing over pages when needed.
  let y = drawTableHeader(doc, 101);
  data.items.forEach((item, index) => {
    const nameLines = doc.splitTextToSize(item.name, 89) as string[];
    const referenceLine = item.reference ? `Réf. ${item.reference}` : '';
    const rowHeight = Math.max(13, nameLines.length * 4 + (referenceLine ? 4 : 0) + 5);
    if (y + rowHeight > pageHeight - 32) {
      doc.addPage();
      y = drawTableHeader(doc, 22);
    }
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(16, y, 178, rowHeight, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text(nameLines, 21, y + 5);
    if (referenceLine) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...SLATE);
      doc.text(doc.splitTextToSize(referenceLine, 89)[0], 21, y + 5 + nameLines.length * 4);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text(String(item.quantity), 133, y + 6, { align: 'center' });
    doc.text(money(item.unitPrice), 160, y + 6, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(money(item.total), 189, y + 6, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.line(16, y + rowHeight, 194, y + rowHeight);
    y += rowHeight;
  });

  const totalsHeight = 43;
  if (y + totalsHeight > pageHeight - 25) {
    doc.addPage();
    y = 24;
  }
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text('Sous-total HT', 139, y);
  doc.setTextColor(...NAVY);
  doc.text(money(data.subtotal), 190, y, { align: 'right' });
  y += 7;
  doc.setTextColor(...SLATE);
  doc.text('Livraison', 139, y);
  doc.setTextColor(...NAVY);
  doc.text(money(data.shippingFee), 190, y, { align: 'right' });
  y += 7;
  doc.setTextColor(...SLATE);
  doc.text('TVA (20 %)', 139, y);
  doc.setTextColor(...NAVY);
  doc.text(money(data.tax), 190, y, { align: 'right' });
  y += 4;
  doc.setFillColor(...NAVY);
  doc.roundedRect(130, y, 64, 15, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL TTC', 135, y + 9.5);
  doc.setFontSize(10);
  doc.text(money(data.total), 189, y + 9.5, { align: 'right' });
  y += 23;

  if (data.message) {
    const messageLines = doc.splitTextToSize(data.message, 166) as string[];
    const boxHeight = 10 + messageLines.length * 4;
    if (y + boxHeight > pageHeight - 25) {
      doc.addPage();
      y = 24;
    }
    doc.setFillColor(...PALE);
    doc.roundedRect(16, y, 178, boxHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text('Votre demande', 21, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE);
    doc.text(messageLines, 21, y + 11);
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawPageFooter(doc, page, pageCount);
  }

  return Buffer.from(doc.output('arraybuffer'));
}
