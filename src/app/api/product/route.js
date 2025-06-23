import {getProductsHandler, getProductCatHandler} from '@/handler/product';

export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if(type === "category"){
      const categories = await getProductCatHandler();
      return Response.json(categories)
    }

    const result = await getProductsHandler();
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
