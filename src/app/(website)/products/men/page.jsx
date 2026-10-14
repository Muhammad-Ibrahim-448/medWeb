'use client'

import { ProductsPageLayout } from '@/components/products/ProductsPageLayout'

export default function MenProductsPage() {
  return (
    <ProductsPageLayout
      badge="For Him"
      title={
        <>
          Jewellery
          <br />
          <span className="italic">for him.</span>
        </>
      }
      subtitle="Explore refined gold, silver and diamond jewellery crafted for the modern gentleman."
      gender="men"
      heroImage="/images/menproductheader.png"
      heroImageAlt="Men's jewellery collection"
    />
  )
}