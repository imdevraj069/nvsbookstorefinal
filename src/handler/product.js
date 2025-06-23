import {Product, Category} from "@/models/product"
import connectDB from "@/lib/dbConnect"
import {redis} from "@/lib/redis"


export async function getProductsHandler() {
  await connectDB(); // <--- ✅ connect MongoDB before any queries

  const cacheKey = 'products';

  // Try Redis first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { source: 'redis', data: cached };
  }

  // Fetch from MongoDB and cache
  const products = await Product.find({}).lean();
  await redis.set(cacheKey, products, { ex: 3600 });

  return { source: 'mongo', data: products };
}

export async function getProductCatHandler(){
  await connectDB(); //

  const cacheKey = 'productCat';

  const cached = await redis.get(cacheKey);
  if (cached) {
    return { source: 'redis', data: cached };
  }

  const categories = await Category.find({}).sort({name:1}).lean();
  await redis.set(cacheKey, categories, { ex: 3600 });

  return { source: 'mongo', data: categories };
}

export async function getProductbyId(id){

  await connectDB(); //
  const product = await Product.findById(id).lean();
  return Response.json(product);
}