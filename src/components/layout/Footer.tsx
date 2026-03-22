import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-bold mb-3">
              OUD <span className="text-primary-light">ROYAL</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre destination pour les parfums orientaux les plus exquis des maisons émiraties.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-4">Boutique</h4>
            <ul className="space-y-2">
              {[
                { href: '/boutique?category=HOMME', label: 'Homme' },
                { href: '/boutique?category=FEMME', label: 'Femme' },
                { href: '/boutique?category=UNISEX', label: 'Unisex' },
                { href: '/boutique?filter=new', label: 'Nouveautés' },
                { href: '/boutique?filter=promo', label: 'Promotions' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white cursor-pointer">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-4">Maisons</h4>
            <ul className="space-y-2">
              {['Lattafa', 'Maison Alhambra', 'French Avenue', 'Fragrance World'].map((b) => (
                <li key={b}>
                  <Link href={`/boutique?brand=${b.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-white cursor-pointer">{b}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-light mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary-light" />
                <a href="tel:+212600000000" className="text-sm text-gray-400 hover:text-white cursor-pointer">+212 6 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary-light" />
                <a href="mailto:contact@oudroyal.ma" className="text-sm text-gray-400 hover:text-white cursor-pointer">contact@oudroyal.ma</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-primary-light mt-0.5" />
                <span className="text-sm text-gray-400">Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-500">© {new Date().getFullYear()} OUD ROYAL. Tous droits réservés.</p>
          <p className="text-[11px] text-gray-500">💰 Paiement à la livraison &nbsp;•&nbsp; 🚚 Livraison partout au Maroc</p>
        </div>
      </div>

      <a
        href="https://wa.me/212600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer"
      >
        <MessageCircle size={26} className="text-white" />
      </a>
    </footer>
  )
}