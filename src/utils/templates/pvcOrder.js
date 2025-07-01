// File: /utils/templates/pvcOrder.js

import { emailSignature } from "./shared";

export const renderUserOrderConfirmationEmail = (order) => {
  return `
  <html>
    <body style="margin:0;padding:0;background:#f9f9f9;font-family:sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        <div style="background:#2563eb;color:#fff;padding:24px;text-align:center">
          <h2>✅ PVC Card Order Confirmed!</h2>
          <p>Thanks for your order, ${order.customerName}.</p>
        </div>
        <div style="padding:24px;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
          <h3 style="margin-top:20px;">🛂 Ordered Cards:</h3>
          <ul style="padding-left:20px;">
            ${order.items
              .map(
                (item) => `
              <li style="margin-bottom:12px;">
                <strong>${item.productType.toUpperCase()} (${item.mode})</strong><br/>
                Copies: ${item.copies}<br/>
                Mobile: ${item.details.mobile || "N/A"}<br/>
                ${Object.entries(item.details)
                  .filter(([k]) => k !== "mobile")
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("<br/>")}
              </li>
            `
              )
              .join("")}
          </ul>
          <p><strong>Delivery Address:</strong><br/>${order.address}</p>
          <h3 style="margin-top:20px;">Total: ₹${order.price}</h3>
        </div>
        <div style="padding:16px;text-align:center;font-size:14px;color:#666;border-top:1px solid #eee">
          <p>If you have any questions, reach us at <a href="mailto:support@example.com">support@example.com</a></p>
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
  `;
};

export const renderAdminOrderNotificationEmail = (order) => {
  return `
  <html>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;background:#ffffff;border-radius:8px;">
        <h2 style="color:#dc2626;text-align:center;">📦 New PVC Order Received</h2>
        <p><strong>Customer Name:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>Address:</strong><br/>${order.address}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Total:</strong> ₹${order.price}</p>
        <h3 style="margin-top:24px;">📑 Card Details:</h3>
        <ul style="padding-left:20px;">
          ${order.items
            .map(
              (item) => `
            <li style="margin-bottom:14px;">
              <strong>${item.productType.toUpperCase()} (${item.mode})</strong><br/>
              Copies: ${item.copies}<br/>
              Mobile: ${item.details.mobile || "-"}<br/>
              ${Object.entries(item.details)
                .filter(([k]) => k !== "mobile")
                .map(([k, v]) => `${k}: ${v}`)
                .join("<br/>")}
            </li>
          `
            )
            .join("")}
        </ul>
        <div style="padding-top:24px;text-align:center;font-size:13px;color:#888">
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
  `;
};

export const renderUserPVCOrderStatusUpdateEmail = (order) => {
  return `
  <html>
    <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:sans-serif;">
      <div style="max-width:600px;margin:40px auto;padding:24px;background:#fff;border-radius:8px;">
        <h2 style="text-align:center;background:#10b981;color:#fff;padding:16px;border-radius:6px;">
          📢 Order Status Updated
        </h2>
        <p style="font-size:16px;">Hello ${order.customerName},</p>
        <p>Your PVC card order <strong>#${order._id}</strong> is now:</p>
        <div style="margin:12px 0;padding:12px;background:#f0fdf4;border-left:5px solid #10b981;">
          <strong>${order.status.toUpperCase()}</strong>
        </div>
        <p><strong>Total:</strong> ₹${order.price}</p>
        <div style="text-align:center;padding-top:24px;font-size:13px;color:#666">
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
  `;
};
