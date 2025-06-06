import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

// Export utilities for invoices
export const exportInvoiceAsPDF = async (elementRef, orderNumber) => {
  try {
    if (!elementRef.current) {
      toast.error('لا يمكن العثور على عنصر الفاتورة');
      return;
    }

    toast.info('جاري إنشاء ملف PDF...');

    // Create canvas from the invoice element
    const canvas = await html2canvas(elementRef.current, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: elementRef.current.scrollWidth,
      height: elementRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `فاتورة-${orderNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    toast.success('تم تصدير الفاتورة كـ PDF بنجاح');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    toast.error('حدث خطأ أثناء تصدير PDF');
  }
};

export const exportInvoiceAsImage = async (elementRef, orderNumber, format = 'png') => {
  try {
    if (!elementRef.current) {
      toast.error('لا يمكن العثور على عنصر الفاتورة');
      return;
    }

    toast.info('جاري إنشاء الصورة...');

    // Create canvas from the invoice element
    const canvas = await html2canvas(elementRef.current, {
      scale: 3, // Very high quality for image
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: elementRef.current.scrollWidth,
      height: elementRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `فاتورة-${orderNumber}-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`تم تصدير الفاتورة كصورة ${format.toUpperCase()} بنجاح`);
    }, `image/${format}`, 1.0);

  } catch (error) {
    console.error('Error exporting image:', error);
    toast.error('حدث خطأ أثناء تصدير الصورة');
  }
};

export const printInvoice = async (elementRef) => {
  try {
    if (!elementRef.current) {
      toast.error('لا يمكن العثور على عنصر الفاتورة');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طباعة الفاتورة</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            direction: rtl;
            background: white;
            padding: 20px;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          .invoice-title {
            font-size: 18px;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            width: 48%;
          }
          .info-title {
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .table th,
          .table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
          }
          .table th {
            background: #1976d2;
            color: white;
            font-weight: bold;
          }
          .table tr:nth-child(even) {
            background: #f9f9f9;
          }
          .summary {
            margin-top: 30px;
            text-align: left;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px 0;
          }
          .summary-total {
            border-top: 2px solid #1976d2;
            font-weight: bold;
            font-size: 18px;
            color: #1976d2;
            padding-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${elementRef.current.innerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    toast.success('تم فتح نافذة الطباعة');
  } catch (error) {
    console.error('Error printing invoice:', error);
    toast.error('حدث خطأ أثناء الطباعة');
  }
}; 