import { emailSignature } from "./shared";

export const renderUserOrderConfirmationEmail = (order) => `
  <html>
    <body style="background:#f9f9f9;padding:40px 0">
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;font-family:'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden">
        <tr>
          <td style="background:#2563eb;color:white;padding:24px;text-align:center">
            <h1 style="margin:0">🎉 Order Placed Successfully</h1>
            <p style="margin:8px 0">Thanks for your purchase, ${order.customerName}!</p>
          </td>
        </tr>
        <tr><td style="padding:24px">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total:</strong> ₹${order.price.total}</p>
          <h3>Shipping Details</h3>
          <p>${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          <h3>Items</h3>
          <ul style="padding-left:20px">
            ${order.items.map(item => `<li>${item.product.title} x ${item.quantity}</li>`).join("")}
          </ul>
        </td></tr>
        <tr><td style="padding:0 24px 24px 24px">
          ${emailSignature}
        </td></tr>
      </table>
    </body>
  </html>
`;

export const renderAdminOrderNotificationEmail = (order) => `
  <html>
    <body style="background:#f9f9f9;padding:40px 0">
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;font-family:'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden">
        <tr>
          <td style="background:#dc2626;color:white;padding:24px;text-align:center">
            <h1 style="margin:0">📦 New Order Received</h1>
            <p style="margin:8px 0">From ${order.customerName}</p>
          </td>
        </tr>
        <tr><td style="padding:24px">
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p><strong>Total:</strong> ₹${order.price.total}</p>
          <h3>Items</h3>
          <ul style="padding-left:20px">
            ${order.items.map(item => `<li>${item.product.title} x ${item.quantity}</li>`).join("")}
          </ul>
        </td></tr>
        <tr><td style="padding:0 24px 24px 24px">
          ${emailSignature}
        </td></tr>
      </table>
    </body>
  </html>
`;

export const renderUserOrderStatusUpdateEmail = (order) => `
  <html>
    <body style="background:#f9f9f9;padding:40px 0">
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;font-family:'Segoe UI',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden">
        <tr>
          <td style="background:#10b981;color:white;padding:24px;text-align:center">
            <h1 style="margin:0">📢 Order Status Update</h1>
          </td>
        </tr>
        <tr><td style="padding:24px">
          <p>Hi ${order.customerName},</p>
          <p>Your order <strong>#${order._id}</strong> status has been updated to:</p>
          <p style="font-size:18px"><strong>${order.status.toUpperCase()}</strong></p>
        </td></tr>
        <tr><td style="padding:0 24px 24px 24px">
          ${emailSignature}
        </td></tr>
      </table>
    </body>
  </html>
`;