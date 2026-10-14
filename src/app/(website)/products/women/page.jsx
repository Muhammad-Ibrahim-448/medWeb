'use client'

import { ProductsPageLayout } from '@/components/products/ProductsPageLayout'

export default function WomenProductsPage() {
  return (
    <ProductsPageLayout
      badge="For Her"
      title={
        <>
          Jewellery
          <br />
          <span className="italic">for her.</span>
        </>
      }
      subtitle="Discover elegant gold, diamond and silver pieces designed to celebrate her most meaningful moments."
      gender="women"
      heroImage="/images/womenproductheader.png"
      heroImageAlt="Women's jewellery collection"
    />
  )
}