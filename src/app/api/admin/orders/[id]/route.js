import { updateOrderStatusHandler, getOrderByIdHandler } from "@/handler/order";

export async function PUT(req, { params }) {
  const { status } = await req.json();
  const param = await params
  const result = await updateOrderStatusHandler(param.id, status);
  return Response.json(result, { status: result.status });
}

export async function GET(req, { params }) {
  const param = await params

  const result = await getOrderByIdHandler(param.id);

  return new Response(JSON.stringify(result), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
}