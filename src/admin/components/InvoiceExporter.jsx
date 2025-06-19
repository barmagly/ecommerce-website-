

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
          .invoice-container [class*="MuiGrid-container"] {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 15px 0;
          }
          .invoice-container [class*="MuiGrid-"][class*="size"] {
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