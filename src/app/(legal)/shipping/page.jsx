export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Shipping & Delivery Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: June 27, 2025</p>

      <p className="mb-4">
        This Shipping & Delivery Policy is part of our{" "}
        <a
          href="/terms"
          className="text-blue-600 hover:underline"
        >
          Terms and Conditions
        </a>{" "}
        and should be read alongside them.
      </p>
      <p className="mb-6">
        Please carefully review this policy when purchasing from us. It applies to any order you place.
      </p>

      <h2 className="text-xl font-semibold mb-2">What are my shipping & delivery options?</h2>

      <h3 className="text-lg font-medium mt-4 mb-1">In-Store Pickup</h3>
      <p className="mb-4">
        In-store pickup is available for all orders. Pickups are available Monday - Friday from 10:00 AM to 05:00 PM.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-1">Free Shipping</h3>
      <p className="mb-4">
        We offer <strong>free standard shipping</strong> on all orders above ₹500.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-1">Shipping Fees</h3>
      <p className="mb-2">We also offer shipping at the following rates:</p>
      <table className="w-full text-sm text-left border border-gray-300 mb-4">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border border-gray-300">Method</th>
            <th className="p-2 border border-gray-300">Delivery Time</th>
            <th className="p-2 border border-gray-300">Order Value</th>
            <th className="p-2 border border-gray-300">Shipping Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border border-gray-300">Standard</td>
            <td className="p-2 border border-gray-300">5-7 business days</td>
            <td className="p-2 border border-gray-300">₹0 - ₹499</td>
            <td className="p-2 border border-gray-300">₹50</td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-300">Standard</td>
            <td className="p-2 border border-gray-300">5-7 business days</td>
            <td className="p-2 border border-gray-300">₹500+</td>
            <td className="p-2 border border-gray-300">Free</td>
          </tr>
        </tbody>
      </table>

      <p className="mb-4">
        If you select a specific shipping option, we will follow up post-purchase with additional info.
      </p>

      <p className="mb-6 text-sm text-gray-600">
        All delivery estimates are provided in good faith but are not guaranteed.
      </p>

      <h2 className="text-xl font-semibold mb-2">Do you deliver internationally?</h2>
      <p className="mb-6">Currently, we do <strong>not</strong> offer international shipping.</p>

      <h2 className="text-xl font-semibold mb-2">What happens if my order is delayed?</h2>
      <p className="mb-6">
        If your delivery is delayed, we will notify you as soon as possible and provide a revised estimated delivery date.
      </p>

      <h2 className="text-xl font-semibold mb-2">Questions about returns?</h2>
      <p className="mb-6">
        Please review our{" "}
        <a
          href="/return-policy"
          className="text-blue-600 hover:underline"
        >
          Return & Refund Policy
        </a>{" "}
        for more details.
      </p>

      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <p className="mb-2">If you have any questions about this policy, contact us:</p>
      <ul className="list-disc ml-6 text-sm">
        <li>Email: <a href="mailto:info.nvsbookstore@gmail.com" className="text-blue-600 hover:underline">info.nvsbookstore@gmail.com</a></li>
        <li>Online form: <a href="/contact" className="text-blue-600 hover:underline">nvsbookstore.vercel.app/contact</a></li>
      </ul>
    </div>
  );
}
