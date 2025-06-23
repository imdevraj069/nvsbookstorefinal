import {getProductbyId} from '../../../../handler/product';

export async function GET(req, {params}){
  await connectDB()
  const param = await params;
  const product = await getProductbyId(param.id);

  if(!product) return Response.json( {error: "Product not found"}, {status: 404} )

  return Response.json(product)
}