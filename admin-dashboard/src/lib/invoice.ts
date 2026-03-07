import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/types/orders";

/**
 * Reusable Invoice Generation Service
 * Highly optimized for performance and professional aesthetic.
 */
export class InvoiceService {
  /**
   * Generates a premium enterprise PDF invoice.
   */
  static generatePDF(order: Order) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // 1. BRAND HERO SECTION
    doc.setFillColor(23, 37, 84); // Professional Navy (Indigo-950)
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Accent Line
    doc.setFillColor(16, 185, 129); // Emerald-500 accent
    doc.rect(0, 45, pageWidth, 1.5, 'F');
    
    // Logo / Brand
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("ZimCart", 20, 28);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("THE FUTURE OF COMMERCE", 20, 36);

    // Business Meta (Right Aligned)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 20, 20, { align: 'right' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text([
      `Reference: #${order.id.substring(0, 8).toUpperCase()}`,
      `Generated: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      `Status: ${order.status.toUpperCase()}`
    ], pageWidth - 20, 28, { align: 'right' });

    // 2. INFORMATION GRID
    const infoY = 65;
    
    // Client Container
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", 20, infoY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text([
      order.customer.name,
      order.customer.email || "No email available",
      order.customer.phone || "No phone available"
    ], 20, infoY + 7);

    // Shipping Container
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SHIPPING DESTINATION", pageWidth - 20, infoY, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    
    let addressLines = [order.shippingAddress];
    try {
      const parsed = JSON.parse(order.shippingAddress);
      addressLines = [
        parsed.address,
        parsed.detail ? `Note: ${parsed.detail}` : null,
        parsed.city || "Primary Zone"
      ].filter(Boolean) as string[];
    } catch (e) {}
    
    doc.text(addressLines, pageWidth - 20, infoY + 7, { align: 'right' });

    // 3. PRODUCT TABLE
    const tableData = order.items.map(item => [
      { content: item.name, styles: { fontStyle: 'bold' } },
      { content: `Rs ${item.price.toLocaleString()}`, styles: { halign: 'right' } },
      { content: item.quantity.toString(), styles: { halign: 'center' } },
      { content: `Rs ${(item.price * item.quantity).toLocaleString()}`, styles: { halign: 'right', fontStyle: 'bold' } }
    ]);

    autoTable(doc, {
      startY: infoY + 25,
      head: [['PRODUCT / ITEM DESCRIPTION', 'UNIT PRICE', 'QTY', 'AMOUNT']],
      body: tableData as any,
      theme: 'grid',
      headStyles: { 
        fillColor: [23, 37, 84], 
        textColor: [255, 255, 255], 
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 4
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { 
        fontSize: 9, 
        cellPadding: 4, 
        lineColor: [226, 232, 240],
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { cellWidth: 95 },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      }
    });

    // 4. FINANCIAL SUMMARY
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    const summaryX = pageWidth - 20;

    const subtotal = order.subtotal || order.totalAmount;
    const shipping = order.deliveryFee || 0;
    const tax = order.tax || 0;
    const finalTotal = order.totalAmount;

    doc.setFontSize(10);
    
    // Line Details
    const labels = [
      ["Subtotal:", `Rs ${subtotal.toLocaleString()}`],
      ["Shipping:", shipping === 0 ? "FREE" : `Rs ${shipping.toLocaleString()}`],
      ["Tax (GST 5%):", `Rs ${tax.toLocaleString()}`]
    ];

    labels.forEach((row, i) => {
        doc.setTextColor(148, 163, 184); // Labels
        doc.text(row[0], summaryX - 65, finalY + (i * 8));
        doc.setTextColor(23, 37, 84); // Values (Navy)
        doc.setFont("helvetica", "bold");
        doc.text(row[1], summaryX, finalY + (i * 8), { align: 'right' });
        doc.setFont("helvetica", "normal");
    });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(summaryX - 65, finalY + 22, summaryX, finalY + 22);

    // Total Highlight
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text("TOTAL AMOUNT", summaryX - 65, finalY + 34);
    doc.text(`Rs ${finalTotal.toLocaleString()}`, summaryX, finalY + 34, { align: 'right' });

    // 5. PROFESSIONAL FOOTER
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    doc.text([
      "Thank you for choosing ZimCart. This is a computer-generated summary of your order.",
      "For support, visit help.zimcart.com or contact us within 7 days for order discrepancies.",
      "ZimCart Fulfillments • Proprietary & Confidential"
    ], pageWidth / 2, pageHeight - 20, { align: 'center' });

    doc.save(`Invoice-${order.id.substring(0,8)}.pdf`);
  }

  static print() {
    window.print();
  }
}
