import connectDB from "@/lib/dbConnect";
import { Product } from "@/models/product";
import {getProductbySlug, deleteCategory, updateCategory} from '../../../../handler/product';

export async function GET(req, {params}){
  await connectDB()
  const param = await params;
  const product = await Product.findOne({ slug: param.slug });

  if(!product) return Response.json( {error: "Product not found"}, {status: 404} )

  return Response.json(product)
}


export async function PUT(req, { params }) {
  try {
    const param = await params;
    const body = await req.json();
    const product = await Product.findOne({ slug: param.slug });
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    
    Object.assign(product, body);
    await product.save();
    return Response.json(product);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const param = await params;
    const deleted = await Product.findOneAndDelete({ slug: param.slug });
    if (!deleted) return Response.json({ error: "Product not found" }, { status: 404 });
    return Response.json(deleted);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}