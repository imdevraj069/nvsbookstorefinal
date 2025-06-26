import {getProductbyId, toggleField, toggleVisibility, deleteCategory, updateCategory, toggleFeatured} from '../../../../handler/product';

export async function GET(req, {params}){
  await connectDB()
  const param = await params;
  const product = await getProductbyId(param.id);

  if(!product) return Response.json( {error: "Product not found"}, {status: 404} )

  return Response.json(product)
}


export async function PUT(req, { params }) {
  try {
    const param = await params;
    const body = await req.json();
    const updated =  await updateCategory(param.id, body);
    if (!updated) return Response.json({ error: "Category not found" }, { status: 404 });
    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const param = await params;
    const res = await deleteCategory(param.id);
    return Response.json(res);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}