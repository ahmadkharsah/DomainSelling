export function createOfferEmailHTML(data: {
  fullName: string;
  email: string;
  offerAmount: number;
  message?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Domain Selling: Offer</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #1D546C;
      color: #F4F4F4;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .content p {
      margin: 0 0 16px 0;
      color: #555555;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th {
      background-color: #0C2B4E;
      color: #F4F4F4;
      text-align: left;
      padding: 12px 16px;
      font-weight: 600;
      font-size: 14px;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      color: #333333;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .highlight {
      background-color: #f8f9fa;
    }
    .offer-amount {
      font-size: 20px;
      font-weight: 700;
      color: #1D546C;
    }
    .message-box {
      background-color: #f8f9fa;
      border-left: 4px solid #1D546C;
      padding: 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #888888;
      border-top: 1px solid #e5e5e5;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .content {
        padding: 24px 16px;
      }
      th, td {
        padding: 10px 12px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Domain Offer Received</h1>
    </div>
    <div class="content">
      <p>You have received a new offer for your domain. Here are the details:</p>
      
      <table>
        <tr>
          <th colspan="2">Offer Details</th>
        </tr>
        <tr>
          <td><strong>Full Name</strong></td>
          <td>${escapeHtml(data.fullName)}</td>
        </tr>
        <tr class="highlight">
          <td><strong>Email</strong></td>
          <td><a href="mailto:${escapeHtml(data.email)}" style="color: #1D546C; text-decoration: none;">${escapeHtml(data.email)}</a></td>
        </tr>
        <tr>
          <td><strong>Offer Amount</strong></td>
          <td class="offer-amount">$${data.offerAmount.toLocaleString('en-US')}</td>
        </tr>
        <tr class="highlight">
          <td><strong>Submitted</strong></td>
          <td>${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</td>
        </tr>
      </table>
      
      ${data.message ? `
      <div>
        <strong style="font-size: 14px; color: #333333;">Message:</strong>
        <div class="message-box">
          ${escapeHtml(data.message).replace(/\n/g, '<br>')}
        </div>
      </div>
      ` : ''}
      
      <p style="margin-top: 24px; color: #555555;">
        You can reply directly to this email to respond to <strong>${escapeHtml(data.fullName)}</strong>.
      </p>
    </div>
    <div class="footer">
      <p>This email was sent from your domain sale contact form.</p>
    </div>
  </div>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
