import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import BrandsSection from '@/components/home/BrandsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellers from '@/components/home/BestSellers'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Testimonials from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandsSection />
        <FeaturedProducts />
        <BestSellers />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}