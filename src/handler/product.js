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

export async function createProdCatHandler(newCategory){
  if (!newCategory.trim()) throw new Error("Category name is required");

  const categoryName = newCategory.trim();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

  await connectDB();

  try {
    // Check if category with the same slug already exists
    const existing = await Category.findOne({ slug: categorySlug });
    if (existing) {
      return { success: false, message: "Category already exists" };
    }

    // Create new category
    const category = new Category({
      name: categoryName,
      slug: categorySlug,
    });

    await category.save();

    // Clear Redis cache so fresh list is fetched next time
    await redis.del("productCat");

    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return {
      success: false,
      message: "Something went wrong while creating category",
      error: error.message,
    };
  }
}

export async function createProducthandler(data){
  await connectDB()

  const newCategory = await Product.create({
    ...data,
    category: {
      name: data.category.name,
      slug: data.category.slug
    },
  })

  await redis.del("products")

  return{
    success: true,
    message: "Product created successfully",
    data: newCategory
  }
}

export async function toggleVisibility(id){
  await connectDB()
  const category = await Product.findById(id)
  if(category){
    try {
      category.isVisible = !category.isVisible
      await category.save()
      await redis.del("products" )
      return{
        success: true,
        message: "Visibility toggled successfully",
        data: category
      }
    } catch (error) {
      console.error("❌ Error toggling visibility:", error);
      return {
        success: false,
        message: "Something went wrong while toggling visibility",
        error: error.message
      }
    }
  }else{
    return{
      success: false,
      message: "Notification not found",
    }
  }

}

export async function deleteCategory(id){
  await connectDB()
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted){
      return{
        success: false,
        message: "Category not found",
      }
    }
    await redis.del("products")
    return{
      success: true,
      message: "Category deleted successfully",
      data: deleted
    }
  } catch (error) {
    return       {
        success: false,
        message: "Something went wrong while deleting category",
        error
      }
  }
}

export async function updateCategory(id, data){
  await connectDB()
  try {
    const updated = await Product.findByIdAndUpdate(id, data, {new: true});
    if (!updated){
      return{
        success: false,
        message: "Category not found",
      }
    }
    await redis.del("products")
    return {
      success: true,
      message: "Category updated successfully",
      data: updated
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while updating category",
      error
    }
  }
}