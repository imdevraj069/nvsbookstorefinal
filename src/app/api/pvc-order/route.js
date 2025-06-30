// /app/api/pvc-order/route.js
import { createPVCOrderHandler } from "../../../handler/pvcOrder";

export async function POST(req) {
  const body = await req.json();
  const result = await createPVCOrderHandler(body);
  return new Response(JSON.stringify(result), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}
