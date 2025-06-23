// /app/store/page.js

import { Suspense } from "react"
import StorePageClient from "./store-page-client"

export const metadata = {
  title: "Store - Nvs Book Store",
  description: "Books, study materials, test series, and more for competitive exams",
}

export default function StorePage() {
  return (
    <Suspense fallback={<div>Loading store...</div>}>
      <StorePageClient />
    </Suspense>
  )
}
