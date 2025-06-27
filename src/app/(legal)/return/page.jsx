export default function ReturnPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Return & Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 27, 2025</p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Thank you for shopping at <strong>NVS Book Store</strong>. We currently do not accept any returns or offer refunds for purchases made through our platform.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        All sales are considered final once your order has been confirmed and payment is completed. We encourage you to review your cart carefully before placing an order.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        In the rare event that you receive a damaged or incorrect item, please contact us within 48 hours of delivery at{" "}
        <a
          href="mailto:info.nvsbookstore@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          info.nvsbookstore@gmail.com
        </a>{" "}
        or via our{" "}
        <a
          href="/contact"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Contact Page
        </a>
        .
      </p>

      <p className="text-gray-700 leading-relaxed">
        We appreciate your understanding and continued support. For more information, please review our{" "}
        <a
          href="/terms"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Terms & Conditions
        </a>
        .
      </p>
    </div>
  );
}
