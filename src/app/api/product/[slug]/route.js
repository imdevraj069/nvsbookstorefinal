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
    console.log("📝 PUT /api/product - ID:", param.slug);
    console.log("📝 Update data:", body);
    
    // Try to find by ID first, then by slug as fallback
    let product = await Product.findById(param.slug);
    
    if (!product) {
      console.log("⚠️ Not found by ID, trying slug...");
      product = await Product.findOne({ slug: param.slug });
    }
    
    if (!product) {
      console.log("❌ Product not found");
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    
    Object.assign(product, body);
    await product.save();
    console.log("✅ Product updated successfully");
    return Response.json(product);
  } catch (error) {
    console.error("❌ PUT error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const param = await params;
    console.log("🗑️ DELETE /api/product - ID:", param.slug);
    
    // Try to find by ID first, then by slug as fallback
    let deleted = await Product.findByIdAndDelete(param.slug);
    
    if (!deleted) {
      console.log("⚠️ Not found by ID, trying slug...");
      deleted = await Product.findOneAndDelete({ slug: param.slug });
    }
    
    if (!deleted) {
      console.log("❌ Product not found");
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    
    console.log("✅ Product deleted successfully:", deleted.title);
    return Response.json(deleted);
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}