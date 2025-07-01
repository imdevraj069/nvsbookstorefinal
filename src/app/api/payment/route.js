import Razorpay from "razorpay";

export async function POST(req) {
  const body = await req.json();

  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return new Response(JSON.stringify({ success: false, error: "Razorpay error" }), {
      status: 500,
    });
  }
}
