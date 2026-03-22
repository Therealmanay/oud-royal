import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export const metadata = {
  title: 'Checkout - Passer commande',
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="bg-cream border-b border-gray-100 py-8">
          <div className="container-custom">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Finaliser votre commande
            </h1>
          </div>
        </div>
        <div className="container-custom py-8">
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  )
}