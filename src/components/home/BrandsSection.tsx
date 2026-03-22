'use client'

import Link from 'next/link'

const brands = [
  { name: 'Lattafa', slug: 'lattafa' },
  { name: 'Maison Alhambra', slug: 'maison-alhambra' },
  { name: 'French Avenue', slug: 'french-avenue' },
  { name: 'Fragrance World', slug: 'fragrance-world' },
]

export default function BrandsSection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/boutique?brand=${brand.slug}`}
              className="text-gray-300 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="font-playfair text-lg sm:text-xl font-semibold tracking-wide">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}