'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  ChevronDown,
  Heart,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const cartItems = useCartStore((s) => s.items)
  const openCart = useCartStore((s) => s.openCart)
  const favItems = useFavoritesStore((s) => s.items)

  useEffect(() => { setMounted(true) }, [])
  const totalCartItems = mounted ? cartItems.reduce((sum, i) => sum + i.quantity, 0) : 0
  const totalFavItems = mounted ? favItems.length : 0

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenMobileSubmenu(null)
  }, [pathname])

  return (
    <>
      {/* Barre promo */}
      <div className="bg-primary py-1.5 text-center">
        <p className="text-[11px] text-white tracking-wide">
          LIVRAISON GRATUITE DÈS 500 DH &nbsp;•&nbsp; PAIEMENT À LA LIVRAISON &nbsp;•&nbsp; 100% AUTHENTIQUE
        </p>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            {/* Mobile menu */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-700 hover:text-accent transition-colors cursor-pointer">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
              <span className="font-playfair text-lg sm:text-xl font-bold text-gray-900">
                OUD <span className="text-primary">ROYAL</span>
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center h-full">
              <NavItem href="/" label="Accueil" active={pathname === '/'} />
              <HoverDropdown
                label="Boutique"
                items={[
                  { label: 'Tous les parfums', href: '/boutique' },
                  { label: 'Homme', href: '/boutique?category=HOMME' },
                  { label: 'Femme', href: '/boutique?category=FEMME' },
                  { label: 'Unisex', href: '/boutique?category=UNISEX' },
                ]}
              />
              <HoverDropdown
                label="Maisons"
                items={[
                  { label: 'Lattafa', href: '/boutique?brand=lattafa' },
                  { label: 'Maison Alhambra', href: '/boutique?brand=maison-alhambra' },
                  { label: 'French Avenue', href: '/boutique?brand=french-avenue' },
                  { label: 'Fragrance World', href: '/boutique?brand=fragrance-world' },
                ]}
              />
              <NavItem href="/boutique?filter=new" label="Nouveautés" />
              <NavItem href="/boutique?filter=promo" label="Promos" />
              <NavItem href="/notre-maison" label="Notre Maison" active={pathname === '/notre-maison'} />
            </nav>

            {/* Actions droite */}
            <div className="flex items-center gap-2">
              <a href="tel:+212600000000" className="hidden xl:flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent transition-colors cursor-pointer">
                <Phone size={13} />
                +212 6 00 00 00 00
              </a>

              {/* Favoris */}
              <Link href="/favoris" className="relative p-2 text-gray-700 hover:text-accent transition-colors cursor-pointer">
                <Heart size={20} />
                {mounted && totalFavItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {totalFavItems}
                  </span>
                )}
              </Link>

              {/* Panier */}
              <button onClick={() => openCart()} className="relative p-2 text-gray-700 hover:text-accent transition-colors cursor-pointer">
                <ShoppingBag size={20} />
                {mounted && totalCartItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <nav className="container-custom py-3 flex flex-col">
                <MobileLink href="/" label="Accueil" />
                <MobileDropdown
                  label="Boutique"
                  isOpen={openMobileSubmenu === 'Boutique'}
                  onToggle={() => setOpenMobileSubmenu(openMobileSubmenu === 'Boutique' ? null : 'Boutique')}
                  items={[
                    { label: 'Tous les parfums', href: '/boutique' },
                    { label: 'Homme', href: '/boutique?category=HOMME' },
                    { label: 'Femme', href: '/boutique?category=FEMME' },
                    { label: 'Unisex', href: '/boutique?category=UNISEX' },
                  ]}
                />
                <MobileDropdown
                  label="Maisons"
                  isOpen={openMobileSubmenu === 'Maisons'}
                  onToggle={() => setOpenMobileSubmenu(openMobileSubmenu === 'Maisons' ? null : 'Maisons')}
                  items={[
                    { label: 'Lattafa', href: '/boutique?brand=lattafa' },
                    { label: 'Maison Alhambra', href: '/boutique?brand=maison-alhambra' },
                    { label: 'French Avenue', href: '/boutique?brand=french-avenue' },
                    { label: 'Fragrance World', href: '/boutique?brand=fragrance-world' },
                  ]}
                />
                <MobileLink href="/boutique?filter=new" label="Nouveautés" />
                <MobileLink href="/boutique?filter=promo" label="Promos" />
                <MobileLink href="/favoris" label="♡ Mes Favoris" />
                <MobileLink href="/notre-maison" label="Notre Maison" />
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  )
}

/* ─── Composants internes ─── */

function NavItem({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${active ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}>
      {label}
    </Link>
  )
}

function HoverDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)
  let timeout: ReturnType<typeof setTimeout>
  const handleMouseEnter = () => { clearTimeout(timeout); setIsOpen(true) }
  const handleMouseLeave = () => { timeout = setTimeout(() => setIsOpen(false), 150) }

  return (
    <div className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${isOpen ? 'text-accent' : 'text-gray-600 hover:text-accent'}`}>
        {label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-100 shadow-xl shadow-black/5 overflow-hidden"
          >
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-accent hover:bg-accent-soft transition-colors cursor-pointer">
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-accent transition-colors cursor-pointer">
      {label}
    </Link>
  )
}

function MobileDropdown({ label, isOpen, onToggle, items }: { label: string; isOpen: boolean; onToggle: () => void; items: { label: string; href: string }[] }) {
  return (
    <div>
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-accent transition-colors cursor-pointer">
        {label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-4 border-l-2 border-accent/30 overflow-hidden"
          >
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-500 hover:text-accent transition-colors cursor-pointer">
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}