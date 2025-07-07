import ProductDetail from "@/components/store/product-detail"
// import RelatedProducts from "@/components/store/related-products"
import { notFound } from "next/navigation"
import {getProductbyId} from "@/handler/product"

export async function generateMetadata({ params }) {
  const param = await params
  const res = await getProductbyId(param.productId)

  if (!res.ok) {
    return { title: "Product Not Found" }
  }

  const product = await res.json()

  return {
    title: `${product.title} - Nvs Book Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }) {
  const param = await params
  const res = await getProductbyId(param.productId)

  if (!res.ok) {
    notFound()
  }

  const product = await res.json()

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
      {/* <RelatedProducts category={product.category.slug} currentProductId={product._id} /> */}
    </div>
  )
}
