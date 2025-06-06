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

    // Use simplified settings for better compatibility
    const canvas = await html2canvas(elementRef.current, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: false,
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Remove any problematic styles
        const styleSheets = clonedDoc.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
          try {
            styleSheets[i].disabled = true;
          } catch (e) {
            // Ignore cross-origin errors
          }
        }
        
        // Apply basic inline styles
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          // Remove gradients and complex backgrounds
          el.style.backgroundImage = 'none';
          el.style.boxShadow = 'none';
          el.style.textShadow = 'none';
          
          // Ensure white background for main containers
          if (el.classList.contains('MuiPaper-root') || 
              el.classList.contains('MuiBox-root')) {
            el.style.backgroundColor = '#ffffff';
          }
        });
      }
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Convert canvas to JPEG instead of PNG for better compatibility
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Add image to PDF
    if (imgHeight <= 297) {
      // Single page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let position = 0;
      let remainingHeight = imgHeight;
      
      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        remainingHeight -= 297;
        position -= 297;
        
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    // Save the PDF
    const fileName = `فاتورة-${orderNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    toast.success('تم تصدير الفاتورة كـ PDF بنجاح');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    toast.error('حدث خطأ أثناء تصدير PDF. يرجى المحاولة مرة أخرى.');
  }
};



export const printInvoice = async (elementRef) => {
  try {
    if (!elementRef.current) {
      toast.error('لا يمكن العثور على عنصر الفاتورة');
      return;
    }

    // Create a simplified print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const invoiceContent = elementRef.current.innerHTML;
    
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
            line-height: 1.6;
            color: #000;
          }
          
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border: 2px solid #1976d2;
            border-radius: 8px;
          }
          
          /* Reset all MUI styles */
          * {
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          
          /* Typography styles */
          h1, h2, h3, h4, h5, h6 {
            margin: 10px 0;
            font-weight: bold;
          }
          
          p, div, span {
            margin: 5px 0;
          }
          
          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 1px solid #ddd;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
          }
          
          th {
            background-color: #1976d2 !important;
            color: white !important;
            font-weight: bold;
            text-align: center;
          }
          
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          /* Paper/Card styles */
          [class*="MuiPaper"], [class*="MuiBox"] {
            background-color: #ffffff !important;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
          }
          
          /* Grid layout */
          [class*="MuiGrid-container"] {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 15px 0;
          }
          
          [class*="MuiGrid-"][class*="size"] {
            flex: 1;
            min-width: 200px;
          }
          
          /* Chip styles */
          [class*="MuiChip"] {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 5px;
          }
          
          /* Color classes */
          .paid { background-color: #4caf50 !important; color: white !important; }
          .pending { background-color: #ff9800 !important; color: white !important; }
          
          /* Header */
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1976d2;
            padding: 20px;
            background-color: #f8f9fa;
          }
          
          .company-title {
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
          }
          
          .invoice-subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 15px;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            border-top: 3px solid #1976d2;
            background-color: #f8f9fa;
          }
          
          .footer-title {
            font-size: 18px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 15px;
          }
          
          @page {
            margin: 1cm;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${invoiceContent}
        </div>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 1000);
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