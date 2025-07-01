import { emailSignature } from "./shared";

export const renderUserOrderConfirmationEmail = (order) => {
  const digitalItems = order.items.filter((item) => item.product.isDigital);
  const physicalItems = order.items.filter((item) => !item.product.isDigital);

  const renderItemsTable = (items) => `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f0f0f0;text-align:left;">
          <th style="padding:10px;font-size:14px;">Product</th>
          <th style="padding:10px;font-size:14px;">Quantity</th>
          <th style="padding:10px;font-size:14px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">${item.product.title}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;">${item.quantity}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;">₹${item.product.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const renderDigitalDownloads = () =>
    digitalItems
      .map(
        (item) => `
        <div style="margin-bottom:12px;padding:12px;border:1px solid #eee;border-radius:6px;">
          <p style="margin:0 0 6px;"><strong>${item.product.title}</strong></p>
          <a href="${item.product.digitalUrl}" 
             style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;font-weight:500;"
             download>
            📄 Download PDF
          </a>
        </div>
      `
      )
      .join("");

  return `
  <html>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color:#2563eb;padding:24px;text-align:center;color:#ffffff;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px;">🎉 Order Confirmed!</h1>
          <p style="margin:8px 0;font-size:16px;">Hi ${order.customerName}, thanks for shopping with us!</p>
        </div>

        <!-- Order Summary -->
        <div style="padding:24px;">
          <h2 style="font-size:18px;margin-bottom:12px;">📦 Order Summary</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          <p><strong>Placed On:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <!-- Shipping Info -->
        <div style="padding:0 24px 24px 24px;">
          <h2 style="font-size:18px;margin-bottom:12px;">🚚 Shipping Details</h2>
          <p>
            ${order.shippingAddress.name}<br/>
            ${order.shippingAddress.address}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <!-- Product Items -->
        <div style="padding:0 24px 24px 24px;">
          <h2 style="font-size:18px;margin-bottom:12px;">🛍️ Items Ordered</h2>
          ${renderItemsTable(order.items)}
        </div>

        <!-- Digital Downloads Section -->
        ${
          digitalItems.length
            ? `
        <div style="padding:0 24px 24px 24px;">
          <h2 style="font-size:18px;margin-bottom:12px;">📄 Digital Products</h2>
          ${renderDigitalDownloads()}
        </div>
        `
            : ""
        }

        <!-- Final Total -->
        <div style="padding:0 24px 24px 24px;">
          <h3 style="font-size:16px;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
            💰 Total Amount Paid: ₹${order.price.total.toFixed(2)}
          </h3>
        </div>

        <!-- Footer -->
        <div style="padding:24px;text-align:center;font-size:14px;color:#888;border-top:1px solid #eee">
          <p style="margin:0;">Need help? Contact us at <a href="mailto:support@example.com" style="color:#2563eb;text-decoration:none;">support@example.com</a></p>
          <p style="margin:4px 0 12px;">Thank you for shopping with <strong>BlackBird Bookstore</strong> 🖤</p>
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
  `;
};



export const renderAdminOrderNotificationEmail = (order) => `
  <html>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background:#dc2626;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:24px;">📦 New Order Received</h1>
          <p style="margin:8px 0;font-size:16px;">From ${order.customerName}</p>
        </div>

        <!-- Customer Details -->
        <div style="padding:24px;">
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹${order.price.total.toFixed(2)}</p>
        </div>

        <!-- Shipping Address -->
        <div style="padding:0 24px 24px 24px;">
          <h3 style="font-size:18px;margin-bottom:8px;">🚚 Shipping Address</h3>
          <p style="margin:0;">
            ${order.shippingAddress.address},<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
          </p>
        </div>

        <!-- Items Table -->
        <div style="padding:0 24px 24px 24px;">
          <h3 style="font-size:18px;margin-bottom:8px;">🛍️ Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f0f0f0;text-align:left;">
                <th style="padding:10px;font-size:14px;">Product</th>
                <th style="padding:10px;font-size:14px;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding:10px;border-bottom:1px solid #eee;">${item.product.title}</td>
                  <td style="padding:10px;border-bottom:1px solid #eee;">${item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:24px;text-align:center;font-size:14px;color:#888;border-top:1px solid #eee">
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
`;



export const renderUserOrderStatusUpdateEmail = (order) => `
  <html>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background:#10b981;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:24px;">📢 Order Status Update</h1>
        </div>

        <!-- Body -->
        <div style="padding:24px;">
          <p style="font-size:16px;">Hi ${order.customerName},</p>
          <p style="font-size:16px;">Your order <strong>#${order._id}</strong> status has been updated to:</p>
          <div style="margin-top:12px;padding:12px;background-color:#f0fdf4;border-left:4px solid #10b981;border-radius:4px;">
            <strong style="font-size:18px;color:#065f46;">${order.status.toUpperCase()}</strong>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:24px;text-align:center;font-size:14px;color:#888;border-top:1px solid #eee">
          ${emailSignature}
        </div>
      </div>
    </body>
  </html>
`;
