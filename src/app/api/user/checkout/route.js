import {createOrderHandler} from "@/handler/order"

export async function POST(req) {
  const body = await req.json();
  const result = await createOrderHandler(body);

  return new Response(JSON.stringify(result), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}