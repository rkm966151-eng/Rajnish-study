export interface PrintDocumentData {
  title: string;
  subtitle?: string;
  category?: string;
  date?: string;
  sections: {
    heading?: string;
    content: string;
  }[];
  language?: 'hi' | 'en';
}

export function printDocument(data: PrintDocumentData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate and download the printable PDF.');
    return;
  }

  const currentDate = data.date || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html lang="${data.language || 'hi'}">
<head>
  <meta charset="UTF-8">
  <title>${data.title} - Rajnish Study</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
    }
    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', -apple-system, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
      font-size: 11pt;
    }
    .header {
      border-bottom: 2px solid #0B192C;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 800;
      color: #0B192C;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .tagline {
      font-size: 8.5pt;
      font-weight: 700;
      color: #E65100;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .meta {
      text-align: right;
      font-size: 8.5pt;
      color: #64748B;
    }
    .doc-title {
      font-size: 15pt;
      font-weight: 700;
      color: #0F172A;
      margin: 16px 0 6px 0;
    }
    .doc-subtitle {
      font-size: 10pt;
      color: #475569;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .section-heading {
      font-size: 11pt;
      font-weight: 700;
      color: #0B192C;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-content {
      white-space: pre-line;
      font-size: 10pt;
      color: #334155;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
      font-size: 8pt;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }
    .no-print-bar {
      background: #0B192C;
      color: #FFFFFF;
      padding: 10px 16px;
      margin: -24px -24px 24px -24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      font-weight: 600;
    }
    .print-btn {
      background: #F59E0B;
      color: #000000;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>Rajnish Study Printable A4 Document Engine</span>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="brand-title">RAJNISH STUDY</h1>
      <div class="tagline">Learn Smart. Practice More. Achieve More.</div>
    </div>
    <div class="meta">
      <div><strong>Date:</strong> ${currentDate}</div>
      <div><strong>Portal:</strong> RajnishStudy.com</div>
      <div><strong>Language:</strong> ${data.language === 'hi' ? 'Hindi (हिंदी)' : 'English'}</div>
    </div>
  </div>

  <div class="doc-title">${data.title}</div>
  ${data.subtitle ? `<div class="doc-subtitle">${data.subtitle}</div>` : ''}

  ${data.sections
    .map(
      (sec) => `
    <div class="section">
      ${sec.heading ? `<div class="section-heading">${sec.heading}</div>` : ''}
      <div class="section-content">${sec.content}</div>
    </div>
  `
    )
    .join('')}

  <div class="footer">
    <span>Rajnish Study · Confidential Study Material · Not for unauthorized reproduction</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    // Auto-focus and optionally offer print
    window.addEventListener('load', () => {
      // Allow user to click the prominent yellow print button or trigger print
    });
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
