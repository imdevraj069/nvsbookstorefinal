"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react";
import { useCartStore } from "@/utils/store/useCartStore";
import axios from "axios"

export default function CheckoutForm() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  paymentMethod: "card",
});

useEffect(() => {
  if (status === "authenticated" && user) {
    setFormData((prev) => ({
      ...prev,
      email: user.email || "",
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ").slice(1).join(" ") || "",
      address: user.address || "",
      phone: user.phone || "",
    }));
  }
}, [status, user]);


  // Mock cart items - in a real app, this would come from cart context
  const cartItems = useCartStore((s) => s.cartItems);
  const clearCartAndSync = useCartStore((s) => s.clearCartAndSync);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = cartItems.length > 0 ? 0.1 * subtotal : 0;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const price = {
      subtotal,
      discount,
      shipping,
      total: Number(total.toFixed(2)),
    }

    const orderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      items: cartItems,
      paymentMethod: formData.paymentMethod,
      price,
    }

    try {
      if (formData.paymentMethod !== "cod") {
        alert("Only Cash on Delivery is allowed at the moment.")
        return
      }

      const result = await axios.post("/api/user/checkout", orderData);

      if (result.data.success) {
        await clearCartAndSync(); // clears both local and remote cart
        router.push(`/order-success?orderId=${result.data.data._id}`);
      } else {
        throw new Error(result.data.error || "Order failed");
      }
    } catch (error) {
      console.error("Order failed:", error)
      alert("Order failed: " + error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={formData.email} disabled onChange={handleInputChange} required />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="pincode">PIN Code</Label>
            <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={handleInputChange}
            />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === "upi"}
              onChange={handleInputChange}
            />
            <span>UPI</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="netbanking"
              checked={formData.paymentMethod === "netbanking"}
              onChange={handleInputChange}
            />
            <span>Net Banking</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleInputChange}
            />
            <span>Cash on Delivery</span>
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Processing Order..." : "Place Order"}
      </Button>
    </form>
  )
}
