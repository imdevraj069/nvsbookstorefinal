import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.from] - Optional: Sender email
 * @returns {Promise}
 */
export const sendEmail = async ({ to, subject, html, from }) => {
  const mailOptions = {
    from: from || `"Nvs Book Store" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("sendEmail Error:", error);
    throw new Error("Failed to send email");
  }
};
