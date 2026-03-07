import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem } from '@/types/inventory';
import { format } from 'date-fns';

export const exportInventoryToCSV = (inventory: InventoryItem[]) => {
  const data = inventory.map((item) => ({
    'Product Name': item.productName,
    'SKU': item.sku,
    'Category': item.category,
    'Total Stock': item.currentStock,
    'Available Stock': item.availableStock,
    'Reserved Stock': item.reservedStock,
    'Threshold': item.restockThreshold,
    'Status': item.status,
    'Warehouse Location': item.warehouseLocation,
    'Unit Price': `$${item.unitPrice.toFixed(2)}`,
    'Total Value': `$${item.totalValue.toFixed(2)}`,
    'Last Restocked': item.lastRestocked && item.lastRestocked !== 'N/A' && !isNaN(new Date(item.lastRestocked).getTime()) 
      ? format(new Date(item.lastRestocked), 'PPP') 
      : 'N/A'
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
  
  // Create buffer and save
  xlsx.writeFile(workbook, `Inventory_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

export const exportInventoryToPDF = (inventory: InventoryItem[]) => {
  const doc = new jsPDF('landscape');
  
  // Add Header
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('ZimCart Inventory Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${format(new Date(), 'PPP at pp')}`, 14, 28);
  doc.text(`Total SKUs: ${inventory.length}`, 14, 34);

  // Table Data
  const tableColumn = [
    "Product / SKU", 
    "Category", 
    "Stock Level", 
    "Status", 
    "Location", 
    "Unit Price",
    "Total Value"
  ];
  
  const tableRows = inventory.map(item => [
    `${item.productName}\nSKU: ${item.sku}`,
    item.category,
    `Total: ${item.currentStock}\nAvail: ${item.availableStock} | Rsv: ${item.reservedStock}`,
    item.status,
    item.warehouseLocation || 'N/A',
    `$${item.unitPrice.toFixed(2)}`,
    `$${item.totalValue.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 9,
      font: 'helvetica',
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [16, 185, 129], // emerald-500
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    willDrawCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        const text = data.cell.text[0];
        if (text === 'Out of Stock') {
          doc.setTextColor(220, 38, 38); // red-600
        } else if (text === 'Low Stock') {
          doc.setTextColor(217, 119, 6); // amber-600
        } else if (text === 'In Stock') {
          doc.setTextColor(5, 150, 105); // emerald-600
        } else {
          doc.setTextColor(51, 65, 85); // slate-700
        }
      } else if (data.section === 'body') {
        doc.setTextColor(51, 65, 85); // default text color
      }
    }
  });

  doc.save(`ZimCart_Inventory_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
