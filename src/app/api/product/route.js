import {
  getProductsHandler,
  getProductCatHandler,
  createProdCatHandler,
  createProducthandler,
  toggleField
} from "@/handler/product";
import { Product } from "@/models/product";
import { error } from "console";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "category") {
      const categories = await getProductCatHandler();
      return Response.json(categories);
    }

    const result = await getProductsHandler();
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    const body = await req.json();
    const { data } = body;

    if (type === "category") {
      const categories = await createProdCatHandler(data);
      return Response.json(categories);
    }

    const result = await createProducthandler(data);
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, field } = await req.json();

    if (!id || !field) {
      return NextResponse.json(
        { success: false, message: "Missing id or field" },
        { status: 400 }
      );
    }

    // safety check
    if (!["isVisible", "isFeatured"].includes(field)) {
      return Response.json(
        { success: false, message: "Invalid field" },
        { status: 400 }
      );
    }

    const result = await toggleField({ id, field, model: Product });
    return Response.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(error);
    return{
      status: 500,
      body: "Internal Server Error actually",
      error
    }
  }
}
