import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Order } from "@/types/orders";
import { Category } from "@/types/categories";

/**
 * Reusable Report Generation Service
 * Highly optimized for handling large datasets and professional export aesthetics.
 */
export class ReportService {
  /**
   * Generates a professional PDF Executive Report for a list of orders.
   */
  static generatePDF(orders: Order[], filterContext: string = "All Orders") {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Exact Brand Emerald-600 Color [5, 150, 105]
    const BRAND_EMERALD: [number, number, number] = [5, 150, 105];
    const SOFT_SLATE: [number, number, number] = [248, 250, 252];

    const totalVolume = orders.length;
    const grossRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const avgOrderValue = totalVolume > 0 ? grossRevenue / totalVolume : 0;

    // --- 1. PRO-GRADE BACKGROUND ---
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // --- 2. HEADER ARCHITECTURE ---
    doc.setFillColor(23, 37, 84); // Navy Deep Base
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Bold Emerald Brand line
    doc.setFillColor(BRAND_EMERALD[0], BRAND_EMERALD[1], BRAND_EMERALD[2]);
    doc.rect(0, 35, pageWidth, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("ZimCart", 20, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("BUSINESS INTELLIGENCE & REVENUE ARCHIVE", 20, 30);

    // Dynamic Metadata Container
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    const meta = [
      `ID: ZIM-${Date.now().toString(36).toUpperCase()}`,
      `SCOPE: ${filterContext.toUpperCase()}`,
      `DATE: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}`
    ];
    doc.text(meta, pageWidth - 20, 16, { align: 'right', lineHeightFactor: 1.5 });

    // --- 3. EXECUTIVE KPI DASHBOARD ---
    const kpiY = 50;
    const cardWidth = (pageWidth - 60) / 3;
    
    const drawExpertKPI = (label: string, value: string, x: number) => {
        doc.setFillColor(...SOFT_SLATE); 
        doc.roundedRect(x, kpiY, cardWidth, 30, 3, 3, 'F');
        
        // High-contrast indicator
        doc.setFillColor(...BRAND_EMERALD);
        doc.rect(x + 5, kpiY + 8, 2, 14, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), x + 10, kpiY + 12);
        
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.text(value, x + 10, kpiY + 24);
    };

    drawExpertKPI("Transaction Count", totalVolume.toLocaleString(), 20);
    drawExpertKPI("Gross Revenue", `Rs ${grossRevenue.toLocaleString()}`, 20 + cardWidth + 10);
    drawExpertKPI("Average Lifetime Value", `Rs ${Math.round(avgOrderValue).toLocaleString()}`, 20 + (cardWidth * 2) + 20);

    // --- 4. MAIN ANALYTICS TABLE ---
    const tableData = orders.map(order => [
      order.id.substring(0, 8).toUpperCase(),
      order.customer.name,
      new Date(order.createdAt).toLocaleDateString(),
      { content: order.status.toUpperCase(), styles: { fontStyle: 'bold', textColor: [51, 65, 85] } },
      order.paymentMethod,
      order.items.length,
      { content: `Rs ${order.totalAmount.toLocaleString()}`, styles: { fontStyle: 'bold', textColor: [5, 150, 105] } }
    ]);

    autoTable(doc, {
      startY: kpiY + 40,
      head: [['REF_ID', 'CUSTOMER_NAME', 'SETTLEMENT_DATE', 'WORKFLOW_STATE', 'PAY_PROTOCOL', 'QTY', 'TOTAL_AMOUNT']],
      body: tableData as any,
      theme: 'striped',
      headStyles: { 
        fillColor: BRAND_EMERALD, 
        textColor: [255, 255, 255], 
        fontSize: 8,
        fontStyle: 'bold',
        cellPadding: 4
      },
      styles: { fontSize: 8, cellPadding: 4, font: 'helvetica' },
      columnStyles: {
        6: { halign: 'right' },
        3: { halign: 'center' }
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 20, right: 20 }
    });

    // --- 5. HIGH-FIDELITY FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`CONFIDENTIAL BUSINESS DOCUMENT • SYSTEM GENERATED • PAGE 1/1`, pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text(`ZimCart Cloud Merchant Network • v4.2.1-PRO`, 20, pageHeight - 12);
    doc.text(`Sync Time: ${new Date().toLocaleTimeString()}`, pageWidth - 20, pageHeight - 12, { align: 'right' });

    doc.save(`ZimCart-Order-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Generates a high-performance CSV/Excel report.
   */
  static generateCSV(orders: Order[]) {
    // Flatten data for Excel/CSV consumption
    const flatData = orders.map(order => ({
      'Order Reference': order.id.toUpperCase(),
      'Customer Name': order.customer.name,
      'Email': order.customer.email || 'N/A',
      'Phone': order.customer.phone || 'N/A',
      'Order Date': new Date(order.createdAt).toLocaleString(),
      'Status': order.status,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus,
      'Item Count': order.items.length,
      'Subtotal': order.totalAmount,
      'Shipping Address': order.shippingAddress
    }));

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Standard high-performance buffer download
    XLSX.writeFile(workbook, `ZimCart-Export-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  /**
   * Generates a professional PDF for Categories
   */
  static generateCategoryPDF(categories: Category[], filterContext: string = "All Categories") {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Exact Brand Emerald-600 Color [5, 150, 105]
    const BRAND_EMERALD: [number, number, number] = [5, 150, 105];

    // Calculate Intelligence
    const total = categories.length;
    const published = categories.filter(c => c.status === 'Published').length;
    const hidden = categories.filter(c => c.status === 'Hidden').length;

    // --- 1. BRAND HEADER ---
    doc.setFillColor(23, 37, 84); 
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(...BRAND_EMERALD);
    doc.rect(0, 35, pageWidth, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("ZimCart", 20, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150); 
    doc.text("CATALOG STRUCTURE & SYSTEM HIERARCHY", 20, 30);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text([
      `REFERENCE: CAT-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      `FILTERING: ${filterContext.toUpperCase()}`,
      `ISSUE DATE: ${new Date().toLocaleDateString('en-GB')}`
    ], pageWidth - 20, 18, { align: 'right', lineHeightFactor: 1.5 });

    // --- 2. EXECUTIVE KPI GRID ---
    const kpiY = 50;
    const cardWidth = (pageWidth - 60) / 3;
    const drawProKPI = (label: string, value: string, x: number, lineSub: [number, number, number]) => {
      doc.setFillColor(248, 250, 252); 
      doc.roundedRect(x, kpiY, cardWidth, 28, 3, 3, 'F');
      doc.setFillColor(...lineSub);
      doc.rect(x + 5, kpiY + 8, 2, 12, 'F');
      
      doc.setFontSize(9); doc.setTextColor(100, 116, 139); 
      doc.text(label.toUpperCase(), x + 10, kpiY + 12);
      doc.setFontSize(16); doc.setTextColor(15, 23, 42);
      doc.text(value, x + 10, kpiY + 23);
    };

    drawProKPI("Global Catalog", total.toLocaleString(), 20, [23, 37, 84]);
    drawProKPI("Active Node Listings", published.toLocaleString(), 20 + cardWidth + 10, BRAND_EMERALD);
    drawProKPI("Protected Content", hidden.toLocaleString(), 20 + (cardWidth * 2) + 20, [239, 68, 68]);

    // --- 3. CORE CATALOG RECORD ---
    const tableData = categories.map(c => [
      c.id.substring(0, 8).toUpperCase(),
      c.name.toUpperCase(),
      `/${c.slug}`,
      c.parentCategory || "ROOT ARCHIVE",
      { content: c.productCount.toString(), styles: { halign: 'center', fontStyle: 'bold' } },
      { content: c.status.toUpperCase(), styles: { textColor: c.status === 'Published' ? [5, 150, 105] : [100, 116, 139] } },
      new Date(c.lastUpdated).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: kpiY + 40,
      head: [['ID_REF', 'CATEGORY_TITLE', 'RESOURCE_URI', 'PARENT_DOMAIN', 'INVENTORY', 'LIFECYCLE', 'SYNC_TS']],
      body: tableData as any,
      theme: 'striped',
      headStyles: { 
        fillColor: BRAND_EMERALD, 
        textColor: [255, 255, 255],
        fontSize: 8,
        cellPadding: 4,
        fontStyle: 'bold'
      },
      styles: { fontSize: 8, cellPadding: 4 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 20, right: 20 }
    });

    // --- 4. ANALYTICS FOOTER ---
    doc.setFontSize(8); doc.setTextColor(148, 163, 184);
    doc.text(`ZimCart Ecosystem Audit • Internal Business Data • Merchant Network v4.2`, 20, pageHeight - 12);
    doc.text(`Generated at ${new Date().toLocaleTimeString()} by ZimCloud Reporting Engine`, pageWidth - 20, pageHeight - 12, { align: 'right' });

    doc.save(`ZimCart-Catalog-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Generates a high-performance CSV/Excel for Categories
   */
  static generateCategoryCSV(categories: Category[]) {
    const flatData = categories.map(c => ({
      'Catalog_ID': c.id,
      'Name': c.name,
      'Slug': c.slug,
      'Parent_Category': c.parentCategory || 'Top Level',
      'Inventory_Depth': c.productCount,
      'Status': c.status,
      'Featured': c.isFeatured ? 'YES' : 'NO',
      'Display_Rank': c.displayOrder,
      'Last_Modified': new Date(c.lastUpdated).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catalog Structure");
    XLSX.writeFile(workbook, `ZimCart-Catalog-Export-${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}
