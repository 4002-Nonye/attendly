import { formatTime, formatYear } from './dateHelper';


// download QR Code
export const handleDownloadQR = (session) => {
  const link = document.createElement('a');
  link.href = session.qrCode;
  link.download = `qr-${session.course.courseCode}-${formatYear(
    session.createdAt
  )}.png`;
  link.click();
};

// print QR Code
export const handlePrintQR = (session) => {
  const printWindow = window.open('', '', 'width=800,height=600');

  const qrImageHTML = `<img 
    src="${session.qrCode}" 
    alt="QR Code" 
    style="width: 300px; height: 300px; display: block; margin: auto;" 
  />`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print QR Code - ${session.course.courseCode}</title>
        <style>
          @media print {
            @page { margin: 2cm; }
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 40px;
            background: white;
          }
          .print-container {
            text-align: center;
            max-width: 600px;
          }
          h1 {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 8px;
          }
          h2 {
            font-size: 22px;
            color: #374151;
            margin-bottom: 32px;
          }
          .qr-wrapper {
            margin: 40px auto;
            padding: 30px;
            background: white;
            border: 3px solid #e5e7eb;
            border-radius: 16px;
            display: inline-block;
          }
          .info {
            margin-top: 32px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            font-size: 16px;
            line-height: 1.8;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #6b7280;
          }
          .info-value {
            color: #111827;
            text-transform: capitalize;

            
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <h1>${session.course.courseCode}</h1>
          <h2>${session.course.courseTitle}</h2>
          
          <div class="qr-wrapper">
            ${qrImageHTML}
          </div>
          
          <div class="info">
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${formatYear(session.createdAt)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time:</span>
              <span class="info-value">${formatTime(session.createdAt)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Level:</span>
              <span class="info-value">${session.course.level}L</span>
            </div>
             <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${session.status}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Scan this QR code to mark your attendance</p>
            <p style="margin-top: 8px;">University Attendance System</p>
          </div>
        </div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
