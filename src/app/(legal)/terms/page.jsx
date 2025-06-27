export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 27, 2025</p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          These Terms and Conditions ("Terms") govern your use of the website{" "}
          <a href="https://nvsbookstore.vercel.app" className="text-blue-600 underline">
            https://nvsbookstore.vercel.app
          </a>{" "}
          (the "Website") operated by NVS Book Store ("we", "us", or "our").
        </p>

        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Website, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access the Website.
        </p>

        <h2 className="text-xl font-semibold">2. Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.
        </p>

        <h2 className="text-xl font-semibold">3. Purchases</h2>
        <p>
          All purchases made through our Website are subject to product availability, price confirmation, and payment verification. We reserve the right to refuse or cancel orders.
        </p>

        <h2 className="text-xl font-semibold">4. Digital Products</h2>
        <p>
          Digital products (like eBooks or downloadable PDFs) are non-refundable once downloaded. Please ensure your device compatibility before purchase.
        </p>

        <h2 className="text-xl font-semibold">5. Shipping & Delivery</h2>
        <p>
          Our Shipping & Delivery Policy forms part of these Terms. You can read it at{" "}
          <a href="/shipping" className="text-blue-600 underline">Shipping Policy</a>.
        </p>

        <h2 className="text-xl font-semibold">6. Returns & Refunds</h2>
        <p>
          We do not offer returns or refunds on most items. Exceptions are only made for damaged or incorrect deliveries. Please read our full{" "}
          <a href="/return" className="text-blue-600 underline">Return & Refund Policy</a>.
        </p>

        <h2 className="text-xl font-semibold">7. Intellectual Property</h2>
        <p>
          The Website and its content are the exclusive property of NVS Book Store. You may not reproduce, modify, or distribute any content without permission.
        </p>

        <h2 className="text-xl font-semibold">8. Termination</h2>
        <p>
          We may terminate or suspend your access to the Website immediately, without notice, for any reason, including breach of these Terms.
        </p>

        <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms at any time. Changes will be posted on this page and take effect immediately upon posting.
        </p>

        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, you can reach us at{" "}
          <a href="mailto:info.nvsbookstore@gmail.com" className="text-blue-600 underline">
            info.nvsbookstore@gmail.com
          </a>{" "}
          or through our{" "}
          <a href="/contact" className="text-blue-600 underline">
            contact page
          </a>.
        </p>
      </section>
    </div>
  );
}
