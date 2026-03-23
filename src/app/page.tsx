import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import BrandsSection from '@/components/home/BrandsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellers from '@/components/home/BestSellers'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'
import prisma from '@/lib/prisma'

export default async function HomePage() {
  // Charger les avis approuvés depuis la DB
  const reviews = await prisma.siteReview.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      rating: true,
      comment: true,
      createdAt: true,
    },
  })

  // Sérialiser les dates pour le client component
  const serializedReviews = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandsSection />
        <FeaturedProducts />
        <BestSellers />
        <WhyChooseUs />
        <Testimonials reviews={serializedReviews} />
      </main>
      <Footer />
    </>
  )
}