export const emailSignature = `
  <table cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="font-size: 14px; color: #444">
        <p style="margin: 0">
          Warm regards,<br />
          <strong>NVS Book Store Team</strong><br />
          📚 Your trusted online bookstore<br />
          <a href="mailto:support@nvsbookstore.com" style="color: #3b82f6; text-decoration: none">support@nvsbookstore.com</a><br />
          <a href="https://nvsbookstore.com" target="_blank" style="color: #3b82f6; text-decoration: none">nvsbookstore.com</a>
        </p>
      </td>
    </tr>
  </table>
`;

export const adminContactEmail = ({ fullName, email, phone, subject, message }) => `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background-color:#f9f9f9">
      <table cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 0">
        <tr>
          <td>
            <table width="600" align="center" style="background:#fff;border-radius:8px;font-family:'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden">
              <tr>
                <td style="background:#dc2626;padding:30px;color:#fff;text-align:center">
                  <h2 style="margin:0;font-size:20px">📬 New Contact Submission</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:30px">
                  <p><strong>Name:</strong> ${fullName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong><br/>${message}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 30px 30px 30px">
                  ${emailSignature}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;


export const userContactEmail = ({ fullName, email, phone, subject, message }) => `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background-color:#f9f9f9">
      <table cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 0">
        <tr>
          <td>
            <table width="600" align="center" style="background:#fff;border-radius:8px;font-family:'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden">
              <tr>
                <td style="background:#2563eb;padding:30px;color:#fff;text-align:center">
                  <h1 style="margin:0;font-size:24px">Thanks for Reaching Out!</h1>
                  <p style="margin:8px 0;font-size:16px;">We’ve received your message</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px">
                  <p style="font-size:16px;color:#333">Hi ${fullName},</p>
                  <p style="font-size:16px;color:#333">Thank you for contacting <strong>NVS Book Store</strong>. Our team will review your message and get back to you shortly.</p>
                  <hr style="margin:20px 0;border:none;border-top:1px solid #ddd" />
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                  <p><strong>Message:</strong><br/>${message}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 30px 30px 30px">
                  ${emailSignature}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;
