'use client'

import { ProductsPageLayout } from '@/components/products/ProductsPageLayout'

export default function ProductsPage() {
  return (
    <ProductsPageLayout
      badge="Shoaib Jewellers"
      title={
        <>
          Jewellery
          <br />
          <span className="italic">worth remembering.</span>
        </>
      }
      subtitle="Explore our complete collection of gold, diamond and silver jewellery, thoughtfully designed for the moments that become part of your story."
      gender={null}
    />
  )
}