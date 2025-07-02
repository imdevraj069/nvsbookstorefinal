"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import axios from "axios";
import Script from "next/script";

export default function PVCForm() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("copy");
  const [cardType, setCardType] = useState("");
  const [copies, setCopies] = useState(1);
  const [formData, setFormData] = useState({});
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = (mode === "lost" ? 249 : 99) + (copies - 1) * 99;

  const handleNext = () => {
    if (!cardType) return toast.error("Please select a card type");
    setStep(2);
  };

  const handleRazorpayPayment = async () => {
    if (!address.trim()) return toast.error("Address is required");

    const item = {
      productType: cardType,
      mode,
      copies,
      details: formData,
    };

    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/payment", {
        amount: totalAmount,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "PVC Card Order",
        description: "PVC Card Printing",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await axios.post("/api/pvc-order", {
              items: [item],
              paymentMethod: "razorpay",
              address,
              price: totalAmount,
              razorpay: {
                orderId: data.order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });
            toast.success("Order placed successfully!");
            setStep(1);
            setCardType("");
            setMode("copy");
            setCopies(1);
            setFormData({});
            setAddress("");
          } catch {
            toast.error("Order saving failed after payment");
          }
        },
        prefill: {
          name: formData.fullName || "Customer",
          email: "",
          contact: formData.mobile || "",
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isLost = mode === "lost";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-12 space-y-6 min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-2xl sm:text-3xl font-bold text-center">PVC Card Printing</h1>

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What do you need?</Label>
            <div className="flex gap-4">
              <Button variant={mode === "copy" ? "default" : "outline"} onClick={() => setMode("copy")}>
                Copy
              </Button>
              <Button variant={mode === "lost" ? "default" : "outline"} onClick={() => setMode("lost")}>
                Reissue (Lost)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Card</Label>
            <select className="w-full border rounded px-2 py-2" value={cardType} onChange={(e) => setCardType(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="pan">PAN</option>
              <option value="driving">Driving License</option>
              <option value="voter">Voter ID</option>
              <option value="rc">RC (Vehicle)</option>
              <option value="ayushman">Ayushman Card</option>
            </select>
          </div>

          <Button onClick={handleNext} className="w-full mt-4">Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center text-blue-600">
            You are applying for a <b>{mode.toUpperCase()}</b> of <b>{cardType?.toUpperCase()}</b>
          </h2>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="Enter full name" value={formData.fullName || ""} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Number of Copies ({isLost ? "₹249" : "₹99"} + ₹99/copy)</Label>
            <Input type="number" min={1} max={5} value={copies} onChange={(e) => setCopies(Number(e.target.value))} />
          </div>

          {/* CARD SPECIFIC INPUTS */}
          {cardType === "aadhaar" && (
            <>
              {isLost ? (
                <>
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input placeholder="Enter PAN number" value={formData.panNumber || ""} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Linked to PAN</Label>
                    <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Aadhaar Number</Label>
                    <Input placeholder="Enter Aadhaar number" value={formData.aadhaarNumber || ""} onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                </>
              )}
            </>
          )}

          {cardType === "pan" && (
            <>
              {isLost ? (
                <>
                  <div className="space-y-2">
                    <Label>Aadhaar Number</Label>
                    <Input placeholder="Enter Aadhaar number" value={formData.aadhaarNumber || ""} onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Linked to Aadhaar</Label>
                    <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input placeholder="Enter PAN number" value={formData.panNumber || ""} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>DOB</Label>
                    <Input placeholder="Enter DOB" value={formData.dob || ""} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                </>
              )}
            </>
          )}

          {cardType === "voter" && isLost && (
            <>
              <div className="space-y-2">
                <Label>Aadhaar Number (Optional)</Label>
                <Input placeholder="Enter Aadhaar number" value={formData.aadhaarNumber || ""} onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>PAN Number (Optional)</Label>
                <Input placeholder="Enter PAN number" value={formData.panNumber || ""} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </>
          )}

          {cardType === "voter" && !isLost && (
            <>
              <div className="space-y-2">
                <Label>Voter ID</Label>
                <Input placeholder="Enter Voter ID" value={formData.voterId || ""} onChange={(e) => setFormData({ ...formData, voterId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input placeholder="Enter state" value={formData.state || ""} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </>
          )}

          {cardType === "driving" && (
            <>
              <div className="space-y-2">
                <Label>DL Number</Label>
                <Input placeholder="Enter DL number" value={formData.dlNumber || ""} onChange={(e) => setFormData({ ...formData, dlNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input placeholder="Enter state" value={formData.state || ""} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </>
          )}

          {cardType === "rc" && (
            <>
              <div className="space-y-2">
                <Label>RC Number</Label>
                <Input placeholder="Enter RC number" value={formData.rcNumber || ""} onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input placeholder="Enter vehicle number" value={formData.vehicleNumber || ""} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </>
          )}

          {cardType === "ayushman" && (
            <>
              <div className="space-y-2">
                <Label>Aadhaar Number</Label>
                <Input placeholder="Enter Aadhaar number" value={formData.abhaOrAadhaar || ""} onChange={(e) => setFormData({ ...formData, abhaOrAadhaar: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="Enter mobile number" value={formData.mobile || ""} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>
            </>
          )}

          {/* Address */}
          <div className="space-y-2">
            <Label>Delivery Address</Label>
            <textarea className="w-full border rounded p-2" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter full shipping address" />
          </div>

          <div className="flex justify-between font-semibold bg-green-100 p-3 rounded mt-4">
            <span>Total:</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>⬅ Back</Button>
            <Button onClick={handleRazorpayPayment} disabled={isLoading}>
              {isLoading ? "Processing..." : "Pay & Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
